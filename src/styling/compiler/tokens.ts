import { fluentPreset } from '../config/fluent-preset.ts';
import { flattenTokens, themeWithOverrides } from '../config/resolve-config.ts';
import type { ResolvedConfig, TokenLeaf } from '../config/types.ts';
export function variableName(path: string): string {
  if (/^spacing\.(1|2|3|4|5|6|8)$/.test(path)) return `--space-${path.split('.')[1]}`;
  return `--pfui-${path.replaceAll('.', '-')}`;
}
export function tokenReferences(config: ResolvedConfig): Record<string, string> {
  return Object.fromEntries(
    Object.keys({
      ...flattenTokens(config.theme.tokens),
      ...flattenTokens(config.theme.semanticTokens),
    }).map((path) => [path, `var(${variableName(path)})`]),
  );
}
function valueCss(value: string | number): string {
  return String(value).replace(/\{([\w.-]+)\}/g, (_, path: string) => `var(${variableName(path)})`);
}
// Existing Fluent variables are the component contract. Theme overrides update both
// namespaces at the same scope; default aliases must not create a variable cycle.
const legacyVariables = Object.fromEntries(
  Object.entries({
    ...flattenTokens(fluentPreset.theme!.tokens!),
    ...flattenTokens(fluentPreset.theme!.semanticTokens!),
  }).flatMap(([path, leaf]) => {
    const match = typeof leaf.value === 'string' && /^var\((--[\w-]+)\)$/.exec(leaf.value);
    return match ? [[path, match[1]]] : [];
  }),
);
function declarations(leaves: Record<string, TokenLeaf>, mode = 'base'): string {
  return Object.entries(leaves)
    .map(([path, leaf]) => {
      const value =
        typeof leaf.value === 'object' ? (leaf.value[mode] ?? leaf.value.base) : leaf.value;
      const reference = legacyVariables[path];
      const bridge =
        reference && valueCss(value) !== `var(${reference})`
          ? `${reference}:var(${variableName(path)});`
          : '';
      return `${variableName(path)}:${valueCss(value)};${bridge}`;
    })
    .join('');
}
export function generateThemeCss(config: ResolvedConfig): string {
  const variants = [
    ['', config.theme],
    ...Object.entries(config.themes).map(
      ([name, override]) => [name, themeWithOverrides(config, override)] as const,
    ),
  ] as const;
  let css = '';
  for (const [name, theme] of variants) {
    const leaves = { ...flattenTokens(theme.tokens), ...flattenTokens(theme.semanticTokens) };
    const root = name ? `[data-pfui-theme="${name}"]` : ':root';
    css += `${root}{${declarations(leaves)}}`;
    for (const [mode, opposite] of [
      ['dark', 'light'],
      ['light', 'dark'],
    ]) {
      const selector = name
        ? `:scope[data-pfui-theme="${name}"], [data-pfui-theme="${name}"]`
        : ':scope';
      css += `@scope ([data-color-mode="${mode}"]) to ([data-color-mode="${opposite}"]){${selector}{${declarations(leaves, `_${mode}`)}}}`;
      if (name)
        css += `@scope ([data-pfui-theme="${name}"]) to ([data-pfui-theme]:not([data-pfui-theme="${name}"])){@scope ([data-color-mode="${mode}"]) to ([data-color-mode="${opposite}"]){:scope{${declarations(leaves, `_${mode}`)}}}}`;
    }
    for (const condition of new Set(
      Object.values(leaves)
        .flatMap((leaf) => (typeof leaf.value === 'object' ? Object.keys(leaf.value) : []))
        .filter((key) => !['base', '_dark', '_light'].includes(key)),
    )) {
      const scope = config.conditions[condition.slice(1)];
      const conditionalLeaves = Object.fromEntries(
        Object.entries(leaves).filter(
          ([, leaf]) => typeof leaf.value === 'object' && condition in leaf.value,
        ),
      );
      const values = declarations(conditionalLeaves, condition);
      const body = `${root}{${values}}`;
      if (scope.startsWith('@')) css += `${scope}{${body}}`;
      else {
        const boundary = scope.slice(0, -2).trim();
        const selector = name
          ? `:scope[data-pfui-theme="${name}"], [data-pfui-theme="${name}"]`
          : ':scope';
        css += `@scope (${boundary}){${selector}{${values}}}`;
        if (name)
          css += `@scope ([data-pfui-theme="${name}"]) to ([data-pfui-theme]:not([data-pfui-theme="${name}"])){@scope (${boundary}){:scope{${values}}}}`;
      }
    }
  }
  return css;
}
