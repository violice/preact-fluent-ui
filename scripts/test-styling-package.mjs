import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const root = process.cwd();
const run = (cmd, args, cwd = root) => {
  if (cmd === 'npm' && process.env.npm_execpath) {
    args = [process.env.npm_execpath, ...args];
    cmd = process.execPath;
  }
  return execFileSync(cmd, args, { cwd, encoding: 'utf8', env: { ...process.env, NODE_PATH: '' } });
};
const temporary = await mkdtemp(join(tmpdir(), 'fluent-styling-'));
try {
  const packed = JSON.parse(run('npm', ['pack', '--json', '--pack-destination', temporary]));
  const { filename } = Array.isArray(packed) ? packed[0] : Object.values(packed)[0];
  const lock = JSON.parse(await readFile(join(root, 'package-lock.json'), 'utf8'));
  const dependencies = Object.fromEntries(
    [
      'preact',
      'vite',
      '@wyw-in-js/vite',
      '@wyw-in-js/processor-utils',
      'oxc-parser',
      'magic-string',
      'typescript',
    ].map((name) => [name, lock.packages[`node_modules/${name}`].version]),
  );
  dependencies['@violice/preact-fluent-ui'] = join(temporary, filename);
  await writeFile(
    join(temporary, 'package.json'),
    JSON.stringify({ type: 'module', dependencies }),
  );
  run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], temporary);
  await writeFile(
    join(temporary, 'entry.ts'),
    `import {css,cva,sva,cx,token} from './styled-system/css';
 export const color=token.var('colors.accent');
 const base=css({color:'accent',gap:8});
 const button=cva({variants:{size:{sm:{height:24},lg:{height:48}}},defaultVariants:{size:'sm'}});
 const slots=sva({slots:['root','label'],variants:{invalid:{true:{label:{color:'red'}}}}});
 export function render(width:number){const props=css.props({width,padding:width/2});return {...props,class:cx(base,props.class,button({size:'lg'})),slots:slots({invalid:true})}}`,
  );
  await writeFile(
    join(temporary, 'fluent.config.ts'),
    `import {defineConfig} from '@violice/preact-fluent-ui/config';export default defineConfig({theme:{tokens:{colors:{accent:{value:'red'}}}}});`,
  );
  await writeFile(
    join(temporary, 'build.mjs'),
    `import {build} from 'vite'; import {fluentStyles} from '@violice/preact-fluent-ui/vite';
 await build({configFile:false,logLevel:'silent',plugins:fluentStyles({configFile:'./fluent.config.ts'}),build:{minify:false,cssMinify:false,lib:{entry:'entry.ts',formats:['es'],fileName:'entry'}}});`,
  );
  run(process.execPath, ['build.mjs'], temporary);
  const built = await import(pathToFileURL(join(temporary, 'dist/entry.js')).href);
  const props = built.render(80);
  assert(Object.values(props.style).includes('80px'));
  assert(Object.values(props.style).includes('40px'));
  assert.equal(built.color, 'var(--fui-colors-accent)');
  assert(props.slots.label);
  const css = await readFile(
    join(temporary, 'dist/fluent-styling.css').replace('fluent-styling.css', 'style.css'),
    'utf8',
  ).catch(async () => {
    const { readdir } = await import('node:fs/promises');
    const file = (await readdir(join(temporary, 'dist'))).find((file) => file.endsWith('.css'));
    return readFile(join(temporary, 'dist', file), 'utf8');
  });
  assert(css.includes('width:var(--fui-local-'));
  assert(css.includes('height:48px'));
  await writeFile(
    join(temporary, 'contracts.ts'),
    `import {cva,sva,type RecipeVariant,type RecipeVariantProps} from '@violice/preact-fluent-ui/styling';
 import {token} from './styled-system/css';
 const recipe=cva({variants:{size:{sm:{height:24},lg:{height:48}},disabled:{true:{opacity:0.5}}}});
 const variant:RecipeVariant<typeof recipe>={size:'sm',disabled:false};
 const props:RecipeVariantProps<typeof recipe>={size:null};
 // @ts-expect-error invalid variant
 recipe({size:'xl'});
 // @ts-expect-error unknown token
 token.var('colors.missing');
 const slots=sva({slots:['root','label'],base:{root:{color:'red'}}});slots().label;
 // @ts-expect-error unknown slot
 slots().missing;
 void variant;void props;`,
  );
  run(
    process.execPath,
    [
      join(temporary, 'node_modules/typescript/bin/tsc'),
      '--noEmit',
      '--module',
      'esnext',
      '--moduleResolution',
      'bundler',
      '--target',
      'es2022',
      '--skipLibCheck',
      'contracts.ts',
      'entry.ts',
    ],
    temporary,
  );
  const js = await readFile(join(temporary, 'dist/entry.js'), 'utf8');
  assert(!/wyw-in-js|oxc-parser|magic-string|node:fs/.test(js));
  const firstTheme = await readFile(join(temporary, 'styled-system/theme.css'), 'utf8');
  assert(firstTheme.includes('--fui-colors-accent:red'));
  await writeFile(
    join(temporary, 'fluent.config.ts'),
    `export default {theme:{tokens:{colors:{accent:{value:'blue'}}}}};`,
  );
  run(process.execPath, ['build.mjs'], temporary);
  const secondTheme = await readFile(join(temporary, 'styled-system/theme.css'), 'utf8');
  assert(secondTheme.includes('--fui-colors-accent:blue'));
  assert(!secondTheme.includes('--fui-colors-accent:red'));
  console.log(
    'Packed styling consumer: extraction, css.props, recipes, generated token types and browser isolation passed.',
  );
} finally {
  await rm(temporary, { recursive: true, force: true });
}
