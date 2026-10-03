import { defineConfig } from 'vitest/config';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact({ devToolsEnabled: false, prefreshEnabled: false })],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}', 'examples/gallery/src/**/*.test.{ts,tsx}'],
    css: true,
  },
});
