import { sva, cva } from '../../styles';
export const tableClasses = sva({
  slots: ['table', 'container', 'header', 'heading', 'cell', 'body', 'row', 'footer', 'caption'],
  base: {
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: 'var(--pfui-fonts-body)',
      fontSynthesis: 'none',
      fontSize: 'var(--pfui-fontSizes-body)',
      lineHeight: '20px',
      color: 'var(--pfui-colors-text)',
      textAlign: 'start',
      '&[hidden]': {
        display: 'none',
      },
    },
    container: {
      minWidth: '0',
      maxWidth: '100%',
      overflowX: 'auto',
      '&[hidden]': {
        display: 'none',
      },
    },
    header: {
      background: 'var(--pfui-colors-surface-muted)',
      '&[hidden]': {
        display: 'none',
      },
    },
    heading: {
      padding: '14px 16px',
      borderBlockEnd: '1px solid var(--pfui-colors-border)',
      verticalAlign: 'middle',
      fontWeight: '600',
      '&[hidden]': {
        display: 'none',
      },
      'thead > tr > &': {
        paddingBlock: '12px',
        color: 'var(--pfui-colors-text-muted)',
        fontSize: '12px',
      },
    },
    cell: {
      padding: '14px 16px',
      borderBlockEnd: '1px solid var(--pfui-colors-border)',
      verticalAlign: 'middle',
      '&[hidden]': {
        display: 'none',
      },
    },
    body: {
      '&[hidden]': {
        display: 'none',
      },
    },
    row: {
      '&[hidden]': {
        display: 'none',
      },
      ':where(tbody) > &:hover': {
        background: 'var(--pfui-colors-surface-hover)',
      },
    },
    footer: {
      background: 'var(--pfui-colors-surface-muted)',
      '&[hidden]': {
        display: 'none',
      },
    },
    caption: {
      paddingBlock: '12px',
      textAlign: 'start',
      fontWeight: '600',
      '&[hidden]': {
        display: 'none',
      },
    },
  },
  variants: {
    density: {
      regular: {},
      compact: {
        heading: {
          padding: '8px 12px',
          'thead > tr > &': { paddingBlock: '8px' },
        },
        cell: {
          padding: '8px 12px',
        },
      },
    },
    dividers: {
      all: {},
      between: {
        table: {
          '& > :where(thead, tbody, tfoot) > :where(tr) > :where(th, td)': {
            borderBlockEnd: '0',
            borderBlockStart: '1px solid var(--pfui-colors-border)',
          },
          '& > :where(thead:not([hidden])) > :where(tr:nth-child(1 of tr:not([hidden]))) > :where(th, td)':
            {
              borderBlockStart: '0',
            },
          '&:not(:has(> thead:not([hidden]) > tr:not([hidden]))) > :where(tbody:nth-child(1 of tbody:not([hidden]):has(> tr:not([hidden])))) > :where(tr:nth-child(1 of tr:not([hidden]))) > :where(th, td)':
            {
              borderBlockStart: '0',
            },
          '&:not(:has(> :is(thead, tbody):not([hidden]) > tr:not([hidden]))) > :where(tfoot:not([hidden])) > :where(tr:nth-child(1 of tr:not([hidden]))) > :where(th, td)':
            {
              borderBlockStart: '0',
            },
        },
      },
    },
  },
  defaultVariants: {
    density: 'regular',
    dividers: 'all',
  },
});
export const tableStyles = tableClasses();
export const tableAlignClasses = cva({
  variants: {
    align: {
      start: { textAlign: 'start' },
      center: { textAlign: 'center' },
      end: { textAlign: 'end' },
    },
  },
  defaultVariants: { align: 'start' },
});
