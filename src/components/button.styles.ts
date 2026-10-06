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
    border: '1px solid var(--fui-colors-control-border)',
    borderBottomColor: 'var(--fui-colors-control-bottom)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--fui-colors-text)',
    background: 'var(--fui-colors-control)',
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
    '&:hover:not(:disabled):not([data-fui-loading])': {
      background: 'var(--fui-colors-control-hover)',
    },
    '&:active:not(:disabled):not([data-fui-loading])': {
      background: 'var(--fui-colors-control-pressed)',
      borderBottomColor: 'var(--fui-colors-control-border)',
      boxShadow: 'none',
    },
    '&:disabled': {
      color: 'var(--fui-colors-disabled)',
      background: 'var(--fui-colors-surface-muted)',
      borderColor: 'var(--fui-colors-border)',
      boxShadow: 'none',
      cursor: 'not-allowed',
    },
    '@media (forced-colors: active)': {
      '&:disabled': { color: 'GrayText', background: 'Canvas', borderColor: 'GrayText' },
      '&:hover:not(:disabled):not([data-fui-loading])': {
        outline: '1px solid Highlight',
        outlineOffset: '-3px',
      },
    },
    '&:focus-visible': { outline: '2px solid var(--fui-colors-focus)', outlineOffset: '2px' },
    '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
    '&[hidden]': { display: 'none' },
  },
  variants: {
    variant: {
      default: {},
      primary: {
        color: 'var(--fui-colors-on-primary)',
        background: 'var(--fui-colors-primary)',
        borderColor: 'var(--fui-colors-primary)',
        borderBottomColor: 'var(--fui-colors-primary-pressed)',
        boxShadow: 'var(--shadow-primary)',
        '&:hover:not(:disabled):not([data-fui-loading])': {
          background: 'var(--fui-colors-primary-hover)',
          borderColor: 'var(--fui-colors-primary-hover)',
        },
        '&:active:not(:disabled):not([data-fui-loading])': {
          background: 'var(--fui-colors-primary-pressed)',
          borderColor: 'var(--fui-colors-primary-pressed)',
        },
        '&:disabled': {
          color: 'var(--fui-colors-disabled)',
          background: 'var(--fui-colors-surface-muted)',
          borderColor: 'var(--fui-colors-border)',
          boxShadow: 'none',
        },
        '@media (forced-colors: active)': {
          '&:not(:disabled)': {
            forcedColorAdjust: 'none',
            color: 'HighlightText',
            background: 'Highlight',
            borderColor: 'Highlight',
          },
          '&:hover:not(:disabled):not([data-fui-loading])': {
            forcedColorAdjust: 'none',
            color: 'HighlightText',
            background: 'Highlight',
            borderColor: 'Highlight',
          },
          '&:active:not(:disabled):not([data-fui-loading])': {
            forcedColorAdjust: 'none',
            color: 'HighlightText',
            background: 'Highlight',
            borderColor: 'Highlight',
          },
        },
      },
      subtle: {
        color: 'var(--fui-colors-text)',
        background: 'transparent',
        borderColor: 'transparent',
        boxShadow: 'none',
        '&:hover:not(:disabled):not([data-fui-loading])': {
          background: 'var(--fui-colors-surface-hover)',
        },
        '&:active:not(:disabled):not([data-fui-loading])': {
          background: 'var(--fui-colors-surface-pressed)',
        },
        '@media (forced-colors: active)': { '&:not(:disabled)': { borderColor: 'ButtonText' } },
      },
      danger: {
        color: 'var(--fui-colors-danger)',
        '&:hover:not(:disabled):not([data-fui-loading])': {
          color: 'var(--fui-colors-danger)',
          background: 'var(--fui-colors-danger-bg)',
          borderColor: 'var(--fui-colors-danger)',
        },
        '&:active:not(:disabled):not([data-fui-loading])': {
          background: 'var(--fui-colors-surface-pressed)',
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
