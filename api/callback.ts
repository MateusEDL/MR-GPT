import type { IncomingMessage, ServerResponse } from 'node:http';
import { oauthConfig, popupResponse, stateCookie, stateMatches, textResponse } from './_lib/oauth.ts';

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    textResponse(res, 405, 'Método não permitido.');
    return;
  }
  const config = oauthConfig();
  if (!config) {
    textResponse(res, 503, 'O acesso ao painel ainda não foi configurado.');
    return;
  }
  // Consume the short-lived state on every callback, whether successful or not.
  res.setHeader('Set-Cookie', stateCookie(config, '', true));
  let params: URLSearchParams;
  try {
    params = new URL(req.url || '/', config.origin).searchParams;
  } catch {
    textResponse(res, 400, 'Retorno de autenticação inválido.');
    return;
  }
  if (params.getAll('state').length !== 1 || !stateMatches(req, config, params.get('state'))) {
    textResponse(res, 401, 'A sessão de autenticação expirou ou é inválida. Inicie novamente pelo painel.');
    return;
  }
  if (params.has('error')) {
    popupResponse(res, config, 400, { error: 'A autorização do GitHub não foi concluída.' });
    return;
  }
  const code = params.get('code');
  if (params.getAll('code').length !== 1 || !code || code.length > 1024) {
    popupResponse(res, config, 400, { error: 'O GitHub não forneceu um código de autorização válido.' });
    return;
  }
  try {
    const exchange = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'MariaDoReinoCMS' },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        redirect_uri: `${config.origin}/api/callback`,
      }),
      redirect: 'error',
      signal: AbortSignal.timeout(7000),
    });
    if (!exchange.ok) {
      popupResponse(res, config, 502, { error: 'Não foi possível confirmar a autorização com o GitHub.' });
      return;
    }
    const response: unknown = await exchange.json();
    if (!response || typeof response !== 'object') throw new Error('Invalid token response');
    const data = response as Record<string, unknown>;
    if (typeof data.access_token !== 'string' || data.access_token.length < 1 || data.access_token.length > 1024 || data.token_type !== 'bearer' || data.error) {
      popupResponse(res, config, 400, { error: 'A autorização não pôde ser concluída. Inicie novamente pelo painel.' });
      return;
    }
    popupResponse(res, config, 200, { token: data.access_token });
  } catch {
    // Never expose provider responses, tokens, request contents or configuration.
    popupResponse(res, config, 502, { error: 'O serviço de autenticação está indisponível. Tente novamente mais tarde.' });
  }
}
