import { sva } from '../styling';
export const fieldClasses = sva({
  slots: ['root', 'label', 'required', 'hint', 'validation'],
  base: {
    root: {
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      minInlineSize: '0',
      fontFamily: 'var(--font-body)',
      fontSynthesis: 'none',
      color: 'var(--fui-colors-text)',
      '&[hidden]': { display: 'none' },
    },
    label: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: '600',
      minInlineSize: '0',
      overflowWrap: 'anywhere',
    },
    required: { marginInlineStart: '4px', color: 'var(--fui-colors-danger)' },
    hint: {
      minInlineSize: '0',
      fontSize: '12px',
      lineHeight: '16px',
      overflowWrap: 'anywhere',
      color: 'var(--fui-colors-text-muted)',
    },
    validation: {
      minInlineSize: '0',
      fontSize: '12px',
      lineHeight: '16px',
      overflowWrap: 'anywhere',
    },
  },
  variants: {
    validationState: {
      none: {},
      error: { validation: { color: 'var(--fui-colors-danger)' } },
      warning: { validation: { color: 'var(--fui-colors-warning)' } },
      success: { validation: { color: 'var(--fui-colors-success)' } },
    },
  },
  defaultVariants: { validationState: 'none' },
});
