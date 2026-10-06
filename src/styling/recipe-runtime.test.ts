import { expect, it } from 'vitest';
import { createCva, createSva } from './recipe-runtime';
it('resolves undefined defaults, null suppression and boolean branches before compounds', () => {
  const recipe = createCva({
    base: 'base',
    variants: { size: { sm: 'sm', lg: 'lg' }, disabled: { true: 'off', false: 'on' } },
    defaultVariants: { size: 'sm', disabled: false },
    compoundVariants: [{ size: ['sm', 'lg'], disabled: false, css: 'compound' }],
  });
  expect(recipe()).toBe('base sm on compound');
  expect(recipe({ size: undefined })).toBe('base sm on compound');
  expect(recipe({ size: null })).toBe('base on');
  expect(recipe({ disabled: true })).toBe('base sm off');
  expect(() => recipe({ size: 'typo' })).toThrow(/size/);
});
it('returns every slot without duplicating single-part selection semantics', () => {
  const recipe = createSva({
    slots: ['root', 'label'],
    base: { root: 'root' },
    variants: { invalid: { true: { label: 'error' } } },
    compoundVariants: [{ invalid: true, css: { root: 'danger' } }],
  });
  expect(recipe({ invalid: true })).toEqual({ root: 'root danger', label: 'error' });
  expect(recipe()).toEqual({ root: 'root', label: '' });
});
it('allows false for a boolean variant that declares only the true branch', () => {
  expect(
    createSva({ slots: ['root'], variants: { invalid: { true: { root: 'error' } } } })({
      invalid: false,
    }),
  ).toEqual({ root: '' });
});
