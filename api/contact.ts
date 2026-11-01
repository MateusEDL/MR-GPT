import { createHash } from 'node:crypto';
import { configuredOrigins, header, json, type ApiRequest, type ApiResponse } from './_lib/http.ts';

const MAX_BYTES = 8192;
const WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; until: number }>();

// Proteção adicional por instância. A produção deve ter limitação distribuída
// no provedor: a memória de uma função serverless não é um limitador global.
function withinLocalLimit(req: ApiRequest): boolean {
  const now = Date.now();
  for (const [key, entry] of attempts) {
    if (entry.until <= now) attempts.delete(key);
  }
  const identity = header(req, 'x-forwarded-for').split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const key = createHash('sha256').update(identity).digest('hex');
  const existing = attempts.get(key);
  if (existing) {
    existing.count += 1;
    return existing.count <= 5;
  }
  if (attempts.size >= 5000) return false;
  attempts.set(key, { count: 1, until: now + WINDOW_MS });
  return true;
}

function text(value: unknown, max: number, required = true): string | undefined {
  if (typeof value !== 'string') return required ? undefined : '';
  const result = value.trim();
  if ((required && !result) || result.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(result)) return undefined;
  return result;
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    json(res, 405, { error: 'Use POST para enviar uma mensagem.' });
    return;
  }

  const origins = configuredOrigins();
  const origin = header(req, 'origin');
  if (!origins.length) {
    json(res, 503, { error: 'O formulário ainda não está disponível. Use o WhatsApp indicado no site.' });
    return;
  }
  if (!origins.includes(origin)) {
    json(res, 403, { error: 'Origem de envio não permitida.' });
    return;
  }
  if (!header(req, 'content-type').toLowerCase().startsWith('application/json')) {
    json(res, 415, { error: 'Envie os dados no formato JSON.' });
    return;
  }
  if (!withinLocalLimit(req)) {
    res.setHeader('Retry-After', '900');
    json(res, 429, { error: 'Muitas tentativas. Aguarde alguns minutos ou use o WhatsApp.' });
    return;
  }

  let body: Record<string, unknown>;
  try {
    const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    if (!raw || Buffer.byteLength(raw, 'utf8') > MAX_BYTES || Number(header(req, 'content-length') || 0) > MAX_BYTES) {
      json(res, 413, { error: 'A mensagem é muito longa. Reduza o conteúdo e tente novamente.' });
      return;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('invalid body');
    body = parsed as Record<string, unknown>;
  } catch {
    json(res, 400, { error: 'Não foi possível ler a mensagem. Confira os campos e tente novamente.' });
    return;
  }

  const name = text(body.name, 100);
  const email = text(body.email, 254);
  const city = text(body.city, 100, false);
  const message = text(body.message, 2000);
  const subject = text(body.subject, 20);
  const website = text(body.website, 200, false);
  const allowedSubjects = ['geral', 'cultura', 'associacao', 'apoio'];
  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || city === undefined || !message || !subject || !allowedSubjects.includes(subject) || website || body.consent !== true) {
    json(res, 422, { error: 'Confira nome, e-mail, assunto, mensagem e a confirmação de privacidade. Não envie informações de saúde.' });
    return;
  }

  let target: URL;
  try {
    target = new URL(process.env.CONTACT_WEBHOOK_URL || '');
    if (target.protocol !== 'https:' || target.username || target.password || target.hash) throw new Error('invalid destination');
  } catch {
    json(res, 503, { error: 'O formulário ainda não está disponível. Sua mensagem não foi enviada. Use o WhatsApp indicado no site.' });
    return;
  }

  const secret = process.env.CONTACT_WEBHOOK_TOKEN;
  try {
    const response = await fetch(target, {
      method: 'POST',
      redirect: 'error',
      signal: AbortSignal.timeout(7000),
      headers: {
        'Content-Type': 'application/json',
        ...(secret ? { Authorization: `Bearer ${secret}` } : {}),
      },
      body: JSON.stringify({ name, email, city, subject, message, consent: true, source: 'maria-do-reino-site' }),
    });
    await response.body?.cancel();
    if (!response.ok) throw new Error('delivery failed');
    json(res, 200, { message: 'Mensagem recebida pelo canal da associação. Aguarde o retorno da equipe.' });
  } catch {
    // Não registrar dados pessoais, payload, URL de webhook ou respostas do provedor.
    json(res, 502, { error: 'Não foi possível confirmar o recebimento. Tente mais tarde ou use o WhatsApp.' });
  }
}
