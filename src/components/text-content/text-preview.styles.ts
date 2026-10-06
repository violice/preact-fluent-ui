import { css } from '../../styling';
export const textPreviewClass = css({
  boxSizing: 'border-box',
  minWidth: '0',
  maxWidth: '100%',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  background: 'var(--color-surface-muted)',
  color: 'var(--color-text)',
  margin: '0',
  padding: '16px',
  overflow: 'auto',
  font: '13px / 1.7 var(--font-mono)',
  tabSize: '2',
  overflowWrap: 'anywhere',
  '&:focus-visible': {
    outline: '2px solid var(--color-focus)',
    outlineOffset: '-2px',
  },
  '@media (forced-colors: active)': {
    '& span': {
      color: 'CanvasText',
    },
  },
});
