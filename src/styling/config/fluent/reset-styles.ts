import type { StyleObject } from '../../shared/types.ts';

export const fluentResetStyles = {
  '*, *::before, *::after': {
    boxSizing: 'border-box',
  },
  body: {
    margin: '0',
    font: 'var(--type-body) / 1.5 var(--font-body)',
    fontSynthesis: 'none',
    color: 'var(--color-text)',
    background: 'var(--color-canvas)',
  },
  'button, input, select, textarea': {
    font: 'inherit',
  },
  ':where(h1, h2, h3, h4, h5, h6, p)': {
    margin: '0',
    font: 'inherit',
  },
  'code, pre': {
    fontFamily: 'var(--font-mono)',
    fontVariantNumeric: 'tabular-nums',
  },
  '::selection': {
    color: 'var(--color-on-accent)',
    background: 'var(--color-accent)',
  },
} satisfies Record<string, StyleObject>;
