import { describe, expect, it } from 'vitest';
import { readSettings, settingsUrl, themeOverrides, themeTokenBlocks } from './gallery-settings';

describe('gallery settings', () => {
  it('restores a shared custom theme and CSS preset without losing unrelated URL parts', () => {
    const settings = readSettings(
      new URL(
        'https://example.org/gallery/?direction=rtl&preset=minimal&theme=dark&palette=custom&accent=%23008080&primary=%23663399&other=keep#forms',
      ),
    );
    expect(settings).toEqual({
      direction: 'rtl',
      preset: 'minimal',
      theme: 'dark',
      palette: 'custom',
      accent: '#008080',
      primary: '#663399',
    });
    const url = settingsUrl(new URL('https://example.org/gallery/?other=keep#forms'), settings);
    expect(url.searchParams.get('other')).toBe('keep');
    expect(url.hash).toBe('#forms');
    expect(readSettings(url)).toEqual(settings);
  });
  it('rejects unknown presets and colors rather than interpolating URL input into CSS', () => {
    const settings = readSettings(
      new URL(
        'https://example.org/?direction=other&preset=other&theme=other&palette=other&accent=red;}body{display:none}&primary=bad',
      ),
    );
    expect(settings).toEqual({
      direction: 'ltr',
      preset: 'full',
      theme: 'system',
      palette: 'standard',
      accent: '#0969c6',
      primary: '#0969c6',
    });
  });
  it('keeps forced colors last after explicit theme and custom color overrides', () => {
    const settings = readSettings(
      new URL('https://example.org/?theme=dark&palette=custom&accent=%23ffffff&primary=%23000000'),
    );
    const css = themeOverrides(settings, false);
    expect(css).toContain('color-scheme: dark');
    expect(css).toContain('--color-canvas: #1c1d20');
    expect(css).toContain('--color-on-accent: #000000');
    expect(css).toContain('--color-on-primary: #ffffff');
    expect(css.lastIndexOf('--color-primary: Highlight')).toBeGreaterThan(
      css.indexOf('--color-primary: #000000'),
    );
  });
});

it('preserves CSS declarations when joining minified theme blocks', () => {
  const [light, dark] = themeTokenBlocks(
    ':root{--space-8:32px}@media(prefers-color-scheme:dark){:root{--color-accent:#008080}}@media(forced-colors:active){:root{--color-accent:Highlight}}',
  );
  const style = document.createElement('style');
  style.textContent = `:root { ${light}\n${dark}\n--color-primary: #663399; }`;
  document.head.append(style);
  const declarations = (style.sheet!.cssRules[0] as CSSStyleRule).style;
  expect(declarations.getPropertyValue('--space-8')).toBe('32px');
  expect(declarations.getPropertyValue('--color-accent')).toBe('#008080');
  style.remove();
});

it('keeps interaction shades on the same side of the contrast threshold', () => {
  const settings = readSettings(
    new URL('https://example.org/?palette=custom&accent=%23777777&primary=%23333333'),
  );
  const css = themeOverrides(settings, false);
  expect(css).toContain('--color-accent-hover: color-mix(in srgb, #777777, white 12%)');
  expect(css).toContain('--color-accent-pressed: color-mix(in srgb, #777777, white 20%)');
  expect(css).toContain('--color-primary-hover: color-mix(in srgb, #333333, black 12%)');
  expect(css).toContain('--color-primary-pressed: color-mix(in srgb, #333333, black 20%)');
});
it('ignores additional engine variable roots while reading legacy theme blocks', () => {
  expect(
    themeTokenBlocks(
      ':root{--color-text:black} @media(dark){:root{--color-text:white}} @media(forced){:root{--color-text:CanvasText}} :root{--pfui-colors-text:var(--color-text)}',
    ),
  ).toHaveLength(3);
});

it('reads generated token aliases as concrete light, dark and forced color values', () => {
  const blocks = themeTokenBlocks(
    ':root{color-scheme:light;--pfui-palette-white:#fff;--pfui-palette-black:#000;--pfui-colors-text:var(--pfui-palette-black);--color-text:var(--pfui-colors-text)}@media(dark){:root{color-scheme:dark;--pfui-colors-text:var(--pfui-palette-white);--color-text:var(--pfui-colors-text)}}@media(forced){:root{--pfui-colors-text:CanvasText;--color-text:var(--pfui-colors-text)}}',
  );
  expect(blocks[0]).toContain('--color-text: #000;');
  expect(blocks[1]).toContain('--color-text: #fff;');
  expect(blocks[2]).toContain('--color-text: CanvasText;');
  expect(blocks[2]).not.toContain('color-scheme:');
  expect(blocks[2]).not.toContain('--pfui-palette-white:');
});

it('preserves public token dependencies for gallery palette overrides', () => {
  const [light] = themeTokenBlocks(
    ':root{--pfui-colors-text-subtle:#616b7b;--color-text-subtle:var(--pfui-colors-text-subtle);--code-color-comment:var(--color-text-subtle)}@media(dark){:root{--color-text-subtle:white}}@media(forced){:root{--color-text-subtle:CanvasText}}',
  );
  expect(light).toContain('--color-text-subtle: #616b7b;');
  expect(light).toContain('--code-color-comment: var(--color-text-subtle);');
});
