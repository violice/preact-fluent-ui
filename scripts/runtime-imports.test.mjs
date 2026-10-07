import assert from 'node:assert/strict';
import { test } from 'node:test';
import { runtimeImports } from './runtime-imports.mjs';

test('ignores CSS imports and import examples inside strings and comments', () => {
  const js = `const css = "@import 'library/styles.css';";
    const example = "import 'example'; export { css } from 'example';";
    // import 'comment';
    /* export { css } from 'comment'; */`;
  assert.deepEqual(runtimeImports(js), []);
});

test('finds static imports, reexports, side effects and literal dynamic imports', () => {
  const js = `import { h } from 'preact';
    import 'side-effect';
    export { css } from './styles.js';
    export * from './helpers.js';
    const load = () => import('./lazy.js');`;
  assert.deepEqual(runtimeImports(js), [
    'preact',
    'side-effect',
    './styles.js',
    './helpers.js',
    './lazy.js',
  ]);
});

test('retains actual CSS dependencies for the package guard', () => {
  assert.deepEqual(runtimeImports("import './styles.css';"), ['./styles.css']);
});
