import { readFile, readdir } from 'node:fs/promises';

const root = 'src/content';
let count=0;
const linked={professionals:[],programs:[],episodes:[]};
function assert(condition,message){ if(!condition) throw new Error(message); }
function validateString(value,field){assert(typeof value==='string'&&value.trim(),`${field}: texto obrigatório`);}
function safeURL(value,field){
  if(!value)return;
  assert(typeof value==='string',`${field}: URL inválida`);
  if(value.startsWith('/')){assert(!value.startsWith('//')&&!value.includes('..')&&!/[\u0000-\u0020\\]/.test(value),`${field}: caminho inseguro`);return;}
  const url=new URL(value);
  assert(url.protocol==='https:'&&!url.username&&!url.password,`${field}: use HTTPS e não inclua credenciais`);
}
function walk(value,name){
  if(!value||typeof value!=='object')return;
  for(const [key,item]of Object.entries(value)){
    if(['url','image','src','videoUrl','registrationUrl','paymentUrl','instagram','instagramCultural','memberUrl','logoInstitutional','logoCultural','careImage','manifestoImage','profileUrl','contactUrl','channelUrl'].includes(key))safeURL(item,`${name}.${key}`);
    if(item&&typeof item==='object')walk(item,`${name}.${key}`);
  }
}
const site=JSON.parse(await readFile(`${root}/site.json`,'utf8'));
for(const k of ['name','description','cnpj','city','state','whatsapp'])validateString(site[k],`site.${k}`);
assert(/^\d{10,15}$/.test(site.whatsapp),'WhatsApp: use código internacional e apenas números');
assert(!site.email||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(site.email),'E-mail de contato inválido');
safeURL(site.seo.url,'site.seo.url');walk(site,'site');
const home=JSON.parse(await readFile(`${root}/home.json`,'utf8'));for(const [key,value]of Object.entries(home))validateString(value,`home.${key}`);
walk(home,'home');
const tv=JSON.parse(await readFile(`${root}/tv.json`,'utf8'));
validateString(tv.title,'tv.title');validateString(tv.intro,'tv.intro');walk(tv,'tv');
assert(!tv.channelUrl||tv.channelUrl.startsWith('https://'),'Canal da TV deve usar HTTPS');
for(const collection of ['pages','posts','events','projects','galleries','partners','authors','professionals','programs','episodes']){
  const slugs=new Set();
  for(const file of await readdir(`${root}/${collection}`)){
    if(!file.endsWith('.json'))continue;
    const data=JSON.parse(await readFile(`${root}/${collection}/${file}`,'utf8'));
    assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug),`${file}: slug inválido`);
    assert(!slugs.has(data.slug),`${collection}: slug duplicado ${data.slug}`);slugs.add(data.slug);
    assert(file===`${data.slug}.json`,`${file}: nome do arquivo deve corresponder ao slug`);
    if(['authors','partners','professionals'].includes(collection))validateString(data.name,`${file}.name`);else validateString(data.title,`${file}.title`);
    if(collection==='pages'){validateString(data.description,`${file}.description`);assert(Array.isArray(data.sections),`${file}: sections deve ser lista`);}
    if(collection==='posts'){for(const k of ['author','body','publishedAt'])validateString(data[k],`${file}.${k}`);assert(Number.isFinite(Date.parse(data.publishedAt)),`${file}: data inválida`);}
    if(collection==='events'){for(const k of ['location','cost','start'])validateString(data[k],`${file}.${k}`);assert(/T.*(?:Z|[+-]\d\d:\d\d)$/.test(data.start)&&Number.isFinite(Date.parse(data.start)),`${file}: data de evento precisa de hora e fuso`);assert(['scheduled','cancelled','postponed'].includes(data.status),`${file}: status inválido`);}
    if(['galleries','partners'].includes(collection))assert(typeof data.approved==='boolean',`${file}: approved precisa ser boolean`);
    if(collection==='galleries'){assert(Array.isArray(data.items),`${file}: galeria sem lista de imagens`);for(const image of data.items){validateString(image.src,`${file}.src`);validateString(image.alt,`${file}.alt`);}}
    if(['professionals','programs','episodes'].includes(collection)){
      assert(typeof data.published==='boolean',`${file}: published precisa ser boolean`);
      assert(data.order===undefined||(Number.isInteger(data.order)&&data.order>=0),`${file}: ordem deve ser um inteiro não negativo`);
      linked[collection].push(data);
    }
    if(collection==='professionals'){
      for(const key of ['role','summary'])validateString(data[key],`${file}.${key}`);
      assert(Array.isArray(data.areas)&&data.areas.length>0&&data.areas.every(area=>['saude','cultura'].includes(area)),`${file}: selecione saúde e/ou cultura`);
      assert(typeof data.credentialVerified==='boolean',`${file}: credentialVerified precisa ser boolean`);
    }
    if(collection==='programs'){
      validateString(data.description,`${file}.description`);
      assert(['saude','cultura','comunidade'].includes(data.category),`${file}: categoria de programa inválida`);
      assert(['ativo','arquivo','planejamento'].includes(data.status),`${file}: situação de programa inválida`);
      assert(!data.hosts||(Array.isArray(data.hosts)&&data.hosts.every(host=>typeof host==='string')),`${file}: participantes precisam ser uma lista de identificadores`);
    }
    if(collection==='episodes'){
      for(const key of ['description','programSlug','url'])validateString(data[key],`${file}.${key}`);
      assert(data.url.startsWith('https://'),`${file}: vídeo deve usar HTTPS`);
      assert(!data.publishedAt||Number.isFinite(Date.parse(data.publishedAt)),`${file}: data de vídeo inválida`);
    }
    if(['professionals','programs','episodes'].includes(collection)&&data.image){
      validateString(data.imageAlt,`${file}.imageAlt`);
      assert(data.image.startsWith('/')&&!data.image.startsWith('//'),`${file}: envie a imagem para a biblioteca local para evitar conexões externas automáticas`);
    }
    walk(data,file);count++;
  }
}
for(const program of linked.programs.filter(item=>item.published)){
  for(const host of program.hosts||[])assert(linked.professionals.some(person=>person.slug===host&&person.published),`Programa ${program.slug}: participante ${host} não está publicado`);
}
for(const episode of linked.episodes.filter(item=>item.published))assert(linked.programs.some(program=>program.slug===episode.programSlug&&program.published),`Vídeo ${episode.slug}: programa relacionado não está publicado`);
console.log(`Conteúdo válido: ${count} registros, contatos e links verificados estruturalmente. Não substitui revisão editorial.`);
