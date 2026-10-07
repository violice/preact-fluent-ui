import type { StyleObject } from '../../shared/types.ts';

export const fluentResetStyles = {
  '*, *::before, *::after': {
    boxSizing: 'border-box',
  },
  body: {
    margin: '0',
    font: 'var(--pfui-fontSizes-body) / 1.5 var(--pfui-fonts-body)',
    fontSynthesis: 'none',
    color: 'var(--pfui-colors-text)',
    background: 'var(--pfui-colors-canvas)',
  },
  'button, input, select, textarea': {
    font: 'inherit',
  },
  ':where(h1, h2, h3, h4, h5, h6, p)': {
    margin: '0',
    font: 'inherit',
  },
  'code, pre': {
    fontFamily: 'var(--pfui-fonts-mono)',
    fontVariantNumeric: 'tabular-nums',
  },
  '::selection': {
    color: 'var(--pfui-colors-on-accent)',
    background: 'var(--pfui-colors-accent)',
  },
} satisfies Record<string, StyleObject>;
