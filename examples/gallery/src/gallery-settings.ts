import themeCss from '../../../dist/theme.css?inline';
import greenCss from './green-theme.css?inline';

export type GallerySettings = {
  direction: 'ltr' | 'rtl';
  preset: 'full' | 'minimal';
  theme: 'system' | 'light' | 'dark';
  palette: 'standard' | 'green' | 'custom';
  accent: string;
  primary: string;
};
export const defaultSettings: GallerySettings = {
  direction: 'ltr',
  preset: 'full',
  theme: 'system',
  palette: 'standard',
  accent: '#0969c6',
  primary: '#0969c6',
};

export function readSettings(url: URL): GallerySettings {
  const params = url.searchParams;
  const oneOf = <T extends string>(name: string, values: readonly T[], fallback: T): T => {
    const value = params.get(name);
    return values.includes(value as T) ? (value as T) : fallback;
  };
  const color = (name: 'accent' | 'primary') => {
    const value = params.get(name);
    return value && /^#[\da-f]{6}$/i.test(value) ? value.toLowerCase() : defaultSettings[name];
  };
  return {
    direction: oneOf('direction', ['ltr', 'rtl'], 'ltr'),
    preset: oneOf('preset', ['full', 'minimal'], 'full'),
    theme: oneOf('theme', ['system', 'light', 'dark'], 'system'),
    palette: oneOf('palette', ['standard', 'green', 'custom'], 'standard'),
    accent: color('accent'),
    primary: color('primary'),
  };
}
export function settingsUrl(url: URL, settings: GallerySettings): URL {
  const next = new URL(url);
  for (const key of Object.keys(defaultSettings) as (keyof GallerySettings)[]) {
    if (settings[key] === defaultSettings[key]) next.searchParams.delete(key);
    else next.searchParams.set(key, settings[key]);
  }
  return next;
}

// Read tokens from the actual showcased package, including on the published gallery.
export function themeTokenBlocks(css: string) {
  const blocks = [...css.matchAll(/:root\s*\{([^{}]*)\}/g)]
    .filter((match) => /--(?!pfui-)[\w-]+\s*:/.test(match[1]))
    .map((match) => match[1].trim().replace(/;*$/, ';'));
  if (blocks.length !== 3) throw new Error('Expected light, dark and forced-colors theme tokens');
  if (!/--pfui-[\w-]+\s*:/.test(blocks[0])) return blocks;
  const declarations = new Map<string, string>();
  return blocks.map((block) => {
    const names = new Set<string>();
    for (const declaration of block.split(';')) {
      const colon = declaration.indexOf(':');
      if (colon < 0) continue;
      const name = declaration.slice(0, colon).trim();
      names.add(name);
      declarations.set(name, declaration.slice(colon + 1).trim());
    }
    function resolve(value: string, visited = new Set<string>()): string {
      return value.replace(/var\((--[\w-]+)\)/g, (reference, name: string) => {
        if (!name.startsWith('--pfui-')) return reference;
        if (visited.has(name)) throw new Error(`Theme variable cycle: ${name}`);
        const target = declarations.get(name);
        return target === undefined ? reference : resolve(target, new Set([...visited, name]));
      });
    }
    return [...names].map((name) => `${name}: ${resolve(declarations.get(name)!)};`).join('\n');
  });
}
const [light, dark, forced] = themeTokenBlocks(themeCss);
const [greenLight, greenDark] = themeTokenBlocks(greenCss);
function foreground(color: string) {
  const [r, g, b] = color
    .slice(1)
    .match(/../g)!
    .map((hex) => {
      const channel = parseInt(hex, 16) / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.179 ? '#000000' : '#ffffff';
}
export function themeOverrides(settings: GallerySettings, systemDark: boolean): string {
  const isDark = settings.theme === 'dark' || (settings.theme === 'system' && systemDark);
  let tokens = isDark ? `${light}\n${dark}` : light;
  if (settings.palette === 'green') tokens += `\n${isDark ? greenDark : greenLight}`;
  if (settings.palette === 'custom') {
    for (const name of ['accent', 'primary'] as const) {
      const color = settings[name];
      const text = foreground(color);
      const shade = text === '#000000' ? 'white' : 'black';
      tokens += `\n--color-${name}: ${color};
        --color-${name}-hover: color-mix(in srgb, ${color}, ${shade} 12%);
        --color-${name}-pressed: color-mix(in srgb, ${color}, ${shade} 20%);
        --color-on-${name}: ${text};`;
    }
    tokens +=
      '\n--color-accent-subtle: color-mix(in srgb, var(--color-accent) 15%, var(--color-card));';
  }
  return `:root { ${tokens} }\n@media (forced-colors: active) { :root { ${forced} } }`;
}
