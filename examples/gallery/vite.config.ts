import { fileURLToPath } from 'node:url';
import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  base: './',
  plugins: [preact({ devToolsEnabled: false })],
  server: { host: '0.0.0.0', port: 5173, strictPort: true },
  build: {
    outDir: '../../.gallery-dist',
    emptyOutDir: true,
  },
});
