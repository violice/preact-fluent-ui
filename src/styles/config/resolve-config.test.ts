import { fluentPreset } from './fluent-preset';
import { expect, it } from 'vitest';
import { resolveConfig } from './resolve-config';
import { tokenReferences, generateThemeCss } from '../compiler/tokens';
const preset = {
  theme: {
    tokens: {
      colors: { red: { value: 'red' }, blue: { value: 'blue' } },
      spacing: { 4: { value: '16px' } },
    },
    semanticTokens: { colors: { accent: { value: '{colors.red}' } } },
  },
};
it('deeply extends presets but replaces directly declared categories', () => {
  const extended = resolveConfig({
    presets: [preset],
    theme: { extend: { tokens: { colors: { red: { value: '#f00' } } } } },
  });
  expect(extended.theme.tokens.colors.blue.value).toBe('blue');
  expect(extended.theme.tokens.colors.red.value).toBe('#f00');
  const replaced = resolveConfig({
    presets: [preset],
    theme: { tokens: { colors: { green: { value: 'green' } } }, semanticTokens: { colors: {} } },
  });
  expect(replaced.theme.tokens.colors.red).toBeUndefined();
});
it('resolves aliases and rejects unknown references and cycles', () => {
  const config = resolveConfig({ presets: [preset] });
  expect(tokenReferences(config)['colors.accent']).toBe('var(--pfui-colors-accent)');
  expect(generateThemeCss(config)).toContain('--pfui-colors-accent:var(--pfui-colors-red)');
  expect(() =>
    resolveConfig({ theme: { tokens: { colors: { x: { value: '{colors.y}' } } } } }),
  ).toThrow(/colors.y/);
  expect(() =>
    resolveConfig({
      theme: { tokens: { colors: { x: { value: '{colors.y}' }, y: { value: '{colors.x}' } } } },
    }),
  ).toThrow(/cycle/i);
});
it('supports partial brand overrides and rejects unknown brand paths', () => {
  const config = resolveConfig({
    presets: [preset],
    themes: { green: { tokens: { colors: { red: { value: 'green' } } } } },
  });
  expect(generateThemeCss(config)).toContain('[data-pfui-theme="green"]');
  expect(generateThemeCss(config)).toContain('--pfui-colors-blue:blue');
  expect(() =>
    resolveConfig({
      presets: [preset],
      themes: { x: { tokens: { colors: { nope: { value: 'red' } } } } },
    }),
  ).toThrow(/nope/);
});
it('emits mode scopes including same-element roots and nested brand values', () => {
  const config = resolveConfig({
    theme: {
      tokens: { colors: { white: { value: 'white' }, black: { value: 'black' } } },
      semanticTokens: {
        colors: { surface: { value: { base: '{colors.white}', _dark: '{colors.black}' } } },
      },
    },
    themes: { green: { tokens: { colors: { black: { value: '#123' } } } } },
  });
  const css = generateThemeCss(config);
  expect(css).toContain('@scope ([data-color-mode="dark"]) to ([data-color-mode="light"])');
  expect(css).toContain(':scope[data-pfui-theme="green"]');
  expect(css).toContain('--pfui-colors-surface:var(--pfui-colors-black)');
});

it('uses scope roots for custom parent semantic conditions', () => {
  const css = generateThemeCss(
    resolveConfig({
      conditions: { contrast: '[data-contrast="more"] &' },
      theme: {
        semanticTokens: { colors: { surface: { value: { base: 'white', _contrast: 'black' } } } },
      },
    }),
  );
  expect(css).toContain('@scope ([data-contrast="more"]){:scope{');
  expect(css).not.toContain('[data-contrast="more"] :root');
});

it('inherits reset/native switches and merges global styles with config overrides', () => {
  const config = resolveConfig({
    presets: [
      { reset: true, native: true, globalStyles: { body: { margin: 0, color: 'red' } } },
      { presets: [{}] },
    ],
    reset: false,
    globalStyles: { body: { color: 'blue' } },
  });
  expect(config.reset).toBe(false);
  expect(config.native).toBe(true);
  expect(config.globalStyles).toEqual({ body: { margin: 0, color: 'blue' } });
});

it('emits only engine token variables without legacy aliases', () => {
  const config = resolveConfig({ presets: [fluentPreset] });
  const css = generateThemeCss(config);
  expect(css).not.toMatch(/--(?:color|font|type|weight|shadow|radius|space|code-color)-/);
  expect(tokenReferences(config)['spacing.4']).toBe('var(--pfui-spacing-4)');
});
