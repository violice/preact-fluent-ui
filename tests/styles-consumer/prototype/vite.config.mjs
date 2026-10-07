import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import wyw from '@wyw-in-js/vite';
import preact from '@preact/preset-vite';

const processor = fileURLToPath(new URL('./processor.mjs', import.meta.url));
export function prototypeConfig(root) {
  return {
    configFile: false,
    root,
    logLevel: 'silent',
    plugins: [
      wyw({
        include: ['**/*.{ts,tsx}'],
        sourceMap: true,
        tagResolver(source, tag) {
          return source === './api' && tag === 'css' ? processor : null;
        },
      }),
      preact({ devToolsEnabled: false, prefreshEnabled: false }),
    ],
    build: {
      write: false,
      minify: false,
      cssMinify: false,
      sourcemap: true,
      lib: { entry: join(root, 'entry.ts'), formats: ['es'], fileName: 'prototype' },
    },
  };
}
