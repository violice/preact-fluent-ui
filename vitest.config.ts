import { defineConfig } from 'vitest/config';
import preact from '@preact/preset-vite';
import { fluentStyles } from './src/styles/adapters/vite.ts';

export default defineConfig({
  plugins: [
    fluentStyles({
      outdir: '.artifacts/gallery-styled-system',
    }),
    preact({ devToolsEnabled: false, prefreshEnabled: false }),
  ],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}', 'examples/gallery/src/**/*.test.{ts,tsx}'],
    css: true,
  },
});
