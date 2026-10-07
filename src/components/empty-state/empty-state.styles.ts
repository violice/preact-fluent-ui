import { sva } from '../../styles';
export const emptyStateClasses = sva({
  slots: ['empty', 'content', 'title'],
  base: {
    empty: {
      boxSizing: 'border-box',
      overflowWrap: 'anywhere',
      fontFamily: 'var(--pfui-fonts-body)',
      fontSynthesis: 'none',
      fontSize: 'var(--pfui-fontSizes-body)',
      lineHeight: '20px',
      display: 'grid',
      justifyItems: 'center',
      gap: '12px',
      padding: '48px 24px',
      border: '1px solid var(--pfui-colors-border)',
      borderRadius: 'var(--pfui-radii-md)',
      background: 'var(--pfui-colors-card)',
      textAlign: 'center',
      color: 'var(--pfui-colors-text-muted)',
      '&[hidden]': {
        display: 'none',
      },
    },
    content: {
      display: 'grid',
      justifyItems: 'center',
      gap: '12px',
      '& p': {
        margin: '0',
        maxWidth: '440px',
      },
    },
    title: {
      margin: '0',
      fontSize: '18px',
      fontWeight: '600',
      color: 'var(--pfui-colors-text)',
    },
  },
});
export const emptyStateStyles = emptyStateClasses();
