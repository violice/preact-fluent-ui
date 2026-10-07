// @vitest-environment node
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { build } from 'vite';
import { fluentStyles } from './vite';
let root: string;
beforeEach(async () => {
  root = await mkdtemp(join(process.cwd(), '.artifacts/style-'));
});
afterEach(async () => {
  await rm(root, { recursive: true, force: true });
});
async function compile(code: string, outdir?: string) {
  await writeFile(join(root, 'entry.ts'), code);
  const result = await build({
    configFile: false,
    root,
    logLevel: 'silent',
    plugins: fluentStyles({
      outdir,
      config: {
        theme: { tokens: { colors: { accent: { value: 'red' } } } },
        conditions: { md: '@media (min-width: 800px)' },
      },
    }),
    build: {
      write: false,
      minify: false,
      cssMinify: false,
      lib: { entry: join(root, 'entry.ts'), formats: ['es'] },
    },
  });
  const output = Array.isArray(result) ? result[0] : result;
  if (!('output' in output)) throw new Error('Expected bundle');
  const js = output.output
    .filter((item) => item.type === 'chunk')
    .map((item) => item.code)
    .join('\n');
  const css = output.output
    .flatMap((item) =>
      item.type === 'asset' && item.fileName.endsWith('.css') ? [item.source.toString()] : [],
    )
    .join('\n');
  return { css, module: await import(`data:text/javascript,${encodeURIComponent(js)}`) };
}
const api = join(process.cwd(), 'src/styling/index.ts');
it('compiles tokens and all cva/sva branches even when selected at runtime', async () => {
  const result = await compile(
    `import {css,cva,sva} from ${JSON.stringify(api)}; export const classes=css({color:'accent',_md:{gap:12}}); const button=cva({variants:{size:{sm:{height:24},lg:{height:48}}},defaultVariants:{size:'sm'}}); export const choose=(size)=>button({size}); const card=sva({slots:['root','label'],variants:{invalid:{true:{label:{color:'red'}}}}}); export const parts=()=>card({invalid:true});`,
  );
  expect(result.css).toContain('var(--pfui-colors-accent)');
  expect(result.css).toContain('height:48px');
  expect(result.css).toContain('@media');
  expect(result.module.choose('lg')).not.toBe(result.module.choose('sm'));
  expect(result.module.parts().label).toBeTruthy();
});
it('generates local variables with units and evaluates dynamic expressions once', async () => {
  const result = await compile(
    `import {css} from ${JSON.stringify(api)}; export let calls=0;export function layout(width){return css.dynamic({width:(calls++,width),opacity:0.5,_md:{height:width+1},color:'accent'})}`,
  );
  const props = result.module.layout(80);
  expect(result.module.calls).toBe(1);
  expect(Object.values(props.style)).toContain('80px');
  expect(Object.values(props.style)).toContain('81px');
  expect(result.css).toContain('width:var(--pfui-local-');
  expect(result.css).toContain('opacity:0.5');
  expect(result.css).toContain('@media');
});
it('respects import aliases and lexical shadowing for css.dynamic', async () => {
  const result = await compile(
    `import {css as styles} from ${JSON.stringify(api)}; export function layout(width){return styles.dynamic({width})} export function foreign(styles){return styles.dynamic({width:1})}`,
  );
  expect(Object.values(result.module.layout(3).style)).toContain('3px');
  expect(result.module.foreign({ dynamic: (value: unknown) => value })).toEqual({ width: 1 });
});
it('rejects spreads instead of silently losing dynamic style properties', async () => {
  await expect(
    compile(
      `import {css} from ${JSON.stringify(api)}; export const layout=(values)=>css.dynamic({...values});`,
    ),
  ).rejects.toThrow(/spread|object/i);
});

it('preserves catch, loop and hoisted var shadows', async () => {
  const result = await compile(`import {css} from ${JSON.stringify(api)};
 export function caught(other){try {throw other} catch(css){return css.dynamic({width:2})}}
 export function loop(values){for(const css of values){return css.dynamic({width:3})}}
 export function hoisted(other){if(true){var css=other} return css.dynamic({width:4})}`);
  const other = { dynamic: (value: unknown) => value };
  expect(result.module.caught(other)).toEqual({ width: 2 });
  expect(result.module.loop([other])).toEqual({ width: 3 });
  expect(result.module.hoisted(other)).toEqual({ width: 4 });
});
it('expands dynamic spacing into independently composable variables', async () => {
  const result = await compile(
    `import {css,cx} from ${JSON.stringify(api)}; const left=css({paddingLeft:4}); export function layout(padding){const props=css.dynamic({padding});return {...props,class:cx(props.class,left)}}`,
  );
  const props = result.module.layout('8px 12px');
  expect(Object.values(props.style)).toEqual(['8px', '12px', '8px', '12px']);
  expect(props.class.split(' ')).toHaveLength(4);
  expect(result.css).not.toMatch(/[;{]padding:/);
});

it('extracts relative imports from a custom generated directory', async () => {
  const result = await compile(
    `import {css,cva} from './generated/css';export function layout(width){return css.dynamic({width})};const recipe=cva({base:{color:'red'}});export const classes=recipe();`,
    'generated',
  );
  expect(Object.values(result.module.layout(5).style)).toContain('5px');
  expect(result.css).toContain('color:red');
});
it('preserves switch lexical bindings', async () => {
  const result = await compile(
    `import {css} from ${JSON.stringify(api)};export function select(n,other){switch(n){case 0:const css=other;return css.dynamic({width:2})}}`,
  );
  expect(result.module.select(0, { dynamic: (value: unknown) => value })).toEqual({ width: 2 });
});

it('evaluates switch discriminants outside the case lexical scope', async () => {
  const result = await compile(
    `import {css} from ${JSON.stringify(api)};export function select(width,other){switch(css.dynamic({width}).class){default:const css=other;return css.dynamic({width:2})}}`,
  );
  expect(result.module.select(5, { dynamic: (value: unknown) => value })).toEqual({ width: 2 });
  expect(result.css).toContain('width:var(--pfui-local-');
});

it('compiles css.dynamic with the pfui namespace', async () => {
  const result = await compile(
    `import {css} from ${JSON.stringify(api)};export function layout(width){return css.dynamic({width})}`,
  );
  const props = result.module.layout(80);
  expect(props.class).toMatch(/^pfui_/);
  expect(Object.keys(props.style)[0]).toMatch(/^--pfui-local-/);
  expect(result.css).toContain('@layer utilities');
});
it('emits slot relationships and animation frames in the actual CSS asset', async () => {
  const result = await compile(`import {sva} from ${JSON.stringify(api)};
    const control=sva({slots:['input','indicator'],base:{input:{'&:checked + $indicator':{color:'red'}},indicator:{'@keyframes pfui-test-spin':{to:{transform:'rotate(360deg)'}},animation:'pfui-test-spin 800ms linear infinite'}}});
    export const parts=()=>control();`);
  const parts = result.module.parts();
  const marker = parts.indicator.split(' ').find((name: string) => name.startsWith('pfui-sva-'));
  expect(result.css).toContain(`:checked + .${marker}`);
  expect(result.css).toContain('@keyframes pfui-test-spin');
  expect(result.css.indexOf('@layer reset,native,base,tokens,recipes,utilities;')).toBeLessThan(
    result.css.indexOf('@layer recipes{'),
  );
  expect(result.css).toContain('transform:rotate(360deg)');
  expect(parts.indicator).not.toContain('transform');
});
it('bridges configured semantic themes to public Fluent variables used by components', async () => {
  const { fluentPreset } = await import('../config/fluent-preset');
  const { resolveConfig } = await import('../config/resolve-config');
  const { generateThemeCss } = await import('../compiler/tokens');
  const css = generateThemeCss(
    resolveConfig({
      presets: [fluentPreset],
      themes: {
        custom: { semanticTokens: { colors: { text: { value: 'purple' } } } },
      },
    }),
  );
  expect(css).toContain('--color-text:var(--pfui-colors-text)');
  expect(css).toContain('--color-border:var(--pfui-colors-border)');
});

it('generates a self-contained Fluent theme with system, explicit and forced color modes', async () => {
  const { fluentPreset } = await import('../config/fluent-preset');
  const { resolveConfig } = await import('../config/resolve-config');
  const { generateThemeCss } = await import('../compiler/tokens');
  const css = generateThemeCss(resolveConfig({ presets: [fluentPreset] }));
  const declarations = new Set([...css.matchAll(/(--[\w-]+):/g)].map((match) => match[1]));
  for (const match of css.matchAll(/var\((--[\w-]+)\)/g)) {
    expect(declarations.has(match[1]), `Undefined variable ${match[1]}`).toBe(true);
  }
  expect(css).toContain('@media (prefers-color-scheme: dark)');
  expect(css).toContain('@media (forced-colors: active)');
  expect(css).toContain('color-scheme:light');
  expect(css).toContain('color-scheme:dark');
  expect(css).toContain('[data-color-mode="light"]');
  expect(css).toContain('[data-color-mode="dark"]');
  expect(css).toContain('--font-body:var(--pfui-fonts-body)');
  expect(css).toContain('--shadow-card:var(--pfui-shadows-card)');
  expect(css).toContain('--color-primary:var(--color-accent)');
  expect(css).toContain('--code-color-comment:var(--color-text-subtle)');
  expect(css).not.toContain('--space-1:var(--space-1)');
  expect(css).toContain(
    '@scope ([data-color-mode]){:scope{--pfui-colors-canvas:var(--pfui-systemColors-canvas)',
  );
});

it('loads the unified CSS entry with configurable reset/native and token-aware global styles', async () => {
  const result = await compile(`import './styled-system/styles.css';export const ready=true;`);
  expect(result.css).toContain('@layer tokens');
  expect(result.css).toContain('--pfui-colors-accent:red');
  expect(result.css).not.toContain('@layer reset{');
  expect(result.css).not.toContain('@layer native{');
});
