import { copyFile, mkdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
await mkdir(new URL('dist/', root), { recursive: true });
for (const name of ['theme.css', 'reset.css', 'native-controls.css']) {
  await copyFile(new URL(`src/styles/${name}`, root), new URL(`dist/${name}`, root));
}
