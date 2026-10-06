import { cva, css } from '../styling';
export const infoBarClasses = cva({
  base: {
    boxSizing: 'border-box',
    fontFamily: 'var(--font-body)',
    fontSynthesis: 'none',
    display: 'grid',
    gap: 'var(--space-1)',
    padding: '10px var(--space-3)',
    border: '1px solid var(--fui-colors-border)',
    borderLeft: '3px solid var(--fui-colors-accent)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--fui-colors-text)',
    background: 'var(--fui-colors-info-bg)',
    fontSize: '13px',
    lineHeight: '18px',
    '@media (forced-colors: active)': { border: '1px solid CanvasText', borderLeftWidth: '3px' },
    '&[hidden]': { display: 'none' },
  },
  variants: {
    tone: {
      info: {},
      success: {
        borderLeftColor: 'var(--fui-colors-success)',
        background: 'var(--fui-colors-success-bg)',
      },
      warning: {
        borderLeftColor: 'var(--fui-colors-warning)',
        background: 'var(--fui-colors-warning-bg)',
      },
      error: {
        borderLeftColor: 'var(--fui-colors-danger)',
        background: 'var(--fui-colors-danger-bg)',
      },
    },
  },
  defaultVariants: { tone: 'info' },
});
export const titleClass = css({ fontWeight: '650' });
export const contentClass = css({
  minWidth: '0',
  overflowWrap: 'anywhere',
  '& p': { margin: '0' },
  '& pre': { whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' },
});
