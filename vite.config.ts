import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';

function libraryModules(): Plugin {
  return {
    name: 'library-modules',
    apply: 'build',
    async generateBundle(_options, bundle) {
      const modules = new Set<string>();
      const externalImports = new Set<string>();
      for (const output of Object.values(bundle)) {
        if (output.type !== 'chunk') continue;
        for (const id of Object.keys(output.modules)) modules.add(id);
        for (const id of [...output.imports, ...output.dynamicImports]) {
          if (!Object.hasOwn(bundle, id)) externalImports.add(id);
        }
      }
      const artifactDirectory = new URL('./.artifacts/', import.meta.url);
      await mkdir(artifactDirectory, { recursive: true });
      await writeFile(
        new URL('library-modules.json', artifactDirectory),
        JSON.stringify(
          { modules: [...modules].sort(), externalImports: [...externalImports].sort() },
          null,
          2,
        ) + '\n',
      );
    },
  };
}

export default defineConfig({
  plugins: [preact({ devToolsEnabled: false, prefreshEnabled: false }), libraryModules()],
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'styles',
    },
    sourcemap: true,
    rolldownOptions: {
      external: (id) => id === 'preact' || id.startsWith('preact/'),
    },
  },
});
