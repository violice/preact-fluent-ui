import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { assertReleaseVersion } from './check-release.mjs';

test('accepts only the tag for this package version', () => {
  assert.doesNotThrow(() => assertReleaseVersion('v0.1.0', '0.1.0'));
  for (const tag of ['v0.1.1', 'tag0.1.0', '']) {
    assert.throws(() => assertReleaseVersion(tag, '0.1.0'));
  }
  assert.throws(() => assertReleaseVersion('v0.1.0', '0.1.1'));
});

test('CLI reads the requested manifest and rejects mismatches without a stack trace', async () => {
  const temporary = await mkdtemp(join(tmpdir(), 'preact-fluent-ui-release-'));
  const manifest = join(temporary, 'package.json');
  const script = fileURLToPath(new URL('./check-release.mjs', import.meta.url));
  const run = (...args) => spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });
  try {
    await writeFile(manifest, JSON.stringify({ version: '0.1.0' }));
    const accepted = run('v0.1.0', manifest);
    assert.equal(accepted.status, 0, accepted.stderr);
    for (const tag of ['v0.1.1', 'tag0.1.0', '']) {
      const rejected = run(tag, manifest);
      assert.equal(rejected.status, 1);
      assert.match(rejected.stderr, /expected v0\.1\.0/);
      assert.doesNotMatch(rejected.stderr, /\n\s+at /);
    }
    await writeFile(manifest, JSON.stringify({ version: '0.1.1' }));
    assert.equal(run('v0.1.0', manifest).status, 1);
    assert.equal(run('v0.1.0').status, 1);
    assert.equal(run('v0.1.0', join(temporary, 'missing.json')).status, 1);
    await writeFile(manifest, '{');
    assert.equal(run('v0.1.0', manifest).status, 1);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});
