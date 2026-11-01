import { copyFile, mkdir, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

await mkdir('public/admin/vendor', { recursive: true });
const source = resolve('node_modules/decap-cms/dist');
for (const name of await readdir(source)) {
  if ((name.endsWith('.js') && name !== 'cms.js') || name.endsWith('.wasm') || name.endsWith('.LICENSE.txt')) {
    await copyFile(resolve(source,name), resolve('public/admin/vendor',name));
  }
}
await mkdir('public/licenses', { recursive: true });
for (const font of ['dm-sans','newsreader']) {
  await copyFile(resolve(`node_modules/@fontsource-variable/${font}/LICENSE`), resolve(`public/licenses/${font}-OFL.txt`));
}
console.log('Painel de edição: bundle local preparado.');
