import { cva } from '../../styling';
export const cardClasses = cva({
  base: {
    boxSizing: 'border-box',
    overflowWrap: 'anywhere',
    fontFamily: 'var(--font-body)',
    fontSynthesis: 'none',
    fontSize: 'var(--type-body)',
    lineHeight: '20px',
    minWidth: '0',
    padding: 'var(--space-5)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--color-text)',
    background: 'var(--color-card)',
    boxShadow: 'var(--shadow-card)',
    '@media (max-width: 600px)': {
      padding: 'var(--space-4)',
    },
  },
  variants: {
    padding: {
      regular: {},
      none: {
        '& > :where(:first-child)': {
          borderStartStartRadius: 'inherit',
          borderStartEndRadius: 'inherit',
        },
        '& > :where(:last-child)': {
          borderEndStartRadius: 'inherit',
          borderEndEndRadius: 'inherit',
        },
        padding: '0',
      },
    },
  },
  defaultVariants: {
    padding: 'regular',
  },
});
