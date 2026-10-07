import { css } from '../../styles';
export const inputClass = css({
  boxSizing: 'border-box',
  minWidth: '0',
  minHeight: '36px',
  padding: '7px 12px',
  font: 'var(--pfui-fontSizes-body) / 20px var(--pfui-fonts-body)',
  fontSynthesis: 'none',
  color: 'var(--pfui-colors-text)',
  background: 'var(--pfui-colors-control)',
  border: '1px solid var(--pfui-colors-control-border)',
  borderBottomColor: 'var(--pfui-colors-control-bottom)',
  borderRadius: 'var(--pfui-radii-sm)',
  boxShadow: 'var(--pfui-shadows-control)',
  transition:
    'background-color 120ms ease,\n    border-color 120ms ease,\n    box-shadow 120ms ease',
  '&:hover:where(:not(:disabled))': {
    background: 'var(--pfui-colors-control-hover)',
    borderBottomColor: 'var(--pfui-colors-text-subtle)',
  },
  '&:focus-visible': {
    outline: '2px solid var(--pfui-colors-focus)',
    outlineOffset: '2px',
    borderBottomColor: 'var(--pfui-colors-accent)',
  },
  '&::placeholder': {
    color: 'var(--pfui-colors-text-subtle)',
    opacity: '1',
  },
  "&[aria-invalid='true']": {
    borderBottomColor: 'var(--pfui-colors-danger)',
  },
  '&:disabled': {
    color: 'var(--pfui-colors-disabled)',
    background: 'var(--pfui-colors-surface-muted)',
    borderColor: 'var(--pfui-colors-border)',
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
