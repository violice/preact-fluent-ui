import { mkdir, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
await mkdir(new URL('dist/', root), { recursive: true });

for (const entry of ['components', 'utils', 'styles']) {
  await writeFile(new URL(`dist/${entry}.d.ts`, root), `export * from './${entry}/index.js';\n`);
}
