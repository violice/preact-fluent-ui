import { mkdir, readFile, writeFile } from 'node:fs/promises';

import { generateResetCss, generateNativeCss } from '../src/styling/compiler/global-styles.ts';

const root = new URL('../', import.meta.url);
await mkdir(new URL('dist/', root), { recursive: true });
await writeFile(new URL('dist/reset.css', root), generateResetCss());
await writeFile(new URL('dist/native-controls.css', root), generateNativeCss());

await writeFile(
  new URL('dist/theme.css', root),
  '\n' + (await readFile(new URL('.artifacts/styled-system/theme.css', root), 'utf8')),
);

await writeFile(new URL('dist/styling.d.ts', root), "export * from './styling/index.js';\n");
