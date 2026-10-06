import { sva } from '../../styling';
export const toolbarClasses = sva({
  slots: ['toolbar', 'group'],
  base: {
    toolbar: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      minWidth: '0',
      maxWidth: '100%',
      gap: 'var(--space-3)',
      overflowWrap: 'anywhere',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--type-body)',
      lineHeight: '20px',
      color: 'var(--color-text)',
      '&[hidden]': {
        display: 'none',
      },
    },
    group: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      minWidth: '0',
      maxWidth: '100%',
      gap: 'var(--space-3)',
      overflowWrap: 'anywhere',
      '& > *': {
        minWidth: '0',
        maxWidth: '100%',
      },
      '&[hidden]': {
        display: 'none',
      },
    },
  },
  variants: {
    align: {
      start: {},
      end: {
        group: {
          marginInlineStart: 'auto',
        },
      },
    },
  },
  defaultVariants: {
    align: 'start',
  },
});
export default toolbarClasses();
