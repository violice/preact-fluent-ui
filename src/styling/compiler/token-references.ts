import { flattenTokens } from '../config/resolve-config.ts';
import type { ResolvedConfig } from '../config/types.ts';
import { variableName } from '../shared/token-name.ts';
export function tokenReferences(config: ResolvedConfig): Record<string, string> {
  return Object.fromEntries(
    Object.keys({
      ...flattenTokens(config.theme.tokens),
      ...flattenTokens(config.theme.semanticTokens),
    }).map((path) => [path, `var(${variableName(path)})`]),
  );
}
