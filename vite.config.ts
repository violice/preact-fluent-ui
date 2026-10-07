import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import { fluentStyles } from './src/styling/adapters/vite.ts';

function libraryModules(): Plugin {
  return {
    name: 'library-modules',
    apply: 'build',
    async generateBundle(_options, bundle) {
      const entries: Record<string, { modules: string[]; externalImports: string[] }> = {};
      for (const entry of Object.values(bundle)) {
        if (entry.type !== 'chunk' || !entry.isEntry) continue;
        const modules = new Set<string>();
        const externalImports = new Set<string>();
        const visited = new Set<string>();
        function visit(name: string): void {
          if (visited.has(name)) return;
          visited.add(name);
          const chunk = bundle[name];
          if (!chunk || chunk.type !== 'chunk') {
            externalImports.add(name);
            return;
          }
          Object.keys(chunk.modules).forEach((id) => modules.add(id));
          [...chunk.imports, ...chunk.dynamicImports].forEach(visit);
        }
        visit(entry.fileName);
        entries[entry.name] = {
          modules: [...modules].sort(),
          externalImports: [...externalImports].sort(),
        };
      }
      const artifactDirectory = new URL('./.artifacts/', import.meta.url);
      await mkdir(artifactDirectory, { recursive: true });
      await writeFile(
        new URL('library-modules.json', artifactDirectory),
        JSON.stringify({ ...entries.index, entries }, null, 2) + '\n',
      );
    },
  };
}

export default defineConfig({
  plugins: [
    fluentStyles({ outdir: '.artifacts/styled-system' }),
    preact({ devToolsEnabled: false, prefreshEnabled: false }),
    libraryModules(),
  ],
  build: {
    lib: {
      entry: Object.fromEntries(
        Object.entries({
          index: './src/index.ts',
          styling: './src/styling/index.ts',
          config: './src/styling/config/index.ts',
          vite: './src/styling/adapters/vite.ts',
          processor: './src/styling/adapters/processor.ts',
        }).map(([name, path]) => [name, fileURLToPath(new URL(path, import.meta.url))]),
      ),
      formats: ['es'],
      fileName: (_format, entry) => `${entry}.js`,
      cssFileName: 'styles',
    },
    sourcemap: true,
    rolldownOptions: {
      external: (id) =>
        id === 'preact' ||
        id.startsWith('preact/') ||
        id.startsWith('node:') ||
        id.startsWith('@wyw-in-js/') ||
        ['vite', 'oxc-parser', 'magic-string'].includes(id),
    },
  },
});
