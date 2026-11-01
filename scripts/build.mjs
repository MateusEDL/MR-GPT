import { spawnSync } from 'node:child_process';
import { rm } from 'node:fs/promises';

const editor = process.argv.includes('--editor') || process.env.PUBLIC_CMS_ENABLED === 'true';
for (const args of [['scripts/prepare-admin.mjs'], ['scripts/astro.mjs', 'build']]) {
  const result=spawnSync(process.execPath,args,{stdio:'inherit',env:process.env});
  if(result.status!==0)process.exit(result.status??1);
}
if(!editor){
  await rm('dist/admin',{recursive:true,force:true});
  console.log('Build público: painel excluído. Para edição LOCAL, use npm run build:editor ou npm run dev.');
}else{
  console.log('Build com editor: uso local/teste. Habilitação em produção requer revisão da auditoria e OAuth configurado.');
}
