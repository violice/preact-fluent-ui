import type { StyleObject } from '../types.ts';
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
  reset?: boolean;
  native?: boolean;
  globalStyles?: Record<string, StyleObject>;
  presets?: readonly StylingConfig[];
  conditions?: Record<string, string>;
  theme?: ThemeDefinition & { extend?: ThemeDefinition };
  themes?: Record<string, ThemeDefinition>;
}
export interface ResolvedConfig {
  reset: boolean;
  native: boolean;
  globalStyles: Record<string, StyleObject>;
  theme: { tokens: Record<string, TokenTree>; semanticTokens: Record<string, TokenTree> };
  themes: Record<string, ThemeDefinition>;
  conditions: Record<string, string>;
}
