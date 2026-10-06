import { cva } from '../../styling';
export const textClasses = cva({
  base: {
    margin: '0',
    fontFamily: 'var(--font-body)',
    fontSynthesis: 'none',
    overflowWrap: 'anywhere',
  },
  variants: {
    preset: {
      caption2: {
        fontSize: '10px',
        lineHeight: '14px',
        fontWeight: '400',
      },
      caption1: {
        fontSize: '12px',
        lineHeight: '16px',
        fontWeight: '400',
      },
      body1: {
        fontSize: '14px',
        lineHeight: '20px',
        fontWeight: '400',
      },
      subtitle2: {
        fontSize: '16px',
        lineHeight: '22px',
        fontWeight: '600',
      },
      subtitle1: {
        fontSize: '20px',
        lineHeight: '28px',
        fontWeight: '600',
      },
      title3: {
        fontSize: '24px',
        lineHeight: '32px',
        fontWeight: '600',
      },
      title2: {
        fontSize: '28px',
        lineHeight: '36px',
        fontWeight: '600',
      },
      title1: {
        fontSize: '32px',
        lineHeight: '40px',
        fontWeight: '600',
      },
      largeTitle: {
        fontSize: '40px',
        lineHeight: '52px',
        fontWeight: '600',
      },
      display: {
        fontSize: '68px',
        lineHeight: '92px',
        fontWeight: '600',
      },
    },
    color: {
      default: {
        color: 'var(--color-text)',
      },
      muted: {
        color: 'var(--color-text-muted)',
      },
      subtle: {
        color: 'var(--color-text-subtle)',
      },
      inherit: {},
    },
  },
  defaultVariants: {
    preset: 'body1',
    color: 'inherit',
  },
});
