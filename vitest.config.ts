import { defineConfig } from 'vitest/config';
import preact from '@preact/preset-vite';
import { fluentStyles } from './src/styling/adapters/vite.ts';

export default defineConfig({
  plugins: [
    fluentStyles({ outdir: '.artifacts/styled-system', sources: ['../../../dist/styling.js'] }),
    preact({ devToolsEnabled: false, prefreshEnabled: false }),
  ],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}', 'examples/gallery/src/**/*.test.{ts,tsx}'],
    css: true,
  },
});
