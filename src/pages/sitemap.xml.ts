import type { APIRoute } from 'astro';
import {site,pages,posts,events,projects,professionals,programs} from '../lib/content';
export const GET: APIRoute = () => {
  const paths=['/','/blog/','/agenda/','/mr-cultural/projetos/','/mr-cultural/agenda/','/mr-cultural/galeria/','/profissionais/','/mr-cultural/profissionais/','/tv/','/tv/programas/',...pages.map(p=>`/${p.slug}/`),...posts.map(p=>`/blog/${p.slug}/`),...events.map(p=>`/agenda/${p.slug}/`),...projects.map(p=>`/mr-cultural/projetos/${p.slug}/`),...professionals.map(p=>`/profissionais/${p.slug}/`),...programs.map(p=>`/tv/programas/${p.slug}/`)];
  const escape=(value:string)=>value.replace(/[<>&'"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;'}[c]!));
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...new Set(paths)].map(p=>`<url><loc>${escape(new URL(p,site.seo.url).href)}</loc></url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
};
