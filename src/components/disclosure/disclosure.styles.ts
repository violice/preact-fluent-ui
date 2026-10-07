import { sva } from '../../styles';
export const disclosureClasses = sva({
  slots: ['disclosure', 'summary', 'content'],
  base: {
    disclosure: {
      boxSizing: 'border-box',
      minInlineSize: '0',
      color: 'var(--pfui-colors-text)',
      '&[open] > $summary::before': {
        borderBlockStart: '6px solid currentColor',
        borderBlockEnd: '0 solid transparent',
        borderInline: '3px solid transparent',
      },
      '&[hidden]': {
        display: 'none',
      },
    },
    summary: {
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--pfui-spacing-2)',
      paddingBlock: 'var(--pfui-spacing-2)',
      font: 'var(--pfui-fontWeights-semibold) var(--pfui-fontSizes-body) / 20px var(--pfui-fonts-body)',
      cursor: 'pointer',
      listStyle: 'none',
      overflowWrap: 'anywhere',
      '&::-webkit-details-marker': {
        display: 'none',
      },
      '&::before': {
        content: "''",
        flex: '0 0 auto',
        inlineSize: '0',
        blockSize: '0',
        borderBlock: '3px solid transparent',
        borderInlineStart: '6px solid currentColor',
        borderInlineEnd: '0 solid transparent',
      },
      '&:focus-visible': {
        outline: '2px solid var(--pfui-colors-focus)',
        outlineOffset: '2px',
        borderRadius: 'var(--pfui-radii-sm)',
      },
      '&[hidden]': {
        display: 'none',
      },
    },
    content: {
      minInlineSize: '0',
      marginBlockStart: 'var(--pfui-spacing-2)',
      '&[hidden]': {
        display: 'none',
      },
    },
  },
  variants: {
    appearance: {
      default: {
        disclosure: {
          background: 'transparent',
        },
      },
      card: {
        disclosure: {
          paddingInline: 'var(--pfui-spacing-3)',
          paddingBlockEnd: 'var(--pfui-spacing-2)',
          border: '1px solid var(--pfui-colors-border)',
          borderRadius: 'var(--pfui-radii-md)',
          background: 'var(--pfui-colors-card)',
        },
      },
    },
  },
  defaultVariants: {
    appearance: 'default',
  },
});
export const disclosureStyles = disclosureClasses();
