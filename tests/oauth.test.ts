import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, test } from 'node:test';
import type { IncomingMessage, ServerResponse } from 'node:http';
import auth from '../api/auth.ts';
import callback from '../api/callback.ts';
import { newState, oauthConfig, stateMatches } from '../api/_lib/oauth.ts';

const environmentKeys = ['CMS_ORIGIN', 'GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET', 'GITHUB_OAUTH_SCOPE'] as const;
const initialEnvironment = Object.fromEntries(environmentKeys.map((key) => [key, process.env[key]]));
const originalFetch = globalThis.fetch;

interface CapturedResponse {
  response: ServerResponse;
  headers: Record<string, string | number | readonly string[]>;
  body: string;
}

function response(): CapturedResponse {
  const capture: CapturedResponse = { response: {} as ServerResponse, headers: {}, body: '' };
  const stub = {
    statusCode: 200,
    setHeader(name: string, value: string | number | readonly string[]) {
      capture.headers[name.toLowerCase()] = value;
      return stub;
    },
    end(value = '') {
      capture.body = String(value);
      return stub;
    },
  };
  capture.response = stub as unknown as ServerResponse;
  return capture;
}

function request(url = '/', cookie = '', method = 'GET'): IncomingMessage {
  return { method, url, headers: { cookie } } as unknown as IncomingMessage;
}

function startSession(): { state: string; cookie: string; capture: CapturedResponse } {
  const capture = response();
  auth(request('/api/auth'), capture.response);
  const redirect = new URL(String(capture.headers.location));
  const state = redirect.searchParams.get('state');
  assert.ok(state);
  return { state, cookie: String(capture.headers['set-cookie']).split(';')[0], capture };
}

describe('OAuth', () => {
beforeEach(() => {
  for (const key of environmentKeys) delete process.env[key];
  process.env.CMS_ORIGIN = 'https://maria.example';
  process.env.GITHUB_CLIENT_ID = 'synthetic-client';
  process.env.GITHUB_CLIENT_SECRET = 'synthetic-client-secret';
  // Any unexpected call fails this test rather than reaching the network.
  globalThis.fetch = async () => { throw new Error('Unexpected network request in OAuth test'); };
});

afterEach(() => {
  for (const key of environmentKeys) {
    const value = initialEnvironment[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  globalThis.fetch = originalFetch;
});

test('OAuth returns 503 when deployment credentials are missing', async () => {
  delete process.env.GITHUB_CLIENT_SECRET;
  const authResponse = response();
  auth(request(), authResponse.response);
  assert.equal(authResponse.response.statusCode, 503);
  assert.equal(authResponse.headers['cache-control'], 'no-store, max-age=0');
  assert.equal(authResponse.headers.location, undefined);
  const callbackResponse = response();
  await callback(request('/api/callback'), callbackResponse.response);
  assert.equal(callbackResponse.response.statusCode, 503);
  assert.ok(!callbackResponse.body.includes('undefined'));
});

test('OAuth configuration rejects non-local HTTP, credentials and origin paths', () => {
  for (const origin of ['http://maria.example', 'https://user:password@maria.example', 'https://maria.example/other', 'https://maria.example/?redirect=evil']) {
    process.env.CMS_ORIGIN = origin;
    assert.equal(oauthConfig(), null);
  }
  process.env.CMS_ORIGIN = 'http://localhost:4321';
  assert.equal(oauthConfig()?.secure, false);
});

test('auth redirects only to GitHub with server-selected scope and secure short-lived cookie', () => {
  const capture = response();
  auth(request('/api/auth?scope=repo&redirect_uri=https://evil.example&site_id=evil.example'), capture.response);
  assert.equal(capture.response.statusCode, 302);
  const redirect = new URL(String(capture.headers.location));
  assert.equal(redirect.origin, 'https://github.com');
  assert.equal(redirect.pathname, '/login/oauth/authorize');
  assert.equal(redirect.searchParams.get('redirect_uri'), 'https://maria.example/api/callback');
  assert.equal(redirect.searchParams.get('scope'), 'public_repo');
  assert.equal(redirect.searchParams.get('state')?.length, 43);
  const cookie = String(capture.headers['set-cookie']);
  assert.match(cookie, /^__Host-mr_oauth_state=/);
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /SameSite=Lax/);
  assert.match(cookie, /Max-Age=600/);
  assert.match(cookie, /Secure/);
  process.env.GITHUB_OAUTH_SCOPE = 'repo';
  const privateResponse = response();
  auth(request('/api/auth?scope=public_repo'), privateResponse.response);
  assert.equal(new URL(String(privateResponse.headers.location)).searchParams.get('scope'), 'repo');
});

test('state validation rejects mismatches and duplicate cookies', () => {
  const { state, cookie } = startSession();
  const config = oauthConfig();
  assert.ok(config);
  assert.equal(stateMatches(request('/', cookie), config, state), true);
  assert.equal(stateMatches(request('/', cookie), config, newState()), false);
  assert.equal(stateMatches(request('/', cookie + '; ' + cookie), config, state), false);
  assert.equal(stateMatches(request('/', cookie), config, null), false);
});

test('callback rejects invalid or duplicate state before contacting GitHub', async () => {
  const { state, cookie } = startSession();
  let calls = 0;
  globalThis.fetch = async () => { calls += 1; throw new Error('Should not reach provider'); };
  const mismatch = response();
  await callback(request('/api/callback?code=example&state=' + newState(), cookie), mismatch.response);
  assert.equal(mismatch.response.statusCode, 401);
  const duplicate = response();
  await callback(request(`/api/callback?code=example&state=${state}&state=${state}`, cookie), duplicate.response);
  assert.equal(duplicate.response.statusCode, 401);
  assert.equal(calls, 0);
  assert.match(String(duplicate.headers['set-cookie']), /Max-Age=0/);
});

test('callback success uses nonce CSP and verifies exact opener and origin before exposing token', async () => {
  const { state, cookie } = startSession();
  let calls = 0;
  globalThis.fetch = async (input, init) => {
    calls += 1;
    assert.equal(String(input), 'https://github.com/login/oauth/access_token');
    assert.equal(init?.method, 'POST');
    assert.equal(init?.redirect, 'error');
    const body = init?.body as URLSearchParams;
    assert.equal(body.get('redirect_uri'), 'https://maria.example/api/callback');
    return new Response(JSON.stringify({ access_token: 'synthetic_token_only_for_test', token_type: 'bearer' }), { status: 200 });
  };
  const capture = response();
  await callback(request(`/api/callback?code=synthetic_code&state=${state}`, cookie), capture.response);
  assert.equal(capture.response.statusCode, 200);
  assert.equal(calls, 1);
  assert.equal(capture.headers['cache-control'], 'no-store, max-age=0');
  assert.match(String(capture.headers['content-security-policy']), /script-src 'nonce-/);
  assert.match(capture.body, /event\.origin !== trustedOrigin/);
  assert.match(capture.body, /event\.source !== opener/);
  assert.match(capture.body, /event\.data !== 'authorizing:github'/);
  assert.match(capture.body, /opener\.postMessage\(response, trustedOrigin\)/);
  assert.match(capture.body, /authorization:github:success:/);
  assert.match(capture.body, /synthetic_token_only_for_test/);
  assert.ok(!capture.body.includes('postMessage(response, "*")'));
  assert.ok(!capture.body.includes('synthetic-client-secret'));
});

test('provider failure returns a generic message without echoing errors or credentials', async () => {
  const { state, cookie } = startSession();
  globalThis.fetch = async () => { throw new Error('sensitive-provider-detail synthetic-client-secret'); };
  const capture = response();
  await callback(request(`/api/callback?code=example&state=${state}`, cookie), capture.response);
  assert.equal(capture.response.statusCode, 502);
  assert.match(capture.body, /authorization:github:error:/);
  assert.ok(!capture.body.includes('sensitive-provider-detail'));
  assert.ok(!capture.body.includes('synthetic-client-secret'));
});

test('provider error response cannot be relayed as a successful login', async () => {
  const { state, cookie } = startSession();
  globalThis.fetch = async () => new Response(JSON.stringify({ error: 'bad_verification_code', error_description: 'sensitive-provider-detail' }), { status: 200 });
  const capture = response();
  await callback(request(`/api/callback?code=example&state=${state}`, cookie), capture.response);
  assert.equal(capture.response.statusCode, 400);
  assert.match(capture.body, /authorization:github:error:/);
  assert.ok(!capture.body.includes('authorization:github:success:'));
  assert.ok(!capture.body.includes('sensitive-provider-detail'));
});
});
