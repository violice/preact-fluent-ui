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
assert.equal(pages.length, 30, 'Expected every registered documentation page');
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
console.log(`Gallery artifact verified: ${pages.length} pages and 404 at ${base}`);
