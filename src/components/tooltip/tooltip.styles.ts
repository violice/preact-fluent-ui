import { css } from '../../styling';
export const tooltipClasses = css({
  boxSizing: 'border-box',
  position: 'fixed',
  zIndex: '30',
  width: 'max-content',
  maxWidth: 'min(280px, calc(100vw - 16px))',
  padding: '6px 8px',
  border: '1px solid var(--color-border-strong)',
  borderRadius: '4px',
  background: 'var(--color-surface-raised)',
  color: 'var(--color-text)',
  boxShadow: '0 2px 8px rgb(0 0 0 / 14%)',
  font: '12px / 16px var(--font-body)',
  overflowWrap: 'anywhere',
  pointerEvents: 'auto',
  '@media (forced-colors: active)': {
    background: 'Canvas',
    color: 'CanvasText',
    borderColor: 'CanvasText',
  },
});
export default { tooltip: tooltipClasses };

export function tooltipPosition(position: { top: number; left: number; maxWidth: number }) {
  return css.dynamic({ top: position.top, left: position.left, maxWidth: position.maxWidth });
}
