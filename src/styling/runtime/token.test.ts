import { expect, it } from 'vitest';
import { fluentPreset } from '../config/fluent-preset';
import { resolveConfig } from '../config/resolve-config';
import { tokenReferences } from '../compiler/token-references';
import { token } from './token';

it('resolves every default public token to the same CSS variable as the compiler', () => {
  const references = tokenReferences(resolveConfig({ presets: [fluentPreset] }));
  for (const [path, reference] of Object.entries(references)) {
    if (/^(spacing|colors|fonts|radii)\./.test(path)) {
      expect(token.var(path as Parameters<typeof token.var>[0])).toBe(reference);
    }
  }
});

it('rejects unknown default tokens instead of emitting an undefined reference', () => {
  expect(() => token.var('colors.missing' as Parameters<typeof token.var>[0])).toThrow(
    'Unknown token: colors.missing',
  );
});
