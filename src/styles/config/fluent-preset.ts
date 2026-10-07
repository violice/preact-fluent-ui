import { definePreset } from './define-config.ts';
import { fluentTokens } from './fluent/tokens.ts';
import { fluentSemanticTokens } from './fluent/semantic-tokens.ts';

export const fluentPreset = definePreset({
  reset: true,
  native: true,
  conditions: { forcedColors: '@media (forced-colors: active)' },
  theme: { tokens: fluentTokens, semanticTokens: fluentSemanticTokens },
});
