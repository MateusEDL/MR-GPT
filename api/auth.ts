import type { IncomingMessage, ServerResponse } from 'node:http';
import { newState, oauthConfig, safeHeaders, stateCookie, textResponse } from './_lib/oauth.ts';

export default function handler(req: IncomingMessage, res: ServerResponse): void {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    textResponse(res, 405, 'Método não permitido.');
    return;
  }
  const config = oauthConfig();
  if (!config) {
    textResponse(res, 503, 'O acesso ao painel ainda não foi configurado. Consulte o guia de implantação e as variáveis de ambiente.');
    return;
  }
  const state = newState();
  const redirect = new URL('https://github.com/login/oauth/authorize');
  redirect.searchParams.set('client_id', config.clientId);
  redirect.searchParams.set('redirect_uri', `${config.origin}/api/callback`);
  redirect.searchParams.set('scope', config.scope);
  redirect.searchParams.set('state', state);
  safeHeaders(res);
  res.setHeader('Set-Cookie', stateCookie(config, state));
  res.setHeader('Location', redirect.toString());
  res.statusCode = 302;
  res.end();
}
