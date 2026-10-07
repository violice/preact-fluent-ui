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
  const css = generateStylesCss(config);
  expect(css).toContain('@layer reset{');
  expect(css).toContain('body{margin:0;');
  expect(css).toContain('@layer native{');
  expect(css).toContain('min-height:36px');
  expect(css).toContain('body{color:var(--pfui-colors-text)}');
  expect(css).toContain('body{padding-top:4px}');
  expect(css).toContain('body a:hover{opacity:0.5}');
  expect(css).toContain('@media print{body{background-color:white}}');
  for (const flags of [
    { reset: false, native: true },
    { reset: true, native: false },
    { reset: false, native: false },
  ]) {
    const output = generateStylesCss({ ...config, ...flags });
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

it('generates native interaction, accessibility and media rules without external CSS input', () => {
  const css = generateStylesCss(resolveConfig({ presets: [fluentPreset] }));
  expect(css).toContain(
    ':hover:where(:not(:disabled)){background:var(--pfui-colors-control-hover);',
  );
  expect(css).toContain(':focus-visible{outline:2px solid var(--pfui-colors-focus);');
  expect(css).toContain(':disabled{color:var(--pfui-colors-disabled);');
  expect(css).toContain(
    ':where(input, textarea)::placeholder{color:var(--pfui-colors-text-subtle);opacity:1;}',
  );
  expect(css).toContain("[aria-invalid='true']{border-bottom-color:var(--pfui-colors-danger);}");
  expect(css).toContain('@media (prefers-reduced-motion: reduce){');
  expect(css).toContain('transition:none');
  expect(css).toContain('@media (forced-colors: active){');
  expect(css).toContain('color:FieldText');
  expect(css).toContain('outline-color:Highlight');
  expect(css).toContain("[aria-invalid='true']{border-bottom-style:dashed;}");
});

it('preserves document shorthands that reset background images and border images', () => {
  const css = generateStylesCss(resolveConfig({ presets: [fluentPreset] }));
  expect(css).toContain('background:var(--pfui-colors-canvas)');
  expect(css).toContain('background:var(--pfui-colors-control)');
  expect(css).toContain('border:1px solid var(--pfui-colors-control-border)');
});
