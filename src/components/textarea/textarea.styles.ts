import { css } from '../../styling';
export const textareaClasses = css({
  boxSizing: 'border-box',
  minWidth: '0',
  resize: 'vertical',
  minHeight: '36px',
  padding: '7px 12px',
  font: 'var(--type-body) / 20px var(--font-body)',
  fontSynthesis: 'none',
  color: 'var(--color-text)',
  background: 'var(--color-control)',
  border: '1px solid var(--color-control-border)',
  borderBottomColor: 'var(--color-control-bottom)',
  borderRadius: 'var(--radius-sm)',
  boxShadow: 'var(--shadow-control)',
  transition:
    'background-color 120ms ease,\n    border-color 120ms ease,\n    box-shadow 120ms ease',
  '&:hover:where(:not(:disabled))': {
    background: 'var(--color-control-hover)',
    borderBottomColor: 'var(--color-text-subtle)',
  },
  '&:focus-visible': {
    outline: '2px solid var(--color-focus)',
    outlineOffset: '2px',
    borderBottomColor: 'var(--color-accent)',
  },
  '&::placeholder': {
    color: 'var(--color-text-subtle)',
    opacity: '1',
  },
  "&[aria-invalid='true']": {
    borderBottomColor: 'var(--color-danger)',
  },
  '&:disabled': {
    color: 'var(--color-disabled)',
    background: 'var(--color-surface-muted)',
    borderColor: 'var(--color-border)',
    cursor: 'not-allowed',
  },
  '&[hidden]': {
    display: 'none',
  },
  '@media (forced-colors: active)': {
    color: 'FieldText',
    background: 'Field',
    borderColor: 'FieldText',
    boxShadow: 'none',
    '&:hover:where(:not(:disabled))': {
      color: 'FieldText',
      background: 'Field',
      borderColor: 'FieldText',
      boxShadow: 'none',
    },
    "&[aria-invalid='true']": {
      color: 'FieldText',
      background: 'Field',
      borderColor: 'FieldText',
      boxShadow: 'none',
      borderBottomStyle: 'dashed',
    },
    '&:disabled': {
      background: 'Field',
      color: 'GrayText',
      borderColor: 'GrayText',
    },
    '&:focus-visible': {
      outlineColor: 'Highlight',
    },
  },
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
  },
});
export default { textarea: textareaClasses };
