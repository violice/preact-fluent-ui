import { css, cva } from '../../styles';
export const toolbarClass = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  minWidth: '0',
  maxWidth: '100%',
  gap: 'var(--pfui-spacing-3)',
  overflowWrap: 'anywhere',
  fontFamily: 'var(--pfui-fonts-body)',
  fontSize: 'var(--pfui-fontSizes-body)',
  lineHeight: '20px',
  color: 'var(--pfui-colors-text)',
  '&[hidden]': {
    display: 'none',
  },
});
export const toolbarGroupClass = cva({
  base: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    minWidth: '0',
    maxWidth: '100%',
    gap: 'var(--pfui-spacing-3)',
    overflowWrap: 'anywhere',
    '& > *': {
      minWidth: '0',
      maxWidth: '100%',
    },
    '&[hidden]': {
      display: 'none',
    },
  },
  variants: {
    align: {
      start: {},
      end: {
        marginInlineStart: 'auto',
      },
    },
  },
  defaultVariants: {
    align: 'start',
  },
});
