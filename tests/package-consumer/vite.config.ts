import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import { fluentStyles } from '@violice/preact-fluent-ui/vite';
import { fluentPreset } from '@violice/preact-fluent-ui/config';

function consumerModules(mode: string): Plugin {
  return {
    name: 'installed-consumer-modules',
    // Vite does not compose third-party sourceMappingURL files automatically.
    // Load the archive's own map without changing its code or import resolution.
    async load(id) {
      if (
        !/\/node_modules\/@violice\/preact-fluent-ui\/dist\/[^/]+\.js$/.test(
          id.replaceAll('\\', '/'),
        )
      )
        return;
      const code = await readFile(id, 'utf8');
      if (!code.includes('sourceMappingURL=')) return;
      return { code, map: JSON.parse(await readFile(`${id}.map`, 'utf8')) };
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
  plugins: [fluentStyles({ config: { presets: [fluentPreset] } }), consumerModules(mode)],
  build: {
    outDir: `dist-${mode}`,
    sourcemap: true,
    rolldownOptions: { input: resolve(mode === 'minimal' ? 'minimal.html' : 'index.html') },
  },
}));
