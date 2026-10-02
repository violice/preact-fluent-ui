import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const artifactDirectory = join(root, '.artifacts/package');

function run(args, capture = false) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {
      cwd: root,
      shell: false,
      stdio: ['ignore', capture ? 'pipe' : 'inherit', 'inherit'],
    });
    let output = '';
    if (capture) child.stdout.on('data', (data) => (output += data));
    child.on('error', reject);
    child.on('close', (code, signal) => {
      if (code === 0) resolve(output);
      else reject(Object.assign(new Error(`Command exited ${code ?? signal}`), { code }));
    });
  });
}

try {
  assert(process.env.npm_execpath, 'Run this command through npm run test:package:all');
  await mkdir(artifactDirectory, { recursive: true });
  const output = JSON.parse(
    await run(
      [
        process.env.npm_execpath,
        'pack',
        '--json',
        '--ignore-scripts',
        '--pack-destination',
        artifactDirectory,
      ],
      true,
    ),
  );
  const packed = Array.isArray(output) ? output : Object.values(output);
  assert.equal(packed.length, 1, 'Expected one package archive');
  const archive = join(artifactDirectory, packed[0].filename);
  console.log(`Packed once: ${archive}`);
  const lock = JSON.parse(await readFile(join(root, 'package-lock.json'), 'utf8'));
  for (const preact of [lock.packages['node_modules/preact'].version, '10.27.0']) {
    await run([join(root, 'scripts/test-package.mjs'), '--tarball', archive, '--preact', preact]);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = Number.isInteger(error.code) && error.code !== 0 ? error.code : 1;
}
