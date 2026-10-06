import { sva } from '../../styling';
export const infoBarClasses = sva({
  slots: ['root', 'title', 'content'],
  base: {
    root: {
      boxSizing: 'border-box',
      fontFamily: 'var(--font-body)',
      fontSynthesis: 'none',
      display: 'grid',
      gap: 'var(--space-1)',
      padding: '10px var(--space-3)',
      border: '1px solid var(--color-border)',
      borderLeft: '3px solid var(--color-accent)',
      borderRadius: 'var(--radius-sm)',
      color: 'var(--color-text)',
      background: 'var(--color-info-bg)',
      fontSize: '13px',
      lineHeight: '18px',
      '@media (forced-colors: active)': { border: '1px solid CanvasText', borderLeftWidth: '3px' },
      '&[hidden]': { display: 'none' },
    },
    title: { fontWeight: '650' },
    content: {
      minWidth: '0',
      overflowWrap: 'anywhere',
      '& p': { margin: '0' },
      '& pre': { whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' },
    },
  },
  variants: {
    tone: {
      info: {},
      success: {
        root: {
          borderLeftColor: 'var(--color-success)',
          background: 'var(--color-success-bg)',
        },
      },
      warning: {
        root: {
          borderLeftColor: 'var(--color-warning)',
          background: 'var(--color-warning-bg)',
        },
      },
      error: {
        root: {
          borderLeftColor: 'var(--color-danger)',
          background: 'var(--color-danger-bg)',
        },
      },
    },
  },
  defaultVariants: { tone: 'info' },
});
