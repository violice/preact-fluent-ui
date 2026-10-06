import { cva } from '../styling';
export const badgeClasses = cva({
  base: {
    boxSizing: 'border-box',
    overflowWrap: 'anywhere',
    fontFamily: 'var(--font-body)',
    fontSynthesis: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    maxWidth: '100%',
    minHeight: '24px',
    padding: '3px 8px',
    border: '1px solid var(--fui-colors-border)',
    borderRadius: '20px',
    color: 'var(--fui-colors-text-muted)',
    background: 'var(--fui-colors-surface-muted)',
    fontSize: '12px',
    fontWeight: '500',
    lineHeight: '16px',
    textAlign: 'center',
    '&::before': {
      content: "''",
      flex: 'none',
      width: '5px',
      height: '5px',
      borderRadius: '50%',
      background: 'currentColor',
    },
    '@media (forced-colors: active)': { borderColor: 'CanvasText' },
    '&[hidden]': { display: 'none' },
  },
  variants: {
    tone: {
      neutral: {},
      success: {
        color: 'var(--fui-colors-success)',
        background: 'var(--fui-colors-success-bg)',
        borderColor: 'transparent',
      },
      warning: {
        color: 'var(--fui-colors-warning)',
        background: 'var(--fui-colors-warning-bg)',
        borderColor: 'transparent',
      },
      error: {
        color: 'var(--fui-colors-danger)',
        background: 'var(--fui-colors-danger-bg)',
        borderColor: 'transparent',
      },
    },
  },
  defaultVariants: { tone: 'neutral' },
});
