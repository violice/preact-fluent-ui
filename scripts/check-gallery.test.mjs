import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';

const checker = resolve('scripts/check-gallery.mjs');
for (const [name, mutate, diagnostic] of [
  ['missing table family page', (dir) => rm(join(dir, 'components/table/index.html')), 'ENOENT'],
  ['missing shell preview', (dir) => rm(join(dir, 'shell-preview.html')), 'ENOENT'],
  ['missing nested page', (dir) => rm(join(dir, 'components/button/index.html')), 'ENOENT'],
  [
    'relative nested asset',
    async (dir) => {
      const file = join(dir, 'components/button/index.html');
      await writeFile(
        file,
        (await readFile(file, 'utf8')).replace(/href="[^"]*favicon.png"/, 'href="./favicon.png"'),
      );
    },
    'asset outside',
  ],
  [
    'unresolved template',
    async (dir) => {
      const file = join(dir, '404.html');
      await writeFile(file, (await readFile(file, 'utf8')) + '%BASE_URL%');
    },
    'unresolved template',
  ],
  [
    'incorrect page title',
    async (dir) => {
      const file = join(dir, 'components/button/index.html');
      await writeFile(
        file,
        (await readFile(file, 'utf8')).replace('Button | Preact Fluent UI', 'Wrong title'),
      );
    },
    'page title',
  ],
]) {
  test(`rejects ${name}`, async () => {
    const dir = await mkdtemp(join(tmpdir(), 'gallery-artifact-'));
    try {
      await cp('.gallery-dist', dir, { recursive: true });
      await mutate(dir);
      const result = spawnSync(process.execPath, [checker, dir], { encoding: 'utf8' });
      assert.equal(result.status, 1);
      assert.ok(result.stderr.includes(diagnostic), result.stderr);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
}
