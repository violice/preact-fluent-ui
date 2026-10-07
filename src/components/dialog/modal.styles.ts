import { sva } from '../../styles';
export const modalClasses = sva({
  slots: ['backdrop', 'dialog'],
  base: {
    backdrop: {
      boxSizing: 'border-box',
      position: 'fixed',
      inset: '0',
      display: 'grid',
      placeItems: 'center',
      padding: 'var(--pfui-spacing-5)',
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
      padding: 'var(--pfui-spacing-6)',
      background: 'var(--pfui-colors-surface-raised)',
      color: 'var(--pfui-colors-text)',
      border: '1px solid var(--pfui-colors-border-strong)',
      borderRadius: 'var(--pfui-radii-lg)',
      boxShadow: 'var(--pfui-shadows-dialog)',
      font: 'var(--pfui-fontSizes-body) / 1.5 var(--pfui-fonts-body)',
      '&:focus-visible': {
        outline: '2px solid var(--pfui-colors-focus)',
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
export const modalStyles = modalClasses();
