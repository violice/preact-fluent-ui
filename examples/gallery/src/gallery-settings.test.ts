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
