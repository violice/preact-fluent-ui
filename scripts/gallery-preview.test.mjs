import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
import { test } from 'node:test';

// Start the actual Vite preview configuration in a separate process so a rejected
// middleware promise is observable as a server crash, just as for the CLI.
test('preview survives malformed paths and missing fallback HTML', async () => {
  const output = await mkdtemp(join(tmpdir(), 'gallery-preview-'));
  await mkdir(join(output, 'components/button'), { recursive: true });
  await writeFile(join(output, 'components/button/index.html'), '<h1>Button</h1>');
  await writeFile(join(output, '404.html'), '<h1>Page not found</h1>');
  const child = spawn(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `
    import { preview } from 'vite';
    const server = await preview({
      configFile: 'examples/gallery/vite.config.ts',
      build: { outDir: ${JSON.stringify(output)} },
      preview: { host: '127.0.0.1', port: 0, strictPort: true },
    });
    console.log('READY ' + server.httpServer.address().port);
  `,
    ],
    { env: { ...process.env, GALLERY_BASE: '/preact-fluent-ui/' } },
  );
  let logs = '';
  child.stderr.on('data', (chunk) => {
    logs += chunk;
  });
  try {
    const port = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Preview did not start: ${logs}`)), 10000);
      child.stdout.on('data', (chunk) => {
        logs += chunk;
        const ready = logs.match(/READY (\d+)/);
        if (ready) {
          clearTimeout(timer);
          resolve(Number(ready[1]));
        }
      });
      child.once('exit', () => {
        clearTimeout(timer);
        reject(new Error(`Preview exited: ${logs}`));
      });
    });
    const base = `http://127.0.0.1:${port}/preact-fluent-ui/`;
    const request = (path) => fetch(base + path, { signal: AbortSignal.timeout(3000) });
    const malformed = await request('%ZZ');
    assert.equal(malformed.status, 400);
    const nested = await request('components/button?theme=dark');
    assert.equal(nested.status, 200);
    assert.equal(await nested.text(), '<h1>Button</h1>');
    await rm(join(output, '404.html'));
    const missingFallback = await request('unknown');
    assert.equal(missingFallback.status, 500);
    assert.equal((await request('components/button')).status, 200);
    assert.equal(child.exitCode, null, logs);
    assert.doesNotMatch(logs, /URIError|unhandledRejection/);
  } finally {
    if (child.exitCode === null) {
      const stopped = once(child, 'exit');
      child.kill();
      await stopped;
    }
    await rm(output, { recursive: true, force: true });
  }
});
