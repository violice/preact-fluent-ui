import { sva } from '../../styling';
export const disclosureClasses = sva({
  slots: ['disclosure', 'summary', 'content'],
  base: {
    disclosure: {
      boxSizing: 'border-box',
      minInlineSize: '0',
      color: 'var(--color-text)',
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
      gap: 'var(--space-2)',
      paddingBlock: 'var(--space-2)',
      font: 'var(--weight-semibold) var(--type-body) / 20px var(--font-body)',
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
        outline: '2px solid var(--color-focus)',
        outlineOffset: '2px',
        borderRadius: 'var(--radius-sm)',
      },
      '&[hidden]': {
        display: 'none',
      },
    },
    content: {
      minInlineSize: '0',
      marginBlockStart: 'var(--space-2)',
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
          paddingInline: 'var(--space-3)',
          paddingBlockEnd: 'var(--space-2)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-card)',
        },
      },
    },
  },
  defaultVariants: {
    appearance: 'default',
  },
});
export default disclosureClasses();
