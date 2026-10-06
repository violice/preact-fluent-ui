import { sva } from '../../styling';
export const pageHeaderClasses = sva({
  slots: ['header', 'actions', 'notices'],
  base: {
    header: {
      boxSizing: 'border-box',
      minWidth: '0',
      color: 'var(--color-text)',
      overflowWrap: 'anywhere',
      fontFamily: 'var(--font-body)',
      fontSynthesis: 'none',
      fontSize: 'var(--type-body)',
      lineHeight: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      marginBottom: '24px',
      '& h1': {
        margin: '0 0 6px',
        fontSize: 'var(--type-title)',
        fontWeight: '600',
        lineHeight: '36px',
        letterSpacing: '-0.5px',
      },
      '& p': {
        margin: '0',
        color: 'var(--color-text-muted)',
      },
      '@media (max-width: 540px)': {
        alignItems: 'flex-start',
        flexDirection: 'column',
      },
      '&[hidden]': {
        display: 'none',
      },
    },
    actions: {
      flex: 'none',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '8px',
    },
    notices: {
      display: 'grid',
      gap: '12px',
      marginBottom: '20px',
      '&:empty': {
        display: 'none',
      },
    },
  },
});
export default pageHeaderClasses();
