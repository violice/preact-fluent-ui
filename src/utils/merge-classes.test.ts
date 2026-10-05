import { signal } from '@preact/signals';
import { describe, expect, it } from 'vitest';
import { mergeClasses } from '../index';

describe('mergeClasses', () => {
  it('merges ordered classes and skips empty values', () => {
    const value = signal('second');
    expect(mergeClasses('first', undefined, '', value, 'third')).toBe('first second third');
    value.value = 'updated';
    expect(mergeClasses('first', value)).toBe('first updated');
  });
});
