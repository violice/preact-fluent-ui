import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
await mkdir(new URL('dist/', root), { recursive: true });
for (const name of ['reset.css', 'native-controls.css']) {
  await copyFile(new URL(`src/styles/${name}`, root), new URL(`dist/${name}`, root));
}

await writeFile(
  new URL('dist/theme.css', root),
  '\n' + (await readFile(new URL('.artifacts/styled-system/theme.css', root), 'utf8')),
);

await writeFile(new URL('dist/styling.d.ts', root), "export * from './styling/index.js';\n");
