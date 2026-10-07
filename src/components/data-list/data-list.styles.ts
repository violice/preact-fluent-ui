import { css, cva } from '../../styles';
export const dataListClass = cva({
  base: {
    display: 'grid',
    gap: 'var(--pfui-spacing-4)',
    minWidth: '0',
    margin: '0',
    fontFamily: 'var(--pfui-fonts-body)',
    fontSynthesis: 'none',
    fontSize: 'var(--pfui-fontSizes-body)',
    lineHeight: '20px',
    color: 'var(--pfui-colors-text)',
    '&[hidden]': {
      display: 'none',
    },
  },
  variants: {
    direction: {
      horizontal: {
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)',
        '@media (max-width: 600px)': {
          gridTemplateColumns: 'minmax(0, 1fr)',
        },
      },
      vertical: {
        gridTemplateColumns: 'minmax(0, 1fr)',
      },
    },
  },
  defaultVariants: {
    direction: 'horizontal',
  },
});
export const dataListItemClass = css({
  display: 'grid',
  gridColumn: '1 / -1',
  gridTemplateColumns: 'subgrid',
  gap: 'var(--pfui-spacing-2) var(--pfui-spacing-4)',
  minWidth: '0',
  '&[hidden]': {
    display: 'none',
  },
});
export const dataListLabelClass = css({
  minWidth: '0',
  margin: '0',
  overflowWrap: 'anywhere',
  color: 'var(--pfui-colors-text-muted)',
  '&[hidden]': {
    display: 'none',
  },
});
export const dataListValueClass = css({
  minWidth: '0',
  margin: '0',
  overflowWrap: 'anywhere',
  '&[hidden]': {
    display: 'none',
  },
});
