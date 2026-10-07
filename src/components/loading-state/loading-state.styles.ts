import { sva } from '../../styles';
export const loadingStateClasses = sva({
  slots: ['loading', 'label', 'content', 'spinner'],
  base: {
    loading: {
      boxSizing: 'border-box',
      minInlineSize: '0',
      overflowWrap: 'anywhere',
      fontFamily: 'var(--pfui-fonts-body)',
      fontSynthesis: 'none',
      fontSize: 'var(--pfui-fontSizes-body)',
      lineHeight: '20px',
      display: 'grid',
      gap: '12px',
      color: 'var(--pfui-colors-text-muted)',
      '&[hidden]': {
        display: 'none',
      },
    },
    label: {
      minInlineSize: '0',
      fontSize: '18px',
      fontWeight: '600',
      color: 'var(--pfui-colors-text)',
    },
    content: {
      minInlineSize: '0',
      display: 'grid',
      gap: '12px',
      '& p': {
        margin: '0',
        maxInlineSize: '440px',
      },
    },
    spinner: {},
  },
  variants: {
    appearance: {
      default: {
        loading: {
          justifyItems: 'center',
          padding: '48px 24px',
          border: '1px solid var(--pfui-colors-border)',
          borderRadius: 'var(--pfui-radii-md)',
          background: 'var(--pfui-colors-card)',
          textAlign: 'center',
        },
      },
      inline: {
        loading: {
          gridTemplateColumns: 'auto minmax(0, 1fr)',
          alignItems: 'center',
          gap: '8px',
        },
        spinner: {
          gridColumn: '1',
          gridRow: '1',
        },
        label: {
          gridColumn: '2',
          fontSize: 'var(--pfui-fontSizes-body)',
        },
        content: {
          gridColumn: '2',
          gap: '8px',
        },
      },
    },
  },
  defaultVariants: {
    appearance: 'default',
  },
});
