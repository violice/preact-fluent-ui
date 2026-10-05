import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { isAbsolute } from 'node:path';

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
assert.equal(sourcemap.sourcesContent.length, sourcemap.sources.length);
assert(!sourcemap.sourceRoot, 'Published sourcemap must not have a local sourceRoot');
for (const [index, source] of sourcemap.sources.entries()) {
  const normalized = source.replaceAll('\\', '/');
  assert(
    !isAbsolute(source) && !/^[a-z]+:/i.test(normalized),
    `Absolute sourcemap path: ${source}`,
  );
  assert(!/(?:^|\/)preact(?:\/|$)/.test(normalized), `Embedded Preact source: ${source}`);
  assert(
    /^\.\.\/(?:src\/(?:utils\/(?:merge-classes|resolve-class|merge-props|use-render)\.ts|components\/(?:[^/]+\.(?:tsx|module\.css)|(?:tooltip-(?:position|theme)|text-style)\.ts)|icons\/[^/]+\.(?:ts|tsx|module\.css))|node_modules\/(?:clsx|class-variance-authority)\/dist\/[^/]+\.mjs)$/.test(
      normalized,
    ) && !/\.test\./.test(normalized),
    `Unrelated sourcemap source: ${source}`,
  );
  assert.equal(
    typeof sourcemap.sourcesContent[index],
    'string',
    `Missing source content: ${source}`,
  );
  assert(sourcemap.sourcesContent[index].length > 0, `Empty source content: ${source}`);
}

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

const declarationFiles = (await readdir(new URL('dist/', root), { recursive: true })).filter(
  (file) => file.endsWith('.d.ts'),
);
for (const file of declarationFiles) {
  const declarations = await readFile(new URL(`dist/${file}`, root), 'utf8');
  assert(
    !/\.css|vite|vitest|class-variance-authority|clsx/.test(declarations),
    `Declaration exposes build dependencies: ${file}`,
  );
  for (const match of declarations.matchAll(/\b(?:from\s*|import\s*\()\s*['"]([^'"]+)['"]/g)) {
    const specifier = match[1];
    assert(
      specifier.startsWith('.') || specifier === 'preact' || specifier.startsWith('preact/'),
      `Unexpected declaration dependency: ${specifier}`,
    );
  }
}

const exportProbe = `
  const library = await import(${JSON.stringify(jsUrl.href)});
  for (const name of ['DataToolbar', 'DataToolbarGroup', 'AppToolbar']) {
    if (name in library) throw new Error('Removed export present: ' + name);
  }
  for (const name of ['TextPreview', 'CodeBlock', 'Disclosure', 'DisclosureSummary', 'DisclosureContent', 'Spinner', 'LoadingState', 'Tooltip', 'Table', 'TableContainer', 'TableHeader', 'TableBody', 'TableFooter', 'TableRow', 'TableHeaderCell', 'TableCell', 'TableCaption', 'Pagination', 'AppShellToolbar', 'Toolbar', 'ToolbarGroup', 'DataList', 'DataListItem', 'DataListLabel', 'DataListValue', 'Separator', 'Switch', 'Checkbox', 'Field', 'Input', 'Textarea', 'Button', 'Card', 'InfoBar', 'CounterBadge', 'Text', 'Box', 'StatusBadge', 'Select', 'PageHeader', 'EmptyState', 'Icon', 'Modal', 'ConfirmDialog', 'DialogHeader', 'DialogBody', 'DialogFooter', 'Sidebar', 'SidebarHeader', 'SidebarNav', 'SidebarGroup', 'SidebarItem', 'SidebarFooter', 'SidebarBrand', 'AppShell', 'AppShellWorkspace', 'AppShellHeader', 'AppShellContent', 'AppShellFooter', 'mergeClasses', 'resolveClass', 'mergeProps', 'useRender']) {
    if (typeof library[name] !== 'function') throw new Error(name + ' export is missing');
  }
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

const requiredPackageFiles = [
  'README.md',
  'LICENSE',
  'THIRD_PARTY_NOTICES.txt',
  'licenses/fluent-system-icons.txt',
];
for (const file of requiredPackageFiles) {
  assert((await stat(new URL(file, root))).size > 0, `Missing or empty package document: ${file}`);
}
execFileSync(
  process.execPath,
  [fileURLToPath(new URL('scripts/generate-third-party-notices.mjs', root)), '--check'],
  {
    cwd: fileURLToPath(root),
    stdio: 'pipe',
  },
);
const packOutput = JSON.parse(
  execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
    cwd: fileURLToPath(root),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }),
);
// npm 10/11 return an array; npm 12 keys this object by package name.
const archives = Array.isArray(packOutput) ? packOutput : Object.values(packOutput);
assert.equal(archives.length, 1, 'Expected one package from npm pack');
const [archive] = archives;
const packedFiles = new Set(archive.files.map((file) => file.path));
for (const file of packedFiles) {
  assert(
    /^(?:dist\/|licenses\/|package\.json$|README\.md$|LICENSE$|THIRD_PARTY_NOTICES\.txt$)/.test(
      file,
    ),
    `Unexpected npm pack file: ${file}`,
  );
  assert(
    !/(?:^|\/)(?:node_modules|src|tests|scripts|examples|gallery)(?:\/|$)/.test(file),
    `Private file in npm pack: ${file}`,
  );
}
for (const file of [
  ...requiredPackageFiles,
  ...[...targets].map((target) => target.slice(2)),
  'dist/index.js.map',
  ...declarationFiles.map((file) => `dist/${file}`),
]) {
  assert(packedFiles.has(file), `Required file missing from npm pack: ${file}`);
}

console.log(
  `Verified ${targets.size} export targets, four CSS files, sourcemap, bundled helpers, external Preact, DOM-free import, declarations, notices, and npm pack contents.`,
);
