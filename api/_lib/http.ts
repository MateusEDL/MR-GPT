export type ApiRequest = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
  socket?: { remoteAddress?: string };
};

export type ApiResponse = {
  status: (status: number) => ApiResponse;
  setHeader: (name: string, value: string | string[]) => void;
  json: (body: unknown) => void;
  end: (body?: string) => void;
};

export function header(req: ApiRequest, name: string): string {
  const value = req.headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

export function json(res: ApiResponse, status: number, body: unknown): void {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.status(status).json(body);
}

export function configuredOrigins(): string[] {
  return [...new Set([process.env.SITE_URL, process.env.CMS_ORIGIN]
    .filter((value): value is string => Boolean(value))
    .flatMap((value) => {
      try {
        const url = new URL(value);
        const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
        return url.username || url.password || (url.protocol !== 'https:' && !(local && url.protocol === 'http:'))
          ? [] : [url.origin];
      } catch {
        return [];
      }
    }))];
}
