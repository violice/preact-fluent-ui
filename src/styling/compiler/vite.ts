import { fileURLToPath } from 'node:url';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { resolve, relative, dirname } from 'node:path';
import wyw from '@wyw-in-js/vite';
import { loadConfigFromFile } from 'vite';
import type { Plugin } from 'vite';
import type { StylingConfig, ResolvedConfig } from '../config/types.ts';
import { resolveConfig } from '../config/resolve-config.ts';
import { tokenReferences, generateThemeCss } from './tokens.ts';
import { transformDynamic } from './dynamic.ts';
import { generateStylesCss } from './global-styles.ts';
import { fluentPreset } from '../config/fluent-preset.ts';
export interface FluentStylesOptions {
  config?: StylingConfig;
  configFile?: string;
  outdir?: string;
  sources?: string[];
}
export function fluentStyles(options: FluentStylesOptions = {}): Plugin[] {
  let root = process.cwd();
  let config: ResolvedConfig = resolveConfig(options.config ?? { presets: [fluentPreset] });
  const processor = fileURLToPath(
    new URL(import.meta.url.endsWith('.ts') ? './processor.ts' : './processor.js', import.meta.url),
  );
  const sources = new Set(['@violice/preact-fluent-ui/styling', ...(options.sources ?? [])]);
  function matches(source: string, importer?: string | null): boolean {
    const generated =
      importer && source.startsWith('.')
        ? resolve(dirname(importer), source).replace(/\.[cm]?[jt]s$/, '')
        : source.replace(/\.[cm]?[jt]s$/, '');
    return (
      sources.has(source) ||
      (outputPath !== undefined && generated === resolve(outputPath, 'css')) ||
      /(?:^|\/)styling(?:\/index(?:\.[cm]?[jt]s)?|\.js)?$/.test(source) ||
      source.endsWith('/styled-system/css') ||
      source === './styled-system/css'
    );
  }
  const context = { tokens: tokenReferences(config), conditions: config.conditions };
  const extraction = wyw({
    include: ['**/*.{js,jsx,ts,tsx}'],
    sourceMap: true,
    tagResolver(source, tag, meta) {
      return ['css', 'cva', 'sva'].includes(tag) && matches(source, meta.sourceFile)
        ? processor
        : null;
    },
    processors: { fluent: context } as never,
  });
  let outputPath: string;
  let configDependencies: string[] = [];
  const prepass: Plugin = {
    name: 'fluent-styles',
    enforce: 'pre',
    async configResolved(vite) {
      root = vite.root;
      if (options.configFile) {
        const loaded = await loadConfigFromFile(
          { command: vite.command, mode: vite.mode },
          resolve(root, options.configFile),
        );
        if (!loaded) throw new Error(`Cannot load styling config: ${options.configFile}`);
        configDependencies = [resolve(root, options.configFile), ...loaded.dependencies];
        config = resolveConfig(loaded.config as StylingConfig);
        // Options are shared by reference with WyW before its first transform.
        context.tokens = tokenReferences(config);
        context.conditions = config.conditions;
      }
      outputPath = resolve(root, options.outdir ?? 'styled-system');
      if (outputPath === root)
        throw new Error('Styling output directory must not be the project root');
      await mkdir(outputPath, { recursive: true });
      const refs = tokenReferences(config);
      const source = '@violice/preact-fluent-ui/styling';
      await writeFile(
        resolve(outputPath, 'css.ts'),
        `export { css, cx, cva, sva, __createCva, __createSva, __styleProps } from ${JSON.stringify(source)};\nexport type { RecipeVariant, RecipeVariantProps } from ${JSON.stringify(source)};\nexport const token = { var(path: ${
          Object.keys(refs)
            .map((path) => JSON.stringify(path))
            .join(' | ') || 'never'
        }) { return (${JSON.stringify(refs)} as Record<string,string>)[path]; } };\n`,
      );
      await writeFile(resolve(outputPath, 'theme.css'), generateThemeCss(config));
      const styleDirectory = new URL(
        import.meta.url.endsWith('.ts') ? '../../styles/' : './',
        import.meta.url,
      );
      const [reset, native] = await Promise.all([
        config.reset ? readFile(new URL('reset.css', styleDirectory), 'utf8') : '',
        config.native ? readFile(new URL('native-controls.css', styleDirectory), 'utf8') : '',
      ]);
      const staticCss = generateStylesCss(config, reset, native);
      await writeFile(
        resolve(outputPath, 'styles.css'),
        `@import '@violice/preact-fluent-ui/styles.css';\n${staticCss}`,
      );
      sources.add(resolve(outputPath, 'css.ts'));
    },
    configureServer(server) {
      server.watcher.add(configDependencies);
    },
    async handleHotUpdate({ file, server }) {
      if (configDependencies.includes(file)) {
        await server.restart();
        return [];
      }
    },
    transform(code, id) {
      if (id.includes('/node_modules/') || !/\.[cm]?[jt]sx?(?:\?|$)/.test(id)) return null;
      return transformDynamic(code, relative(root, id), (source) => matches(source, id), context);
    },
  };
  return [prepass, extraction];
}
