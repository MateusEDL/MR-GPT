import { mkdir, rm, cp, writeFile } from 'node:fs/promises';
import { zipDirectory } from './zip.mjs';
import './export-preview.mjs';

await mkdir('exports', { recursive: true });
await rm('exports/maria-do-reino-fonte', { recursive: true, force: true });
await mkdir('exports/maria-do-reino-fonte', { recursive: true });
const entries = ['src', 'public', 'api', 'scripts', 'docs', 'tests', 'package.json', 'package-lock.json', 'astro.config.mjs', 'tsconfig.json', 'vercel.json', 'README.md', '.env.example', '.gitignore', 'playwright.config.ts'];
for (const entry of entries) {
  try { await cp(entry, `exports/maria-do-reino-fonte/${entry}`, { recursive: true }); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
}
await zipDirectory('exports/maria-do-reino-fonte', 'exports/maria-do-reino-fonte.zip');
await zipDirectory('dist', 'exports/maria-do-reino-estatico.zip');
await writeFile('exports/LEIA-ME.txt', 'O pacote fonte contém o código, conteúdo editável e configuração Vercel. Execute npm ci e npm run build.\nO pacote estático contém a pasta dist pronta para hospedagem estática. API de contato e login do painel exigem runtime separado (Vercel ou equivalente) e variáveis configuradas.\nNenhuma credencial está incluída. Consulte README.md e docs/.\n');
console.log('Pacotes fonte e estático exportados para exports/.');
