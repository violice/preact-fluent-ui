import { sva } from '../../styling';
export const paginationClasses = sva({
  slots: ['pagination', 'indicator'],
  base: {
    pagination: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 'var(--space-2)',
      minWidth: '0',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--type-body)',
      lineHeight: '20px',
      color: 'var(--color-text)',
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
export default paginationClasses();
