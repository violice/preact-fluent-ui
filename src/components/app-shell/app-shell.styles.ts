import { sva } from '../../styling';
export const appShellClasses = sva({
  slots: ['shell', 'workspace', 'header', 'footer', 'content'],
  base: {
    shell: {
      boxSizing: 'border-box',
      display: 'grid',
      gridTemplateColumns: 'var(--app-shell-navigation-width, 248px) minmax(0, 1fr)',
      minWidth: '0',
      minHeight: '100dvh',
      fontFamily: 'var(--font-body)',
      fontSynthesis: 'none',
      fontSize: 'var(--type-body)',
      lineHeight: '20px',
      color: 'var(--color-text)',
      background: 'var(--color-canvas)',
      '& > [data-sidebar]': {
        boxSizing: 'border-box',
        position: 'sticky',
        top: '0',
        alignSelf: 'start',
        width: '100%',
        minWidth: '0',
        height: '100dvh',
      },
      '& > [data-app-shell-workspace]': {
        margin: '8px',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
      },
      "&[data-navigation-layout='rail']": {
        gridTemplateColumns: 'var(--app-shell-rail-width, 64px) minmax(0, 1fr)',
      },
      "&[data-navigation-layout='horizontal']": {
        gridTemplateColumns: 'minmax(0, 1fr)',
        gridTemplateRows: 'auto 1fr',
      },
      "&[data-navigation-layout='horizontal'] > [data-sidebar]": {
        position: 'static',
        height: 'auto',
      },
      "&[data-navigation-layout='horizontal'] > [data-app-shell-workspace]": {
        margin: '0',
        borderRadius: '0',
      },
      '&[hidden]': {
        display: 'none !important',
      },
    },
    workspace: {
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      minWidth: '0',
      background: 'var(--color-surface)',
      '& > :where(:first-child)': {
        borderStartStartRadius: 'inherit',
        borderStartEndRadius: 'inherit',
      },
      '&[hidden]': {
        display: 'none !important',
      },
    },
    header: {
      boxSizing: 'border-box',
      minWidth: '0',
      padding: 'var(--app-shell-content-padding, 24px)',
      flexShrink: '0',
      '&[hidden]': {
        display: 'none !important',
      },
    },
    footer: {
      boxSizing: 'border-box',
      minWidth: '0',
      padding: 'var(--app-shell-content-padding, 24px)',
      flexShrink: '0',
      width: '100%',
      maxWidth: 'var(--app-shell-content-max-width, 1240px)',
      marginInline: 'auto',
      '&[hidden]': {
        display: 'none !important',
      },
    },
    content: {
      boxSizing: 'border-box',
      minWidth: '0',
      padding: 'var(--app-shell-content-padding, 24px)',
      width: '100%',
      maxWidth: 'var(--app-shell-content-max-width, 1240px)',
      marginInline: 'auto',
      flex: '1',
      '&[hidden]': {
        display: 'none !important',
      },
    },
  },
});
export default appShellClasses();
