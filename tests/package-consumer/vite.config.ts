import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';

function consumerModules(mode: string): Plugin {
  return {
    name: 'installed-consumer-modules',
    // Vite does not compose third-party sourceMappingURL files automatically.
    // Load the archive's own map without changing its code or import resolution.
    async load(id) {
      if (
        !id.replaceAll('\\', '/').endsWith('/node_modules/@violice/preact-fluent-ui/dist/index.js')
      )
        return;
      return {
        code: await readFile(id, 'utf8'),
        map: JSON.parse(await readFile(`${id}.map`, 'utf8')),
      };
    },
    async generateBundle(_options, bundle) {
      const chunks = Object.values(bundle)
        .filter((output) => output.type === 'chunk')
        .map((chunk) => ({
          fileName: chunk.fileName,
          isEntry: chunk.isEntry,
          imports: chunk.imports,
          dynamicImports: chunk.dynamicImports,
          sourcemap: `${chunk.fileName}.map`,
          modules: Object.entries(chunk.modules).map(([id, module]) => ({
            id,
            renderedLength: module.renderedLength,
            renderedExports: module.renderedExports,
          })),
        }));
      await mkdir('.artifacts', { recursive: true });
      await writeFile(
        `.artifacts/${mode}-modules.json`,
        JSON.stringify({ chunks }, null, 2) + '\n',
      );
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [consumerModules(mode)],
  build: {
    outDir: `dist-${mode}`,
    sourcemap: true,
    rolldownOptions: { input: resolve(mode === 'minimal' ? 'minimal.html' : 'index.html') },
  },
}));
