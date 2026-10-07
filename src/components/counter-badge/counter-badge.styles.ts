import { css } from '../../styles';
export const counterBadgeClass = css({
  display: 'inline-grid',
  placeItems: 'center',
  boxSizing: 'border-box',
  flexShrink: '0',
  inlineSize: 'max-content',
  minInlineSize: '24px',
  blockSize: '24px',
  padding: '4px',
  borderRadius: 'var(--pfui-radii-sm)',
  color: 'var(--pfui-colors-text-muted)',
  background: 'var(--pfui-colors-surface-pressed)',
  fontFamily: 'var(--pfui-fonts-body)',
  fontSynthesis: 'none',
  fontSize: '11px',
  fontWeight: '400',
  lineHeight: '14px',
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
  '&[hidden]': {
    display: 'none',
  },
  '@media (forced-colors: active)': {
    border: '1px solid CanvasText',
    color: 'CanvasText',
    background: 'Canvas',
  },
});
