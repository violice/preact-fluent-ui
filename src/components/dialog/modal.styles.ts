import { sva } from '../../styling';
export const modalClasses = sva({
  slots: ['backdrop', 'dialog'],
  base: {
    backdrop: {
      boxSizing: 'border-box',
      position: 'fixed',
      inset: '0',
      display: 'grid',
      placeItems: 'center',
      padding: 'var(--space-5)',
      background: 'rgb(0 0 0 / 38%)',
      zIndex: '20',
      '@media (forced-colors: active)': {
        background: 'transparent',
      },
    },
    dialog: {
      boxSizing: 'border-box',
      width: 'min(100%, 520px)',
      maxHeight: 'calc(100dvh - 40px)',
      overflowY: 'auto',
      padding: 'var(--space-6)',
      background: 'var(--color-surface-raised)',
      color: 'var(--color-text)',
      border: '1px solid var(--color-border-strong)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-dialog)',
      font: 'var(--type-body) / 1.5 var(--font-body)',
      '&:focus-visible': {
        outline: '2px solid var(--color-focus)',
        outlineOffset: '2px',
      },
      '@media (forced-colors: active)': {
        background: 'Canvas',
        color: 'CanvasText',
        borderColor: 'CanvasText',
        '&:focus-visible': {
          outlineColor: 'Highlight',
        },
      },
    },
  },
});
export default modalClasses();
