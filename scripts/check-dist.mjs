import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
const requiredCss = ['theme.css', 'styles.css', 'reset.css', 'native-controls.css'];
const targets = new Set();

for (const entry of Object.values(manifest.exports)) {
  for (const target of typeof entry === 'string' ? [entry] : Object.values(entry)) {
    assert.equal(typeof target, 'string', 'Export targets must be file paths');
    assert(target.startsWith('./dist/'), `Export target must be in dist: ${target}`);
    targets.add(target);
  }
}
for (const target of targets) {
  assert((await stat(new URL(target, root))).isFile(), `Missing export target: ${target}`);
}
for (const name of requiredCss) {
  assert.equal(manifest.exports[`./${name}`], `./dist/${name}`, `Missing CSS export: ${name}`);
  assert((await stat(new URL(`dist/${name}`, root))).size > 0, `Empty CSS: ${name}`);
}

const jsUrl = new URL('dist/index.js', root);
const js = await readFile(jsUrl, 'utf8');
assert(
  !/\b(?:import|export)\s*(?:[^;'"\n]*?\bfrom\s*)?['"][^'"]+\.css(?:\?[^'"]*)?['"]|\bimport\s*\(\s*['"][^'"]+\.css(?:\?[^'"]*)?['"]/.test(
    js,
  ),
  'Built JS must not import CSS',
);
assert(js.includes('sourceMappingURL=index.js.map'), 'Built JS must reference its sourcemap');
const sourcemap = JSON.parse(await readFile(new URL('dist/index.js.map', root), 'utf8'));
assert.equal(sourcemap.version, 3, 'Expected a v3 sourcemap');
assert(
  sourcemap.sources.length > 0 && sourcemap.sourcesContent.length > 0,
  'Sourcemap must include sources',
);

const graph = JSON.parse(await readFile(new URL('.artifacts/library-modules.json', root), 'utf8'));
assert(graph.modules.length > 0, 'Build module graph must not be empty');
assert(
  !graph.modules.some((id) => /\/node_modules\/preact\//.test(id.replaceAll('\\', '/'))),
  'Preact must remain external',
);
for (const dependency of ['class-variance-authority', 'clsx']) {
  assert(
    graph.modules.some((id) => id.replaceAll('\\', '/').includes(`/node_modules/${dependency}/`)),
    `${dependency} must be bundled`,
  );
}
assert(
  graph.externalImports.some((id) => id === 'preact' || id.startsWith('preact/')),
  'Build must retain external Preact imports',
);
assert(
  graph.externalImports.every((id) => id === 'preact' || id.startsWith('preact/')),
  `Unexpected runtime imports: ${graph.externalImports.join(', ')}`,
);

const declarations = await readFile(new URL('dist/components/button.d.ts', root), 'utf8');
assert(
  !/\.css|vite|vitest|class-variance-authority|clsx/.test(declarations),
  'Public declarations must not expose build dependencies',
);

const exportProbe = `
  const library = await import(${JSON.stringify(jsUrl.href)});
  if (typeof library.Button !== 'function') throw new Error('Button export is missing');
`;
// First check a cold import in ordinary Node without DOM globals.
execFileSync(process.execPath, ['--input-type=module', '--eval', exportProbe], { stdio: 'pipe' });
const importProbe = `
  // Preact compat safely checks typeof document. Load peers before trapping our own module's access.
  await Promise.all(${JSON.stringify(graph.externalImports)}.map((id) => import(id)));
  for (const name of ['document', 'window']) {
    Object.defineProperty(globalThis, name, { get() { throw new Error('DOM accessed during import: ' + name); } });
  }
  ${exportProbe}
`;
execFileSync(process.execPath, ['--input-type=module', '--eval', importProbe], {
  cwd: fileURLToPath(root),
  stdio: 'pipe',
});

const notices = new URL('THIRD_PARTY_NOTICES.txt', root);
if (existsSync(notices)) {
  assert((await stat(notices)).size > 0, 'Third-party notices must not be empty');
  const generator = new URL('scripts/generate-third-party-notices.mjs', root);
  if (existsSync(generator))
    execFileSync(process.execPath, [fileURLToPath(generator), '--check'], {
      cwd: fileURLToPath(root),
      stdio: 'pipe',
    });
}

console.log(
  `Verified ${targets.size} export targets, four CSS files, sourcemap, bundled helpers, external Preact, and DOM-free import.`,
);
