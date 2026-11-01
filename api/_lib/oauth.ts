import { randomBytes, timingSafeEqual } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';

export interface OAuthConfig {
  origin: string;
  clientId: string;
  clientSecret: string;
  scope: 'public_repo' | 'repo';
  secure: boolean;
  cookieName: string;
}

/** Configuration is taken only from trusted deployment settings, never request headers. */
export function oauthConfig(): OAuthConfig | null {
  const value = process.env.CMS_ORIGIN?.trim();
  const clientId = process.env.GITHUB_CLIENT_ID?.trim();
  const clientSecret = process.env.GITHUB_CLIENT_SECRET?.trim();
  const scope = process.env.GITHUB_OAUTH_SCOPE?.trim() || 'public_repo';
  if (!value || !clientId || !clientSecret || !['public_repo', 'repo'].includes(scope)) return null;
  try {
    const url = new URL(value);
    const local = url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname);
    if (url.protocol !== 'https:' && !local) return null;
    if (url.username || url.password || url.search || url.hash || url.pathname !== '/') return null;
    return {
      origin: url.origin,
      clientId,
      clientSecret,
      scope: scope as OAuthConfig['scope'],
      secure: url.protocol === 'https:',
      cookieName: url.protocol === 'https:' ? '__Host-mr_oauth_state' : 'mr_oauth_state',
    };
  } catch {
    return null;
  }
}

export function safeHeaders(res: ServerResponse): void {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
}

export function textResponse(res: ServerResponse, status: number, message: string): void {
  safeHeaders(res);
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end(message);
}

export function newState(): string {
  return randomBytes(32).toString('base64url');
}

export function stateCookie(config: OAuthConfig, state: string, clear = false): string {
  return `${config.cookieName}=${clear ? '' : state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${clear ? 0 : 600}${config.secure ? '; Secure' : ''}`;
}

export function stateMatches(req: IncomingMessage, config: OAuthConfig, state: string | null): boolean {
  if (!state || !/^[A-Za-z0-9_-]{43}$/.test(state)) return false;
  const cookies = (req.headers.cookie || '').split(';').map((entry) => entry.trim());
  const matches = cookies.filter((entry) => entry.startsWith(`${config.cookieName}=`));
  // Duplicate cookies are ambiguous and fail closed.
  if (matches.length !== 1) return false;
  const expected = matches[0].slice(config.cookieName.length + 1);
  if (!/^[A-Za-z0-9_-]{43}$/.test(expected)) return false;
  return timingSafeEqual(Buffer.from(state), Buffer.from(expected));
}

function safeJSON(value: unknown): string {
  return JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, (character) => {
    return `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`;
  });
}

/** Decap popup protocol: disclose the token only after a verified opener handshake. */
export function popupResponse(
  res: ServerResponse,
  config: OAuthConfig,
  status: number,
  result: { token: string } | { error: string },
): void {
  const nonce = randomBytes(24).toString('base64');
  const success = 'token' in result;
  const payload = success
    ? `authorization:github:success:${JSON.stringify({ token: result.token, provider: 'github' })}`
    : `authorization:github:error:${JSON.stringify({ error: result.error, provider: 'github' })}`;
  safeHeaders(res);
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // This popup must retain its opener across the GitHub OAuth redirect.
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  res.setHeader('Content-Security-Policy', `default-src 'none'; script-src 'nonce-${nonce}'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`);
  res.end(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Acesso ao painel — Maria do Reino</title></head><body><p id="status">Conectando ao painel de edição…</p><script nonce="${nonce}">
(() => {
  const trustedOrigin = ${safeJSON(config.origin)};
  const response = ${safeJSON(payload)};
  const status = document.getElementById('status');
  if (!window.opener) {
    status.textContent = 'Abra o acesso a partir do painel de edição.';
    return;
  }
  const opener = window.opener;
  const timeout = window.setTimeout(() => {
    window.removeEventListener('message', receive);
    status.textContent = 'Não foi possível conectar ao painel. Feche esta janela e tente novamente.';
  }, 15000);
  function receive(event) {
    if (event.origin !== trustedOrigin || event.source !== opener || event.data !== 'authorizing:github') return;
    window.removeEventListener('message', receive);
    window.clearTimeout(timeout);
    opener.postMessage(response, trustedOrigin);
    status.textContent = ${safeJSON(success ? 'Acesso enviado ao painel. Você pode fechar esta janela.' : 'Não foi possível concluir o acesso. Volte ao painel e tente novamente.')};
    window.setTimeout(() => window.close(), 150);
  }
  window.addEventListener('message', receive);
  opener.postMessage('authorizing:github', trustedOrigin);
})();
</script></body></html>`);
}
