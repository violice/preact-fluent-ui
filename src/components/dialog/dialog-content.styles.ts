import { sva, css } from '../../styling';
const dialogHeaderClasses = sva({
  slots: ['header', 'title', 'description'],
  base: {
    header: {
      boxSizing: 'border-box',
      overflowWrap: 'anywhere',
      font: 'var(--type-body) / 1.5 var(--font-body)',
      marginBottom: 'var(--space-4)',
    },
    title: {
      margin: '0',
      fontFamily: 'var(--font-display)',
      fontSize: '20px',
      lineHeight: '1.3',
      fontWeight: 'var(--weight-semibold)',
    },
    description: {
      margin: 'var(--space-2) 0 0',
      color: 'var(--color-text-muted)',
    },
  },
});
export const dialogHeaderStyles = dialogHeaderClasses();
export const dialogBodyClass = css({
  boxSizing: 'border-box',
  overflowWrap: 'anywhere',
  font: 'var(--type-body) / 1.5 var(--font-body)',
  display: 'grid',
  gap: 'var(--space-3)',
  '& p': {
    margin: '0',
  },
  '&[hidden]': {
    display: 'none',
  },
});
export const dialogFooterClass = css({
  boxSizing: 'border-box',
  overflowWrap: 'anywhere',
  font: 'var(--type-body) / 1.5 var(--font-body)',
  display: 'flex',
  justifyContent: 'flex-end',
  flexWrap: 'wrap',
  gap: 'var(--space-2)',
  marginTop: 'var(--space-6)',
  '&[hidden]': {
    display: 'none',
  },
});
