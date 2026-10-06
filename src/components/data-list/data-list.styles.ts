import { sva } from '../../styling';
export const dataListClasses = sva({
  slots: ['list', 'item', 'label', 'value'],
  base: {
    list: {
      display: 'grid',
      gap: 'var(--space-4)',
      minWidth: '0',
      margin: '0',
      fontFamily: 'var(--font-body)',
      fontSynthesis: 'none',
      fontSize: 'var(--type-body)',
      lineHeight: '20px',
      color: 'var(--color-text)',
      '&[hidden]': {
        display: 'none',
      },
    },
    item: {
      display: 'grid',
      gridColumn: '1 / -1',
      gridTemplateColumns: 'subgrid',
      gap: 'var(--space-2) var(--space-4)',
      minWidth: '0',
      '&[hidden]': {
        display: 'none',
      },
    },
    label: {
      minWidth: '0',
      margin: '0',
      overflowWrap: 'anywhere',
      color: 'var(--color-text-muted)',
      '&[hidden]': {
        display: 'none',
      },
    },
    value: {
      minWidth: '0',
      margin: '0',
      overflowWrap: 'anywhere',
      '&[hidden]': {
        display: 'none',
      },
    },
  },
  variants: {
    direction: {
      horizontal: {
        list: {
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)',
          '@media (max-width: 600px)': {
            gridTemplateColumns: 'minmax(0, 1fr)',
          },
        },
      },
      vertical: {
        list: {
          gridTemplateColumns: 'minmax(0, 1fr)',
        },
      },
    },
  },
  defaultVariants: {
    direction: 'horizontal',
  },
});
export default dataListClasses();
