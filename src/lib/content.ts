import siteData from '../content/site.json';
import homeData from '../content/home.json';
import tvData from '../content/tv.json';

export interface Page { slug: string; title: string; seoTitle?: string; description: string; eyebrow: string; intro: string; sections: { title: string; body: string }[]; faqs?: { question: string; answer: string }[] }
export interface Post { slug: string; title: string; description: string; publishedAt: string; author: string; body: string; image?: string; imageAlt?: string; reviewer?: string; reviewedAt?: string; category: string }
export interface Event { slug: string; title: string; description: string; start: string; end?: string; location: string; cost: string; registrationUrl?: string; cultural: boolean; status: 'scheduled' | 'cancelled' | 'postponed'; image?: string; imageAlt?: string }
export interface Project { slug: string; title: string; description: string; body: string; status: 'active' | 'planned' | 'completed'; image?: string; imageAlt?: string }
export interface Author { slug: string; name: string; bio: string; qualification?: string; role: 'author'|'reviewer'; url?: string; image?: string; imageAlt?: string }
export interface Partner { slug: string; name: string; url?: string; image?: string; imageAlt?: string; description?: string; approved: boolean }
export interface Gallery { slug: string; title: string; description: string; date?: string; activity?: string; approved: boolean; items: {src:string; alt:string; caption:string; credit:string}[]; videoUrl?: string; videoTitle?: string; transcript?: string }
export interface Professional { slug: string; name: string; role: string; summary: string; order?: number; bio?: string; areas: ('saude'|'cultura')[]; image?: string; imageAlt?: string; credentials?: string; credentialVerified: boolean; published: boolean; profileUrl?: string; contactUrl?: string }
export interface Program { slug: string; title: string; description: string; order?: number; body?: string; image?: string; imageAlt?: string; hosts?: string[]; category: 'saude'|'cultura'|'comunidade'; status: 'ativo'|'arquivo'|'planejamento'; schedule?: string; published: boolean }
export interface Episode { slug: string; title: string; description: string; programSlug: string; url: string; publishedAt?: string; image?: string; imageAlt?: string; transcript?: string; published: boolean }
function collection<T>(files: Record<string, { default: T }>): T[] { return Object.values(files).map(file => file.default); }
export const site = siteData;
export const home = homeData;
export const tv = tvData;
export const pages = collection<Page>(import.meta.glob('../content/pages/*.json', { eager: true }));
export const posts = collection<Post>(import.meta.glob('../content/posts/*.json', { eager: true })).sort((a,b) => b.publishedAt.localeCompare(a.publishedAt));
export const events = collection<Event>(import.meta.glob('../content/events/*.json', { eager: true })).sort((a,b) => a.start.localeCompare(b.start));
export const projects = collection<Project>(import.meta.glob('../content/projects/*.json', { eager: true }));
export const authors = collection<Author>(import.meta.glob('../content/authors/*.json', { eager: true }));
export const partners = collection<Partner>(import.meta.glob('../content/partners/*.json', { eager: true })).filter(item=>item.approved);
export const galleries = collection<Gallery>(import.meta.glob('../content/galleries/*.json', { eager: true })).filter(item=>item.approved);
export const professionals = collection<Professional>(import.meta.glob('../content/professionals/*.json', { eager: true })).filter(item=>item.published).sort((a,b)=>(a.order??999)-(b.order??999));
export const programs = collection<Program>(import.meta.glob('../content/programs/*.json', { eager: true })).filter(item=>item.published).sort((a,b)=>(a.order??999)-(b.order??999));
export const episodes = collection<Episode>(import.meta.glob('../content/episodes/*.json', { eager: true })).filter(item=>item.published && programs.some(program=>program.slug===item.programSlug));
export const whatsappUrl = `https://wa.me/${site.whatsapp}`;
export const eventIsPast = (event: Event): boolean => new Date(event.end || event.start).getTime() < Date.now();
export const formatDate = (date: string) => new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeZone: 'America/Sao_Paulo' }).format(new Date(date));
export const indexable = import.meta.env.PUBLIC_INDEXABLE === 'true' && import.meta.env.PROD && process.env.VERCEL_ENV !== 'preview';
