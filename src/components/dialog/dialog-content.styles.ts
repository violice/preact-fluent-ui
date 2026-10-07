import { sva, css } from '../../styles';
const dialogHeaderClasses = sva({
  slots: ['header', 'title', 'description'],
  base: {
    header: {
      boxSizing: 'border-box',
      overflowWrap: 'anywhere',
      font: 'var(--pfui-fontSizes-body) / 1.5 var(--pfui-fonts-body)',
      marginBottom: 'var(--pfui-spacing-4)',
    },
    title: {
      margin: '0',
      fontFamily: 'var(--pfui-fonts-display)',
      fontSize: '20px',
      lineHeight: '1.3',
      fontWeight: 'var(--pfui-fontWeights-semibold)',
    },
    description: {
      margin: 'var(--pfui-spacing-2) 0 0',
      color: 'var(--pfui-colors-text-muted)',
    },
  },
});
export const dialogHeaderStyles = dialogHeaderClasses();
export const dialogBodyClass = css({
  boxSizing: 'border-box',
  overflowWrap: 'anywhere',
  font: 'var(--pfui-fontSizes-body) / 1.5 var(--pfui-fonts-body)',
  display: 'grid',
  gap: 'var(--pfui-spacing-3)',
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
  font: 'var(--pfui-fontSizes-body) / 1.5 var(--pfui-fonts-body)',
  display: 'flex',
  justifyContent: 'flex-end',
  flexWrap: 'wrap',
  gap: 'var(--pfui-spacing-2)',
  marginTop: 'var(--pfui-spacing-6)',
  '&[hidden]': {
    display: 'none',
  },
});
