import { sva } from '../../styling';
export const emptyStateClasses = sva({
  slots: ['empty', 'content'],
  base: {
    empty: {
      boxSizing: 'border-box',
      overflowWrap: 'anywhere',
      fontFamily: 'var(--font-body)',
      fontSynthesis: 'none',
      fontSize: 'var(--type-body)',
      lineHeight: '20px',
      display: 'grid',
      justifyItems: 'center',
      gap: '12px',
      padding: '48px 24px',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      background: 'var(--color-card)',
      textAlign: 'center',
      color: 'var(--color-text-muted)',
      '& h2': {
        margin: '0',
        fontSize: '18px',
        fontWeight: '600',
        color: 'var(--color-text)',
      },
      '& p': {
        margin: '0',
        maxWidth: '440px',
      },
      '&[hidden]': {
        display: 'none',
      },
    },
    content: {
      display: 'grid',
      justifyItems: 'center',
      gap: '12px',
    },
  },
});
export default emptyStateClasses();
