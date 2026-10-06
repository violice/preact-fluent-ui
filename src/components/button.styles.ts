import { cva } from '../styling';
export const buttonClasses = cva({
  base: {
    boxSizing: 'border-box',
    fontFamily: 'var(--font-body)',
    fontSynthesis: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-2)',
    minHeight: '36px',
    padding: '7px 14px',
    border: '1px solid var(--pfui-colors-control-border)',
    borderBottomColor: 'var(--pfui-colors-control-bottom)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--pfui-colors-text)',
    background: 'var(--pfui-colors-control)',
    fontSize: 'var(--type-body)',
    lineHeight: '20px',
    fontWeight: 'var(--weight-semibold)',
    textAlign: 'center',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    boxShadow: 'var(--shadow-control)',
    transition:
      'background-color 100ms ease,border-color 100ms ease,color 100ms ease,box-shadow 100ms ease',
    '&:hover:not(:disabled):not([data-pfui-loading])': {
      background: 'var(--pfui-colors-control-hover)',
    },
    '&:active:not(:disabled):not([data-pfui-loading])': {
      background: 'var(--pfui-colors-control-pressed)',
      borderBottomColor: 'var(--pfui-colors-control-border)',
      boxShadow: 'none',
    },
    '&:disabled': {
      color: 'var(--pfui-colors-disabled)',
      background: 'var(--pfui-colors-surface-muted)',
      borderColor: 'var(--pfui-colors-border)',
      boxShadow: 'none',
      cursor: 'not-allowed',
    },
    '@media (forced-colors: active)': {
      '&:disabled': { color: 'GrayText', background: 'Canvas', borderColor: 'GrayText' },
      '&:hover:not(:disabled):not([data-pfui-loading])': {
        outline: '1px solid Highlight',
        outlineOffset: '-3px',
      },
    },
    '&:focus-visible': { outline: '2px solid var(--pfui-colors-focus)', outlineOffset: '2px' },
    '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
    '&[hidden]': { display: 'none' },
  },
  variants: {
    variant: {
      default: {},
      primary: {
        color: 'var(--pfui-colors-on-primary)',
        background: 'var(--pfui-colors-primary)',
        borderColor: 'var(--pfui-colors-primary)',
        borderBottomColor: 'var(--pfui-colors-primary-pressed)',
        boxShadow: 'var(--shadow-primary)',
        '&:hover:not(:disabled):not([data-pfui-loading])': {
          background: 'var(--pfui-colors-primary-hover)',
          borderColor: 'var(--pfui-colors-primary-hover)',
        },
        '&:active:not(:disabled):not([data-pfui-loading])': {
          background: 'var(--pfui-colors-primary-pressed)',
          borderColor: 'var(--pfui-colors-primary-pressed)',
        },
        '&:disabled': {
          color: 'var(--pfui-colors-disabled)',
          background: 'var(--pfui-colors-surface-muted)',
          borderColor: 'var(--pfui-colors-border)',
          boxShadow: 'none',
        },
        '@media (forced-colors: active)': {
          '&:not(:disabled)': {
            forcedColorAdjust: 'none',
            color: 'HighlightText',
            background: 'Highlight',
            borderColor: 'Highlight',
          },
          '&:hover:not(:disabled):not([data-pfui-loading])': {
            forcedColorAdjust: 'none',
            color: 'HighlightText',
            background: 'Highlight',
            borderColor: 'Highlight',
          },
          '&:active:not(:disabled):not([data-pfui-loading])': {
            forcedColorAdjust: 'none',
            color: 'HighlightText',
            background: 'Highlight',
            borderColor: 'Highlight',
          },
        },
      },
      subtle: {
        color: 'var(--pfui-colors-text)',
        background: 'transparent',
        borderColor: 'transparent',
        boxShadow: 'none',
        '&:hover:not(:disabled):not([data-pfui-loading])': {
          background: 'var(--pfui-colors-surface-hover)',
        },
        '&:active:not(:disabled):not([data-pfui-loading])': {
          background: 'var(--pfui-colors-surface-pressed)',
        },
        '@media (forced-colors: active)': { '&:not(:disabled)': { borderColor: 'ButtonText' } },
      },
      danger: {
        color: 'var(--pfui-colors-danger)',
        '&:hover:not(:disabled):not([data-pfui-loading])': {
          color: 'var(--pfui-colors-danger)',
          background: 'var(--pfui-colors-danger-bg)',
          borderColor: 'var(--pfui-colors-danger)',
        },
        '&:active:not(:disabled):not([data-pfui-loading])': {
          background: 'var(--pfui-colors-surface-pressed)',
        },
      },
    },
    size: {
      default: {},
      compact: { minHeight: '32px', padding: '5px 10px', fontSize: '13px' },
      icon: { width: '34px', minHeight: '34px', padding: '8px' },
    },
    loading: { true: { cursor: 'progress' }, false: {} },
  },
  defaultVariants: { variant: 'default', size: 'default', loading: false },
});
