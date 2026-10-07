import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';
import { fluentPreset } from '../../src/styles/config/fluent-preset.ts';
import { fluentStyles } from '../../src/styles/adapters/vite.ts';

import { generateResetCss, generateNativeCss } from '../../src/styles/compiler/global-styles.ts';

const defaultsDirectory = new URL('../../.artifacts/gallery-defaults/', import.meta.url);
await mkdir(defaultsDirectory, { recursive: true });
await writeFile(new URL('reset.css', defaultsDirectory), generateResetCss());
await writeFile(new URL('native-controls.css', defaultsDirectory), generateNativeCss());

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  base: process.env.GALLERY_BASE ?? '/',
  plugins: [
    fluentStyles({
      outdir: '../../.artifacts/gallery-styled-system',
      config: { presets: [fluentPreset], reset: false, native: false },
    }),
    {
      name: 'gallery-static-preview',
      configurePreviewServer(server) {
        const base = server.config.base;
        const output = resolve(server.config.root, server.config.build.outDir);
        server.middlewares.use(async (request, response, next) => {
          try {
            let url: URL;
            let path: string;
            try {
              url = new URL(request.url ?? '/', 'http://localhost');
              path = decodeURIComponent(url.pathname.slice(base.length)).replace(/\/$/, '');
            } catch {
              response.statusCode = 400;
              response.end('Malformed request path');
              return;
            }
            if (!url.pathname.startsWith(base) || /\.[^/]+$/.test(url.pathname)) return next();
            const file = resolve(output, path, 'index.html');
            if (!file.startsWith(output + sep)) return next();
            let html: Buffer;
            try {
              html = await readFile(file);
            } catch {
              html = await readFile(resolve(output, '404.html'));
              response.statusCode = 404;
            }
            response.setHeader('Content-Type', 'text/html');
            response.end(html);
          } catch {
            response.statusCode = 500;
            response.end('Gallery preview unavailable');
          }
        });
      },
    },
    preact({
      devToolsEnabled: false,
      prerender: {
        enabled: true,
        renderTarget: '#gallery',
        prerenderScript: fileURLToPath(new URL('src/main.tsx', import.meta.url)),
        additionalPrerenderRoutes: ['/404.html'],
      },
    }),
  ],
  server: { host: '0.0.0.0', port: 5173, strictPort: true },
  build: {
    outDir: '../../.gallery-dist',
    rollupOptions: {
      input: {
        gallery: fileURLToPath(new URL('index.html', import.meta.url)),
        shell: fileURLToPath(new URL('shell-preview.html', import.meta.url)),
      },
    },
    emptyOutDir: true,
  },
});
