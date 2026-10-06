import { cva } from '../../styling';
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
    border: '1px solid var(--color-control-border)',
    borderBottomColor: 'var(--color-control-bottom)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--color-text)',
    background: 'var(--color-control)',
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
      background: 'var(--color-control-hover)',
    },
    '&:active:not(:disabled):not([data-pfui-loading])': {
      background: 'var(--color-control-pressed)',
      borderBottomColor: 'var(--color-control-border)',
      boxShadow: 'none',
    },
    '&:disabled': {
      color: 'var(--color-disabled)',
      background: 'var(--color-surface-muted)',
      borderColor: 'var(--color-border)',
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
    '&:focus-visible': { outline: '2px solid var(--color-focus)', outlineOffset: '2px' },
    '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
    '&[hidden]': { display: 'none' },
  },
  variants: {
    variant: {
      default: {},
      primary: {
        color: 'var(--color-on-primary)',
        background: 'var(--color-primary)',
        borderColor: 'var(--color-primary)',
        borderBottomColor: 'var(--color-primary-pressed)',
        boxShadow: 'var(--shadow-primary)',
        '&:hover:not(:disabled):not([data-pfui-loading])': {
          background: 'var(--color-primary-hover)',
          borderColor: 'var(--color-primary-hover)',
        },
        '&:active:not(:disabled):not([data-pfui-loading])': {
          background: 'var(--color-primary-pressed)',
          borderColor: 'var(--color-primary-pressed)',
        },
        '&:disabled': {
          color: 'var(--color-disabled)',
          background: 'var(--color-surface-muted)',
          borderColor: 'var(--color-border)',
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
        color: 'var(--color-text)',
        background: 'transparent',
        borderColor: 'transparent',
        boxShadow: 'none',
        '&:hover:not(:disabled):not([data-pfui-loading])': {
          background: 'var(--color-surface-hover)',
        },
        '&:active:not(:disabled):not([data-pfui-loading])': {
          background: 'var(--color-surface-pressed)',
        },
        '@media (forced-colors: active)': { '&:not(:disabled)': { borderColor: 'ButtonText' } },
      },
      danger: {
        color: 'var(--color-danger)',
        '&:hover:not(:disabled):not([data-pfui-loading])': {
          color: 'var(--color-danger)',
          background: 'var(--color-danger-bg)',
          borderColor: 'var(--color-danger)',
        },
        '&:active:not(:disabled):not([data-pfui-loading])': {
          background: 'var(--color-surface-pressed)',
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
