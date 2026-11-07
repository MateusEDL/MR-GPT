/** Builds embeds only for explicitly supported, HTTPS video URLs. */
export function videoEmbed(value: string): { provider: 'YouTube' | 'Vimeo'; src: string } | null {
  if (value !== value.trim() || value.includes('\\')) return null;
  let url: URL;
  try { url = new URL(value); } catch { return null; }
  if (url.protocol !== 'https:' || url.username || url.password || url.port) return null;
  const host = url.hostname.toLowerCase();
  let youtubeId: string | undefined;
  if (['youtu.be', 'www.youtu.be'].includes(host)) youtubeId = url.pathname.match(/^\/([A-Za-z0-9_-]{11})\/?$/)?.[1];
  if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(host)) {
    if (url.pathname === '/watch') youtubeId = url.searchParams.get('v') || undefined;
    else youtubeId = url.pathname.match(/^\/(?:embed|shorts|live)\/([A-Za-z0-9_-]{11})\/?$/)?.[1];
  }
  if (['youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(host)) youtubeId = url.pathname.match(/^\/embed\/([A-Za-z0-9_-]{11})\/?$/)?.[1];
  if (youtubeId && /^[A-Za-z0-9_-]{11}$/.test(youtubeId)) return { provider: 'YouTube', src: `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0` };
  let vimeoId: string | undefined;
  if (['vimeo.com', 'www.vimeo.com'].includes(host)) vimeoId = url.pathname.match(/^\/(\d{1,15})\/?$/)?.[1];
  if (host === 'player.vimeo.com') vimeoId = url.pathname.match(/^\/video\/(\d{1,15})\/?$/)?.[1];
  if (vimeoId) return { provider: 'Vimeo', src: `https://player.vimeo.com/video/${vimeoId}?dnt=1` };
  return null;
}
