import { cva } from '../../styling';
export const separatorClasses = cva({
  base: {
    boxSizing: 'border-box',
    flexShrink: '0',
    border: '0 solid var(--color-border)',
    '&[hidden]': {
      display: 'none',
    },
    '@media (forced-colors: active)': {
      borderColor: 'CanvasText',
    },
  },
  variants: {
    orientation: {
      horizontal: {
        inlineSize: '100%',
        blockSize: '1px',
        borderBlockStartWidth: '1px',
      },
      vertical: {
        alignSelf: 'stretch',
        inlineSize: '1px',
        borderInlineStartWidth: '1px',
      },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});
