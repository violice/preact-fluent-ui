import { sva } from '../../styles';
export const spinnerClasses = sva({
  slots: ['spinner', 'indicator', 'label'],
  base: {
    spinner: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      minInlineSize: '0',
      fontFamily: 'var(--pfui-fonts-body)',
      fontSynthesis: 'none',
      fontSize: 'var(--pfui-fontSizes-body)',
      lineHeight: '20px',
      verticalAlign: 'middle',
      '&[hidden]': {
        display: 'none',
      },
    },
    indicator: {
      boxSizing: 'border-box',
      display: 'inline-block',
      flex: 'none',
      border: '2px solid var(--pfui-colors-border)',
      borderBlockStartColor: 'currentColor',
      borderRadius: '50%',
      animation: 'pfui-spin 0.8s linear infinite',
      '@media (prefers-reduced-motion: reduce)': {
        animation: 'none',
      },
      '@media (forced-colors: active)': {
        forcedColorAdjust: 'none',
        borderColor: 'GrayText',
        borderBlockStartColor: 'CanvasText',
      },
      '@keyframes pfui-spin': {
        to: {
          transform: 'rotate(360deg)',
        },
      },
    },
    label: {
      minInlineSize: '0',
      overflowWrap: 'anywhere',
    },
  },
  variants: {
    size: {
      small: {
        indicator: {
          inlineSize: '16px',
          blockSize: '16px',
        },
      },
      medium: {
        indicator: {
          inlineSize: '24px',
          blockSize: '24px',
        },
      },
      large: {
        indicator: {
          inlineSize: '32px',
          blockSize: '32px',
        },
      },
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});
