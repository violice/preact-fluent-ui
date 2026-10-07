import type { StyleObject } from '../../shared/types.ts';

const nativeControl =
  ":where(input:not([type='checkbox'], [type='radio'], [type='range'], [type='color'], [type='hidden'], [type='button'], [type='submit'], [type='reset']), select, textarea)";

export const fluentNativeStyles = {
  [nativeControl]: {
    boxSizing: 'border-box',
    font: 'var(--type-body) / 20px var(--font-body)',
    minHeight: '36px',
    padding: '7px 12px',
    color: 'var(--color-text)',
    background: 'var(--color-control)',
    border: '1px solid var(--color-control-border)',
    borderBottomColor: 'var(--color-control-bottom)',
    borderRadius: 'var(--radius-sm)',
    transition: 'background-color 120ms ease, border-color 120ms ease, box-shadow 120ms ease',
  },
  [`${nativeControl}:hover:where(:not(:disabled))`]: {
    background: 'var(--color-control-hover)',
    borderBottomColor: 'var(--color-text-subtle)',
  },
  [`${nativeControl}:focus-visible`]: {
    outline: '2px solid var(--color-focus)',
    outlineOffset: '2px',
    borderBottomColor: 'var(--color-accent)',
  },
  [`${nativeControl}:disabled`]: {
    color: 'var(--color-disabled)',
    background: 'var(--color-surface-muted)',
    borderColor: 'var(--color-border)',
  },
  ':where(input, textarea)::placeholder': {
    color: 'var(--color-text-subtle)',
    opacity: '1',
  },
  [`${nativeControl}[aria-invalid='true']`]: {
    borderBottomColor: 'var(--color-danger)',
  },
  '@media (prefers-reduced-motion: reduce)': {
    [nativeControl]: {
      transition: 'none',
    },
  },
  '@media (forced-colors: active)': {
    [nativeControl]: {
      color: 'FieldText',
      background: 'Field',
      borderColor: 'FieldText',
    },
    [`${nativeControl}:disabled`]: {
      color: 'GrayText',
      borderColor: 'GrayText',
    },
    [`${nativeControl}:focus-visible`]: {
      outlineColor: 'Highlight',
    },
    [`${nativeControl}[aria-invalid='true']`]: {
      borderBottomStyle: 'dashed',
    },
  },
} satisfies Record<string, StyleObject>;
