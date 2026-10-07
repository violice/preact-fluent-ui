// @vitest-environment node
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { afterEach, expect, it } from 'vitest';
import { build } from 'vite';
import preact from '@preact/preset-vite';
import { fluentStyles } from '../../../../../src/styles/adapters/vite';
import { fluentPreset } from '../../../../../src/styles/config/fluent-preset';
import { resolveConfig } from '../../../../../src/styles/config/resolve-config';
import { generateStylesCss } from '../../../../../src/styles/compiler/global-styles';
import type { FluentStylesOptions } from '../../../../../src/styles/adapters/vite';
import { styleDocs } from './style-docs';
import { configurationOverviewCode, configurationHelpersCode } from '../styling/configuration-code';

const temporaryRoots: string[] = [];
afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

it('resolves the overview configuration and emits token-backed global rules', () => {
  let options: FluentStylesOptions | undefined;
  const executable = configurationOverviewCode.replace(/^import .*;$/gm, '');
  new Function('fluentStyles', 'fluentPreset', executable)((value: FluentStylesOptions) => {
    options = value;
  }, fluentPreset);
  const config = resolveConfig(options!.config!);
  expect(config.reset).toBe(true);
  expect(config.native).toBe(true);
  expect(config.themes.compact.tokens?.spacing.page).toEqual({ value: '16px' });
  const css = generateStylesCss(config);
  expect(css).toContain('background-color:var(--pfui-colors-canvas)');
  expect(css).toContain('--pfui-app-heading:var(--pfui-brand-blue)');
  expect(css).toContain('[data-pfui-theme="compact"]');
});

it('compiles the displayed demo sources and configuration helper example', async () => {
  const root = await mkdtemp(join(process.cwd(), '.artifacts/gallery-snippets-'));
  temporaryRoots.push(root);
  for (const doc of styleDocs) {
    await writeFile(join(root, `${doc.name.replace('.', '-')}.tsx`), doc.code);
  }
  await writeFile(join(root, 'config.ts'), configurationHelpersCode);
  await writeFile(
    join(root, 'entry.ts'),
    [
      ...styleDocs.map((doc) => `export * from './${doc.name.replace('.', '-')}';`),
      "export { default as appConfig } from './config';",
      "export { token } from './styled-system/css';",
    ].join('\n'),
  );
  const result = await build({
    configFile: false,
    root,
    logLevel: 'silent',
    plugins: [
      ...fluentStyles({ config: { presets: [fluentPreset] } }),
      preact({ devToolsEnabled: false, prefreshEnabled: false }),
    ],
    build: {
      write: false,
      minify: false,
      cssMinify: false,
      lib: { entry: join(root, 'entry.ts'), formats: ['es'] },
    },
  });
  const output = Array.isArray(result) ? result[0] : result;
  if (!('output' in output)) throw new Error('Expected bundle output');
  const js = output.output
    .filter((item) => item.type === 'chunk')
    .map((item) => item.code)
    .join('\n');
  const css = output.output
    .flatMap((item) =>
      item.type === 'asset' && item.fileName.endsWith('.css') ? [String(item.source)] : [],
    )
    .join('\n');
  expect(css).toContain('var(--pfui-colors-primary)');
  expect(css).toContain('var(--pfui-colors-surface)');
  expect(css).toMatch(/:hover \.pfui-sva-[a-z0-9-]+\{text-decoration:underline\}/);
  expect(css).not.toContain('{label}');
  expect(css).not.toMatch(/(?:color|background-color|padding):(?:colors|spacing)\./);
  const module = await import(`data:text/javascript,${encodeURIComponent(js)}`);
  expect(module.actionStyles({ size: undefined })).toBe(module.actionStyles());
  expect(module.actionStyles({ size: null })).not.toBe(module.actionStyles());
  expect(module.actionStyles({ size: 'large', rounded: true })).not.toBe(
    module.actionStyles({ size: 'large', rounded: false }),
  );
  expect(module.cardStyles({ compact: true, highlighted: true }).label).not.toBe(
    module.cardStyles({ compact: true, highlighted: false }).label,
  );
  expect(module.token.var('colors.primary')).toBe('var(--pfui-colors-primary)');
  const resolved = resolveConfig(module.appConfig);
  expect(resolved.theme.tokens.spacing.page).toEqual({
    value: '24px',
    description: 'Application page padding',
  });
}, 30000);
