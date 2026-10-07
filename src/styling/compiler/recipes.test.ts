// @vitest-environment node
import { expect, it } from 'vitest';
import { compileRecipe } from './recipes';
import { compileStyles } from './atomic';
import { createSva } from '../runtime/recipe-runtime';
it('provides stable slot markers for sibling and ancestor selectors', () => {
  const definition = {
    slots: ['root', 'input', 'indicator'],
    base: {
      input: { '&:checked + $indicator': { color: 'red' } },
      indicator: { '$root[hidden] &': { display: 'none' } },
    },
  };
  const result = compileRecipe(definition, {}, true);
  const styles = createSva(result.definition as Parameters<typeof createSva>[0])();
  const root = styles.root.split(' ').find((name) => name.startsWith('pfui-sva-'))!;
  const indicator = styles.indicator.split(' ').find((name) => name.startsWith('pfui-sva-'))!;
  expect(root).toBeTruthy();
  expect(indicator).toBeTruthy();
  expect(result.css).toContain(`:checked + .${indicator}`);
  expect(result.css).toContain(`.${root}[hidden]`);
  expect(compileRecipe(definition, {}, true)).toEqual(result);
  expect(() =>
    compileRecipe(
      { slots: ['root'], base: { root: { '& $missing': { color: 'red' } } } },
      {},
      true,
    ),
  ).toThrow(/missing/);
});
it('extracts keyframes without creating frame classes and validates frame selectors', () => {
  const result = compileStyles({
    '@keyframes pfui-spin': { to: { transform: 'rotate(360deg)' } },
    animation: 'pfui-spin 800ms linear infinite',
  });
  expect(result.css).toContain('@keyframes pfui-spin{to{transform:rotate(360deg)}}');
  expect(result.className).not.toContain('transform');
  expect(() => compileStyles({ '@keyframes pfui-spin': { '&:hover': { opacity: 0 } } })).toThrow(
    /frame/i,
  );
});

it('rejects scoped keyframes rather than hoisting them out of conditions', () => {
  expect(() =>
    compileStyles({ '@media print': { '@keyframes scoped-spin': { to: { opacity: 0 } } } }),
  ).toThrow(/top level/);
});
it('allows a named animation to change across compiler generations for HMR', () => {
  compileStyles({ '@keyframes pfui-hmr-spin': { to: { opacity: 0 } } });
  expect(compileStyles({ '@keyframes pfui-hmr-spin': { to: { opacity: 1 } } }).css).toContain(
    'opacity:1',
  );
});
