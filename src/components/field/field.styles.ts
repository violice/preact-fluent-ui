import { sva } from '../../styles';
export const fieldClasses = sva({
  slots: ['root', 'label', 'required', 'hint', 'validation'],
  base: {
    root: {
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      minInlineSize: '0',
      fontFamily: 'var(--pfui-fonts-body)',
      fontSynthesis: 'none',
      color: 'var(--pfui-colors-text)',
      '&[hidden]': { display: 'none' },
    },
    label: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: '600',
      minInlineSize: '0',
      overflowWrap: 'anywhere',
    },
    required: { marginInlineStart: '4px', color: 'var(--pfui-colors-danger)' },
    hint: {
      minInlineSize: '0',
      fontSize: '12px',
      lineHeight: '16px',
      overflowWrap: 'anywhere',
      color: 'var(--pfui-colors-text-muted)',
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
      error: { validation: { color: 'var(--pfui-colors-danger)' } },
      warning: { validation: { color: 'var(--pfui-colors-warning)' } },
      success: { validation: { color: 'var(--pfui-colors-success)' } },
    },
  },
  defaultVariants: { validationState: 'none' },
});
