import { sva } from '../../styles';
export const paginationClasses = sva({
  slots: ['pagination', 'indicator'],
  base: {
    pagination: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 'var(--pfui-spacing-2)',
      minWidth: '0',
      fontFamily: 'var(--pfui-fonts-body)',
      fontSize: 'var(--pfui-fontSizes-body)',
      lineHeight: '20px',
      color: 'var(--pfui-colors-text)',
      '&[hidden]': {
        display: 'none',
      },
    },
    indicator: {
      overflowWrap: 'anywhere',
      fontVariantNumeric: 'tabular-nums',
    },
  },
});
export const paginationStyles = paginationClasses();
