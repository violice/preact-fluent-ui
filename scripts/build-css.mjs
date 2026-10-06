import { copyFile, mkdir, readFile, appendFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
await mkdir(new URL('dist/', root), { recursive: true });
for (const name of ['theme.css', 'reset.css', 'native-controls.css']) {
  await copyFile(new URL(`src/styles/${name}`, root), new URL(`dist/${name}`, root));
}

await appendFile(
  new URL('dist/theme.css', root),
  '\n' + (await readFile(new URL('.artifacts/styled-system/theme.css', root), 'utf8')),
);

await writeFile(new URL('dist/styling.d.ts', root), "export * from './styling/index.js';\n");

// Explicit local mode scopes preserve the existing public token variables.
const legacyTheme = await readFile(new URL('src/styles/theme.css', root), 'utf8');
const legacyBlocks = [...legacyTheme.matchAll(/:root\s*\{([^{}]*)\}/g)].map((match) => match[1]);
if (legacyBlocks.length !== 3) throw new Error('Expected three legacy theme token blocks');
await appendFile(
  new URL('dist/theme.css', root),
  `
[data-color-mode="light"] { ${legacyBlocks[0]} }
[data-color-mode="dark"] { ${legacyBlocks[0]} ${legacyBlocks[1]} }
@media (forced-colors: active) { [data-color-mode] { ${legacyBlocks[2]} } }
`,
);
