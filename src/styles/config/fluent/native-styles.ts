import type { StyleObject } from '../../shared/types.ts';

const nativeControl =
  ":where(input:not([type='checkbox'], [type='radio'], [type='range'], [type='color'], [type='hidden'], [type='button'], [type='submit'], [type='reset']), select, textarea)";

export const fluentNativeStyles = {
  [nativeControl]: {
    boxSizing: 'border-box',
    font: 'var(--pfui-fontSizes-body) / 20px var(--pfui-fonts-body)',
    minHeight: '36px',
    padding: '7px 12px',
    color: 'var(--pfui-colors-text)',
    background: 'var(--pfui-colors-control)',
    border: '1px solid var(--pfui-colors-control-border)',
    borderBottomColor: 'var(--pfui-colors-control-bottom)',
    borderRadius: 'var(--pfui-radii-sm)',
    transition: 'background-color 120ms ease, border-color 120ms ease, box-shadow 120ms ease',
  },
  [`${nativeControl}:hover:where(:not(:disabled))`]: {
    background: 'var(--pfui-colors-control-hover)',
    borderBottomColor: 'var(--pfui-colors-text-subtle)',
  },
  [`${nativeControl}:focus-visible`]: {
    outline: '2px solid var(--pfui-colors-focus)',
    outlineOffset: '2px',
    borderBottomColor: 'var(--pfui-colors-accent)',
  },
  [`${nativeControl}:disabled`]: {
    color: 'var(--pfui-colors-disabled)',
    background: 'var(--pfui-colors-surface-muted)',
    borderColor: 'var(--pfui-colors-border)',
  },
  ':where(input, textarea)::placeholder': {
    color: 'var(--pfui-colors-text-subtle)',
    opacity: '1',
  },
  [`${nativeControl}[aria-invalid='true']`]: {
    borderBottomColor: 'var(--pfui-colors-danger)',
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
