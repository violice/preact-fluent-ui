import { sva } from '../../styles';
export const appShellToolbarClasses = sva({
  slots: ['root', 'inner'],
  base: {
    root: {
      boxSizing: 'border-box',
      minWidth: '0',
      width: '100%',
      background: 'var(--pfui-colors-surface)',
      borderBottom: '1px solid var(--pfui-colors-border)',
      '&[hidden]': {
        display: 'none',
      },
    },
    inner: {
      boxSizing: 'border-box',
      minWidth: '0',
      width: '100%',
      maxWidth: 'var(--app-shell-content-max-width, 1240px)',
      marginInline: 'auto',
      minHeight: '76px',
      paddingBlock: '18px',
      paddingInline: 'var(--app-shell-content-padding, 24px)',
      '@media (max-width: 640px)': {
        paddingBlock: '12px',
      },
    },
  },
});
export const appShellToolbarStyles = appShellToolbarClasses();
