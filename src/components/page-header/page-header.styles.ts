import { sva } from '../../styles';
export const pageHeaderClasses = sva({
  slots: ['header', 'actions', 'notices', 'title', 'description'],
  base: {
    header: {
      boxSizing: 'border-box',
      minWidth: '0',
      color: 'var(--pfui-colors-text)',
      overflowWrap: 'anywhere',
      fontFamily: 'var(--pfui-fonts-body)',
      fontSynthesis: 'none',
      fontSize: 'var(--pfui-fontSizes-body)',
      lineHeight: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      marginBottom: '24px',
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
    title: {
      margin: '0 0 6px',
      fontSize: 'var(--pfui-fontSizes-title)',
      fontWeight: '600',
      lineHeight: '36px',
      letterSpacing: '-0.5px',
    },
    description: {
      margin: '0',
      color: 'var(--pfui-colors-text-muted)',
    },
  },
});
export const pageHeaderStyles = pageHeaderClasses();
