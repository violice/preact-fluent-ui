import { signal } from '@preact/signals';
import { describe, expect, it } from 'vitest';
import { resolveClass } from '../index';

describe('resolveClass', () => {
  it('preserves an explicitly empty primary class', () => {
    expect(resolveClass('', 'fallback')).toBe('');
  });

  it('falls back only for nullish primary values', () => {
    expect(resolveClass(undefined, 'fallback')).toBe('fallback');
    expect(resolveClass(null as unknown as undefined, 'fallback')).toBe('fallback');
    expect(resolveClass(undefined, undefined)).toBeUndefined();
  });

  it('resolves current Signalish values', () => {
    const primary = signal<string | undefined>('primary');
    const fallback = signal('fallback');
    expect(resolveClass(primary, fallback)).toBe('primary');
    primary.value = undefined;
    expect(resolveClass(primary, fallback)).toBe('fallback');
    primary.value = '';
    expect(resolveClass(primary, fallback)).toBe('');
  });
});
