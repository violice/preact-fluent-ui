// @vitest-environment node
import { expect, it } from 'vitest';
import { resolveConfig } from '../config/resolve-config';
import { fluentPreset } from '../config/fluent-preset';
import { generateStylesCss } from './global-styles';
import { compileStyles } from './atomic';
import { compileRecipe } from './recipes';
import { createCva } from '../runtime/recipe-runtime';
import { cx } from '../runtime/cx';

it('includes optional layers only when enabled and normalizes global selectors and conditions', () => {
  const config = resolveConfig({
    presets: [fluentPreset],
    globalStyles: {
      body: { color: 'text', padding: 4, '& a': { color: 'accent', _hover: { opacity: 0.5 } } },
      '@media print': { body: { backgroundColor: 'white' } },
    },
  });
  const css = generateStylesCss(
    config,
    '@layer reset{body{margin:0}}',
    '@layer native{input{border:0}}',
  );
  expect(css).toContain('@layer reset{body{margin:0}}');
  expect(css).toContain('@layer native{input{border:0}}');
  expect(css).toContain('body{color:var(--pfui-colors-text)}');
  expect(css).toContain('body{padding-top:4px}');
  expect(css).toContain('body a:hover{opacity:0.5}');
  expect(css).toContain('@media print{body{background-color:white}}');
  for (const flags of [
    { reset: false, native: true },
    { reset: true, native: false },
    { reset: false, native: false },
  ]) {
    const output = generateStylesCss(
      { ...config, ...flags },
      '@layer reset{body{margin:0}}',
      '@layer native{input{border:0}}',
    );
    expect(output.includes('@layer reset{')).toBe(flags.reset);
    expect(output.includes('@layer native{')).toBe(flags.native);
    expect(output).toContain('@layer base{');
    expect(output).toContain('@layer tokens{');
  }
});

it('keeps recipe and utility classes separate so utility layer precedence survives composition', () => {
  const recipe = compileRecipe({ base: { color: 'red' } });
  const recipeClass = createCva(recipe.definition as Parameters<typeof createCva>[0])();
  const utility = compileStyles({ color: 'blue' });
  expect(recipe.css).toContain('@layer recipes{');
  expect(utility.css).toContain('@layer utilities{');
  for (const classes of [cx(recipeClass, utility.className), cx(utility.className, recipeClass)]) {
    expect(classes.split(' ')).toContain(recipeClass);
    expect(classes.split(' ')).toContain(utility.className);
  }
});

it('applies nested conditions to every selector in a global selector list', () => {
  const css = generateStylesCss(
    resolveConfig({
      globalStyles: {
        'h1, h2': { _hover: { color: 'red' } },
        body: { '& a, & button': { _hover: { color: 'blue' } } },
      },
    }),
  );
  expect(css).toContain(':is(h1, h2):hover{color:red}');
  expect(css).toContain(':is(body a, body button):hover{color:blue}');
});
