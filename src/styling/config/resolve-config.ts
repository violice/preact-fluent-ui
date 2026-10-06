import type {
  ResolvedConfig,
  StylingConfig,
  ThemeDefinition,
  TokenLeaf,
  TokenTree,
} from './types.ts';
export function flattenTokens(
  tree: Record<string, TokenTree>,
  prefix = '',
): Record<string, TokenLeaf> {
  const output: Record<string, TokenLeaf> = {};
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if ('value' in value) output[path] = value as unknown as TokenLeaf;
    else Object.assign(output, flattenTokens(value as Record<string, TokenTree>, path));
  }
  return output;
}
function merge<T>(base: T, override: T): T {
  const output = { ...base };
  for (const [key, value] of Object.entries(override as object)) {
    const current = (output as Record<string, unknown>)[key];
    (output as Record<string, unknown>)[key] =
      value && typeof value === 'object' && !Array.isArray(value) && !('value' in value)
        ? merge((current ?? {}) as object, value)
        : value;
  }
  return output;
}
export function themeWithOverrides(
  config: ResolvedConfig,
  override: ThemeDefinition,
): ResolvedConfig['theme'] {
  return {
    tokens: merge(config.theme.tokens, override.tokens ?? {}),
    semanticTokens: merge(config.theme.semanticTokens, override.semanticTokens ?? {}),
  };
}
function validate(theme: ResolvedConfig['theme'], conditions: Record<string, string>): void {
  const leaves = { ...flattenTokens(theme.tokens), ...flattenTokens(theme.semanticTokens) };
  const visiting = new Set<string>();
  const visited = new Set<string>();
  function visit(path: string): void {
    if (visiting.has(path))
      throw new Error(`Token alias cycle: ${[...visiting, path].join(' -> ')}`);
    if (visited.has(path)) return;
    const leaf = leaves[path];
    if (!leaf) throw new Error(`Unknown token reference: ${path}`);
    visiting.add(path);
    const values =
      typeof leaf.value === 'object' ? Object.entries(leaf.value) : [['base', leaf.value]];
    for (const [condition, value] of values) {
      if (condition !== 'base' && condition !== '_dark' && condition !== '_light') {
        const selector = conditions[String(condition).slice(1)];
        if (!selector || (!selector.startsWith('@') && !selector.endsWith(' &')))
          throw new Error(`Semantic condition must be a parent selector or at-rule: ${condition}`);
      }
      for (const match of String(value).matchAll(/\{([\w.-]+)\}/g)) visit(match[1]);
    }
    if (typeof leaf.value === 'object' && !('base' in leaf.value))
      throw new Error(`Conditional token requires base: ${path}`);
    visiting.delete(path);
    visited.add(path);
  }
  Object.keys(leaves).forEach(visit);
}
export function resolveConfig(input: StylingConfig = {}): ResolvedConfig {
  const result: ResolvedConfig = {
    theme: { tokens: {}, semanticTokens: {} },
    themes: {},
    conditions: {},
  };
  for (const preset of input.presets ?? []) {
    const resolved = resolveConfig(preset);
    result.theme = themeWithOverrides(result, resolved.theme);
    result.conditions = { ...result.conditions, ...resolved.conditions };
    result.themes = { ...result.themes, ...resolved.themes };
  }
  result.conditions = { ...result.conditions, ...input.conditions };
  for (const key of ['tokens', 'semanticTokens'] as const)
    Object.assign(result.theme[key], input.theme?.[key]);
  result.theme = themeWithOverrides(result, input.theme?.extend ?? {});
  result.themes = { ...result.themes, ...input.themes };
  validate(result.theme, result.conditions);
  const paths = new Set(
    Object.keys({
      ...flattenTokens(result.theme.tokens),
      ...flattenTokens(result.theme.semanticTokens),
    }),
  );
  for (const [name, theme] of Object.entries(result.themes)) {
    for (const path of Object.keys({
      ...flattenTokens(theme.tokens ?? {}),
      ...flattenTokens(theme.semanticTokens ?? {}),
    })) {
      if (!paths.has(path)) throw new Error(`Theme ${name} overrides unknown token: ${path}`);
    }
    validate(themeWithOverrides(result, theme), result.conditions);
  }
  return result;
}
