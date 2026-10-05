import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';

const directory = resolve(process.argv[2] ?? '.gallery-dist');
const base = process.env.GALLERY_BASE ?? '/';
assert.match(base, /^\/(?:[^?#]*\/)?$/, 'GALLERY_BASE must be an absolute path ending in /');
const root = await readFile(resolve(directory, 'index.html'), 'utf8');
const data = root.match(/<script[^>]*id="prerender-data"[^>]*>(.*?)<\/script>/s);
assert.ok(data, 'Missing prerender page registry');
const { pages } = JSON.parse(data[1]);
assert.equal(pages.length, 35, 'Expected every registered documentation page');
assert.equal(new Set(pages.map((page) => page.path)).size, pages.length, 'Duplicate page paths');
for (const page of [...pages, { path: '/404', title: 'Page not found' }]) {
  const file =
    page.path === '/'
      ? 'index.html'
      : page.path === '/404'
        ? '404.html'
        : `${page.path.slice(1)}/index.html`;
  const html = await readFile(resolve(directory, file), 'utf8');
  assert.match(html, /<html[^>]*lang="en"/, `${file}: English language`);
  assert.ok(
    html.includes(`<title>${page.title} | Preact Fluent UI</title>`),
    `${file}: page title`,
  );
  assert.match(html, /<main\b/, `${file}: prerendered main`);
  assert.match(html, /<h1\b/, `${file}: prerendered heading`);
  assert.match(html, /type="isodata"/, `${file}: hydration marker`);
  assert.doesNotMatch(
    html,
    /%BASE_URL%|<div id="gallery"><\/div>|\/src\/main\.tsx/,
    `${file}: unresolved template`,
  );
  const assets = [...html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="([^"]+)"/g)].map(
    (match) => match[1],
  );
  assert.ok(
    assets.some((url) => url.endsWith('/favicon.png')),
    `${file}: favicon`,
  );
  assert.ok(
    assets.some((url) => /\/assets\/.*\.js$/.test(url)),
    `${file}: script`,
  );
  for (const url of assets) {
    assert.ok(url.startsWith(base), `${file}: asset outside ${base}: ${url}`);
    await access(resolve(directory, decodeURIComponent(url.slice(base.length))));
  }
}
const preview = await readFile(resolve(directory, 'shell-preview.html'), 'utf8');
assert.match(preview, /<html[^>]*lang="en"/, 'shell preview: English language');
assert.doesNotMatch(
  preview,
  /%BASE_URL%|\/src\/shell-preview\.tsx/,
  'shell preview: unresolved template',
);
const previewAssets = [...preview.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="([^"]+)"/g)].map(
  (match) => match[1],
);
assert.ok(
  previewAssets.some((url) => /\/assets\/.*\.js$/.test(url)),
  'shell preview: script',
);
assert.ok(
  previewAssets.some((url) => /\/assets\/.*\.css$/.test(url)),
  'shell preview: styles',
);
for (const url of previewAssets) {
  assert.ok(url.startsWith(base), `shell preview: asset outside ${base}: ${url}`);
  await access(resolve(directory, decodeURIComponent(url.slice(base.length))));
}
for (const page of pages.filter((page) => page.path.startsWith('/components/app-shell'))) {
  const html = await readFile(resolve(directory, `${page.path.slice(1)}/index.html`), 'utf8');
  assert.ok(
    html.includes(`src="${base}shell-preview.html"`),
    `${page.path}: base-aware shell preview`,
  );
}
for (const [slug, members] of [
  [
    'table',
    [
      'table',
      'table-container',
      'table-header',
      'table-body',
      'table-footer',
      'table-row',
      'table-header-cell',
      'table-cell',
      'table-caption',
    ],
  ],
  ['disclosure', ['disclosure', 'disclosure-summary', 'disclosure-content']],
  ['spinner', ['spinner']],
  ['loading-state', ['loading-state']],
  ['tooltip', ['tooltip']],
  ['data-list', ['data-list', 'data-list-item', 'data-list-label', 'data-list-value']],
  ['data-toolbar', ['data-toolbar', 'data-toolbar-group']],
  [
    'app-shell',
    [
      'app-shell',
      'app-shell-workspace',
      'app-shell-header',
      'app-shell-content',
      'app-shell-footer',
    ],
  ],
  [
    'sidebar',
    [
      'sidebar',
      'sidebar-header',
      'sidebar-nav',
      'sidebar-group',
      'sidebar-item',
      'sidebar-footer',
      'sidebar-brand',
    ],
  ],
  ['dialog', ['modal', 'dialog-header', 'dialog-body', 'dialog-footer', 'confirm-dialog']],
]) {
  const html = await readFile(resolve(directory, `components/${slug}/index.html`), 'utf8');
  assert.ok(html.includes('API reference'), `${slug}: API reference`);
  for (const member of members) {
    assert.ok(html.includes(`id="${member}"`), `${slug}: ${member} API subsection`);
    if (member !== slug) {
      assert.ok(
        !pages.some((page) => page.path === `/components/${member}`),
        `${member}: no constituent route`,
      );
    }
  }
}
assert.ok(!pages.some((page) => page.path === '/getting-started'), 'Getting Started uses the root');
for (const page of pages.filter((page) => page.path.startsWith('/utils/'))) {
  const html = await readFile(resolve(directory, `${page.path.slice(1)}/index.html`), 'utf8');
  assert.ok(
    html.includes('API reference') && html.includes('Return value') && html.includes('Parameter'),
    `${page.path}: parameter and return API reference`,
  );
}
console.log(`Gallery artifact verified: ${pages.length} pages and 404 at ${base}`);
