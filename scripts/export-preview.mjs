import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname, extname } from 'node:path';

// Standalone review of the home: the real generated CSS, images, fonts and JS.
// It does not publish a site or include any administrative integration.
const output=resolve('dist');
const mime={'.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff'};
function asset(name,base=output){
  const result=resolve(name.startsWith('/')?output:base,name.replace(/^\//,''));
  if(!result.startsWith(output+'/'))throw new Error('Asset fora do build: '+name);
  return result;
}
async function dataURI(name,base){
  const target=asset(name,base);
  return `data:${mime[extname(target)]||'application/octet-stream'};base64,${(await readFile(target)).toString('base64')}`;
}
async function replaceAsync(source,pattern,handler){
  const matches=[...source.matchAll(pattern)];
  const values=await Promise.all(matches.map(handler));
  let result='',position=0;
  matches.forEach((match,index)=>{result+=source.slice(position,match.index)+values[index];position=match.index+match[0].length;});
  return result+source.slice(position);
}
await mkdir('exports',{recursive:true});
let html=await readFile(resolve(output,'index.html'),'utf8');
html=await replaceAsync(html,/<link rel="stylesheet" href="([^"]+)"[^>]*>/g,async match=>{
  const file=asset(match[1]);
  let css=await readFile(file,'utf8');
  css=await replaceAsync(css,/url\((['"]?)([^)'"\s]+)\1\)/g,async url=>{
    if(/^(data:|https?:|#)/.test(url[2]))return url[0];
    return `url("${await dataURI(url[2],dirname(file))}")`;
  });
  return `<style>${css.replace(/<\/style/gi,'<\\/style')}</style>`;
});
html=html.replace(/\s+srcset="[^"]*"/g,'');
html=await replaceAsync(html,/<img\b([^>]*?)src="([^"]+)"([^>]*)>/g,async match=>{
  if(!match[2].startsWith('/'))return match[0];
  let source=match[2];
  // Use the original for a portrait crop as well as wide desktop display.
  if(source.includes('hero-botanico-ia-1280'))source='/images/hero-botanico-ia.webp';
  return `<img${match[1]}src="${await dataURI(source)}"${match[3]}>`;
});
html=await replaceAsync(html,/<script type="module" src="([^"]+)"[^>]*><\/script>/g,async match=>{
  const script=await readFile(asset(match[1]),'utf8');
  if(/\bimport\s*[("'{]/.test(script))throw new Error('Prévia precisa de bundle sem imports externos.');
  return `<script type="module">${script.replace(/<\/script/gi,'<\\/script')}</script>`;
});
const review=`<script>(()=>{document.addEventListener('click',event=>{const link=event.target.closest('a');if(!link)return;const href=link.getAttribute('href')||'';if(href.startsWith('/')&&!href.startsWith('//')){event.preventDefault();let note=document.getElementById('review-note');if(!note){note=document.createElement('div');note.id='review-note';note.setAttribute('role','status');note.style.cssText='position:fixed;z-index:100;bottom:24px;left:20px;max-width:calc(100vw - 100px);background:#fbf6e9;color:#103d30;border-radius:24px;padding:18px 25px;font:14px/1.6 Arial;box-shadow:0 3px 30px #0003';document.body.append(note);}note.textContent='Esta prévia interativa mostra a página inicial. A navegação completa está no site exportado.';clearTimeout(window.reviewTimer);window.reviewTimer=setTimeout(()=>note.remove(),5000);}});})();</script>`;
html=html.replace('</body>',review+'</body>');
await writeFile('exports/maria-do-reino-previa.html',html);
console.log('Prévia interativa da home exportada em um único HTML, sem dependências de rede.');
