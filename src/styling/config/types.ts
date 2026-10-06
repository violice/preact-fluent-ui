export interface TokenLeaf {
  value: string | number | Record<string, string | number>;
  description?: string;
}
export interface TokenTree {
  [key: string]: TokenTree | TokenLeaf;
}
export interface ThemeDefinition {
  tokens?: Record<string, TokenTree>;
  semanticTokens?: Record<string, TokenTree>;
}
export interface StylingConfig {
  presets?: readonly StylingConfig[];
  conditions?: Record<string, string>;
  theme?: ThemeDefinition & { extend?: ThemeDefinition };
  themes?: Record<string, ThemeDefinition>;
}
export interface ResolvedConfig {
  theme: { tokens: Record<string, TokenTree>; semanticTokens: Record<string, TokenTree> };
  themes: Record<string, ThemeDefinition>;
  conditions: Record<string, string>;
}
