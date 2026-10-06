import { sva } from '../styling';
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
      border: '1px solid var(--pfui-colors-border)',
      borderLeft: '3px solid var(--pfui-colors-accent)',
      borderRadius: 'var(--radius-sm)',
      color: 'var(--pfui-colors-text)',
      background: 'var(--pfui-colors-info-bg)',
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
          borderLeftColor: 'var(--pfui-colors-success)',
          background: 'var(--pfui-colors-success-bg)',
        },
      },
      warning: {
        root: {
          borderLeftColor: 'var(--pfui-colors-warning)',
          background: 'var(--pfui-colors-warning-bg)',
        },
      },
      error: {
        root: {
          borderLeftColor: 'var(--pfui-colors-danger)',
          background: 'var(--pfui-colors-danger-bg)',
        },
      },
    },
  },
  defaultVariants: { tone: 'info' },
});
