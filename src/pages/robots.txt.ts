import type { APIRoute } from 'astro';
import {indexable,site} from '../lib/content';
export const GET: APIRoute = () => new Response(indexable ? `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nDisallow: /busca/\nSitemap: ${site.seo.url}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n', {headers:{'Content-Type':'text/plain; charset=utf-8'}});
