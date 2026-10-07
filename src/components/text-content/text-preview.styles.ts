import { css } from '../../styles';
export const textPreviewClass = css({
  boxSizing: 'border-box',
  minWidth: '0',
  maxWidth: '100%',
  border: '1px solid var(--pfui-colors-border)',
  borderRadius: 'var(--pfui-radii-md)',
  background: 'var(--pfui-colors-surface-muted)',
  color: 'var(--pfui-colors-text)',
  margin: '0',
  padding: '16px',
  overflow: 'auto',
  font: '13px / 1.7 var(--pfui-fonts-mono)',
  tabSize: '2',
  overflowWrap: 'anywhere',
  '&:focus-visible': {
    outline: '2px solid var(--pfui-colors-focus)',
    outlineOffset: '-2px',
  },
  '@media (forced-colors: active)': {
    '& span': {
      color: 'CanvasText',
    },
  },
});
