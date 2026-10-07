import { cva } from '../../styles';
export const cardClasses = cva({
  base: {
    boxSizing: 'border-box',
    overflowWrap: 'anywhere',
    fontFamily: 'var(--pfui-fonts-body)',
    fontSynthesis: 'none',
    fontSize: 'var(--pfui-fontSizes-body)',
    lineHeight: '20px',
    minWidth: '0',
    padding: 'var(--pfui-spacing-5)',
    border: '1px solid var(--pfui-colors-border)',
    borderRadius: 'var(--pfui-radii-md)',
    color: 'var(--pfui-colors-text)',
    background: 'var(--pfui-colors-card)',
    boxShadow: 'var(--pfui-shadows-card)',
    '@media (max-width: 600px)': {
      padding: 'var(--pfui-spacing-4)',
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
