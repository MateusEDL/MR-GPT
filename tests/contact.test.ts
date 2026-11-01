import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, test } from 'node:test';
import handler from '../api/contact.ts';
import type { ApiRequest, ApiResponse } from '../api/_lib/http.ts';

const ORIGIN = 'https://maria.example';
const KEYS = ['SITE_URL', 'CMS_ORIGIN', 'CONTACT_WEBHOOK_URL', 'CONTACT_WEBHOOK_TOKEN'] as const;
const originalFetch = globalThis.fetch;
let snapshot: Record<string, string | undefined>;
let requestCounter = 0;

describe('Contact API', () => {
beforeEach(() => {
  snapshot = Object.fromEntries(KEYS.map((key) => [key, process.env[key]]));
  process.env.SITE_URL = ORIGIN;
  delete process.env.CMS_ORIGIN;
  delete process.env.CONTACT_WEBHOOK_URL;
  delete process.env.CONTACT_WEBHOOK_TOKEN;
  globalThis.fetch = async () => { throw new Error('Unexpected network request in contact test'); };
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const key of KEYS) {
    if (snapshot[key] === undefined) delete process.env[key];
    else process.env[key] = snapshot[key];
  }
});

function validBody(): Record<string, unknown> {
  return {
    name: 'Pessoa de teste', email: 'teste@example.org', city: 'Jaraguá do Sul/SC',
    subject: 'cultura', message: 'Gostaria de propor uma oficina cultural.', consent: true, website: '',
  };
}

function request(body: unknown = validBody(), overrides: Partial<ApiRequest> = {}): ApiRequest {
  requestCounter += 1;
  return {
    method: 'POST', body,
    headers: { origin: ORIGIN, 'content-type': 'application/json', 'x-forwarded-for': `test-${requestCounter}` },
    ...overrides,
  };
}

type CapturedResponse = ApiResponse & {
  statusCode: number;
  headers: Record<string, string | string[]>;
  body: unknown;
};

function response(): CapturedResponse {
  const captured: CapturedResponse = {
    statusCode: 0, headers: {}, body: undefined,
    status(statusCode) { captured.statusCode = statusCode; return captured; },
    setHeader(name, value) { captured.headers[name.toLowerCase()] = value; },
    json(body) { captured.body = body; },
    end(body) { captured.body = body; },
  };
  return captured;
}

async function call(req: ApiRequest): Promise<CapturedResponse> {
  const res = response();
  await handler(req, res);
  assert.equal(res.headers['cache-control'], 'no-store');
  return res;
}

test('contact: rejects other methods with Allow POST', async () => {
  const res = await call(request(undefined, { method: 'GET' }));
  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.allow, 'POST');
});

test('contact: unavailable configuration never reports successful delivery', async () => {
  delete process.env.SITE_URL;
  const missingOrigin = await call(request());
  assert.equal(missingOrigin.statusCode, 503);
  process.env.SITE_URL = ORIGIN;
  const missingReceiver = await call(request());
  assert.equal(missingReceiver.statusCode, 503);
  assert.ok('error' in (missingReceiver.body as object));
  assert.ok(!('message' in (missingReceiver.body as object)));
});

test('contact: refuses an untrusted browser origin', async () => {
  const req = request();
  req.headers.origin = 'https://untrusted.example';
  const res = await call(req);
  assert.equal(res.statusCode, 403);
});

test('contact: requires JSON request type', async () => {
  const req = request();
  req.headers['content-type'] = 'text/plain';
  const res = await call(req);
  assert.equal(res.statusCode, 415);
});

test('contact: rejects invalid JSON and oversized payloads', async () => {
  assert.equal((await call(request('{broken'))).statusCode, 400);
  assert.equal((await call(request({ ...validBody(), message: 'x'.repeat(9000) }))).statusCode, 413);
});

test('contact: validates required fields, subject, consent and honeypot', async () => {
  for (const body of [
    { ...validBody(), name: '' },
    { ...validBody(), email: 'not-an-email' },
    { ...validBody(), subject: 'diagnostico' },
    { ...validBody(), consent: false },
    { ...validBody(), website: 'https://spam.example' },
  ]) {
    assert.equal((await call(request(body))).statusCode, 422);
  }
});

test('contact: rejects insecure or credential-bearing webhook configuration', async () => {
  for (const url of ['http://provider.example/messages', 'https://user:secret@provider.example/messages']) {
    process.env.CONTACT_WEBHOOK_URL = url;
    assert.equal((await call(request())).statusCode, 503);
  }
});

test('contact: forwards only allowed fields and confirms after receiver accepts', async () => {
  process.env.CONTACT_WEBHOOK_URL = 'https://provider.example/messages';
  process.env.CONTACT_WEBHOOK_TOKEN = 'synthetic-test-secret';
  let calls = 0;
  globalThis.fetch = async (input, options) => {
    calls += 1;
    assert.equal(String(input), 'https://provider.example/messages');
    assert.equal(options?.method, 'POST');
    assert.equal(options?.redirect, 'error');
    assert.ok(options?.signal instanceof AbortSignal);
    const headers = options?.headers as Record<string, string>;
    assert.equal(headers.Authorization, 'Bearer synthetic-test-secret');
    const body = JSON.parse(String(options?.body));
    assert.equal(body.name, 'Pessoa de teste');
    assert.equal(body.source, 'maria-do-reino-site');
    assert.ok(!('website' in body));
    assert.ok(!('unexpected' in body));
    return new Response('{}', { status: 202 });
  };
  const res = await call(request({ ...validBody(), unexpected: 'do not forward' }));
  assert.equal(calls, 1);
  assert.equal(res.statusCode, 200);
  assert.match((res.body as { message: string }).message, /recebida/);
  assert.ok(!JSON.stringify(res.body).includes('synthetic-test-secret'));
});

test('contact: provider errors or timeout never report successful delivery or leak details', async () => {
  process.env.CONTACT_WEBHOOK_URL = 'https://provider.example/messages';
  globalThis.fetch = async () => new Response('private-provider-body', { status: 500 });
  const rejected = await call(request());
  assert.equal(rejected.statusCode, 502);
  assert.ok(!JSON.stringify(rejected.body).includes('private-provider-body'));
  globalThis.fetch = async () => { throw new DOMException('private-timeout-details', 'TimeoutError'); };
  const timedOut = await call(request());
  assert.equal(timedOut.statusCode, 502);
  assert.ok(!JSON.stringify(timedOut.body).includes('private-timeout-details'));
  assert.ok(!('message' in (timedOut.body as object)));
});

test('contact: repeated submissions hit the per-instance limiter', async () => {
  const shared = request();
  shared.headers['x-forwarded-for'] = 'contact-rate-limit-fixture';
  for (let i = 0; i < 5; i += 1) assert.equal((await call(shared)).statusCode, 503);
  const res = await call(shared);
  assert.equal(res.statusCode, 429);
  assert.equal(res.headers['retry-after'], '900');
});
});
