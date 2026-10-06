// @vitest-environment node
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { build, createServer } from 'vite';

const fixture = fileURLToPath(
  new URL('../../../tests/styling-consumer/prototype/', import.meta.url),
);
let root: string;
beforeEach(async () => {
  root = await mkdtemp(join(fixture, 'run-'));
  await cp(join(fixture, 'input'), root, { recursive: true });
});
afterEach(async () => {
  await rm(root, { recursive: true, force: true });
});

async function config() {
  // The prototype config stays outside the published library entrypoints.
  const { prototypeConfig } =
    await import('../../../tests/styling-consumer/prototype/vite.config.mjs');
  return prototypeConfig(root);
}
async function bundle() {
  const built = await build(await config());
  const result = Array.isArray(built) ? built[0] : built;
  if (!('output' in result)) throw new Error('Expected build output');
  const css = result.output
    .flatMap((item) =>
      item.type === 'asset' && item.fileName.endsWith('.css') ? [item.source.toString()] : [],
    )
    .join('\n');
  const chunks = result.output.filter((item) => item.type === 'chunk');
  return {
    css,
    js: chunks.map((item) => item.code).join('\n'),
    modules: chunks.flatMap((item) => Object.keys(item.modules)),
  };
}

it('extracts an imported style object deterministically without compiler code in JS', async () => {
  const first = await bundle();
  expect(first.css).toContain('gap:16px');
  expect(first.css).toContain('color:red');
  const module = await import(`data:text/javascript,${encodeURIComponent(first.js)}`);
  expect(module.className).toMatch(/^[a-zA-Z][a-zA-Z0-9_-]*$/);
  expect(first.css).toContain(`.${module.className}`);
  expect(
    first.modules.filter((id) => /node_modules\/@wyw-in-js|processor\.mjs|api\.ts/.test(id)),
  ).toEqual([]);
  expect(first.js).not.toContain('PROTOTYPE_UNCOMPILED');
  expect(await bundle()).toEqual(first);
});

it('rebuilds imported dependencies rather than keeping stale CSS', async () => {
  expect((await bundle()).css).toContain('gap:16px');
  await writeFile(join(root, 'tokens.ts'), 'export const gap = "24px";\n');
  expect((await bundle()).css).toContain('gap:24px');
});

it('rejects a runtime parameter and identifies the source file', async () => {
  await writeFile(
    join(root, 'entry.ts'),
    'import { css } from "./api";\nexport function layout(gap: string) { return css({ gap }); }\n',
  );
  await expect(bundle()).rejects.toThrow(/entry\.ts[\s\S]*function parameter/i);
});

it('serves extracted CSS and updates it after an imported token changes', async () => {
  const server = await createServer({
    ...(await config()),
    server: { host: '127.0.0.1', port: 0 },
  });
  try {
    await server.listen();
    const address = server.httpServer?.address();
    if (!address || typeof address === 'string') throw new Error('Missing dev server address');
    const base = `http://127.0.0.1:${address.port}`;
    const entry = await (await fetch(`${base}/entry.ts`)).text();
    expect(entry).not.toContain('PROTOTYPE_UNCOMPILED');
    const cssPath = entry.match(/"([^"\n]+\.css[^"\n]*)"/)?.[1];
    expect(cssPath).toBeDefined();
    const first = await (await fetch(new URL(cssPath!, base))).text();
    expect(first).toContain('16px');
    await writeFile(join(root, 'tokens.ts'), 'export const gap = "24px";\n');
    await expect
      .poll(
        async () => {
          await fetch(`${base}/entry.ts`);
          return (await fetch(new URL(cssPath!, base))).text();
        },
        { timeout: 10000 },
      )
      .toContain('24px');
    expect(await readFile(join(root, 'tokens.ts'), 'utf8')).toContain('24px');
  } finally {
    await server.close();
  }
});

it('extracts styles in a Preact TSX component', async () => {
  await writeFile(
    join(root, 'component.tsx'),
    'import { css } from "./api";\nconst panel = css({ padding: "12px" });\nexport function Panel() { return <div class={panel}>Panel</div>; }\n',
  );
  await writeFile(join(root, 'entry.ts'), 'export { Panel } from "./component";\n');
  const output = await bundle();
  expect(output.css).toContain('padding:12px');
  expect(output.js).not.toContain('PROTOTYPE_UNCOMPILED');
  expect(
    output.modules.filter((id) => /node_modules\/@wyw-in-js|processor\.mjs|api\.ts/.test(id)),
  ).toEqual([]);
});
