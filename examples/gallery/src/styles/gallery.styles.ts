import { css } from '../../../../.artifacts/gallery-styled-system/css';

export const galleryStyles = {
  gallery: css({
    '--app-shell-content-max-width': '1120px',
    overflowWrap: 'anywhere',
    '& > h1': {
      marginBlockEnd: '24px',
    },
    '@media (max-width: 600px)': {
      padding: '12px',
    },
    '& h1:focus': {
      outline: '2px solid var(--pfui-colors-focus)',
      outlineOffset: '6px',
    },
  }),
  sections: css({
    '& > *': {
      minWidth: '0',
      maxWidth: '100%',
    },
    '& > section': {
      width: '100%',
    },
    '& > div': {
      width: '100%',
    },
    display: 'grid',
    gap: '32px',
    justifyItems: 'start',
  }),
  heading: css({
    margin: '0 0 16px',
    fontSize: 'var(--pfui-fontSizes-subtitle)',
  }),
  row: css({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '12px',
  }),
  stack: css({
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr)',
    gap: '12px',
  }),
  icons: css({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '16px',
  }),
  iconSample: css({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '8px',
  }),
  form: css({
    display: 'grid',
    gap: '16px',
    maxWidth: '480px',
    justifyItems: 'start',
    '& > label': {
      width: '100%',
    },
    '& > div': {
      width: '100%',
    },
  }),
  label: css({
    display: 'grid',
    gap: '6px',
  }),
  nativeField: css({
    maxWidth: '100%',
    minWidth: '0',
  }),
  longText: css({
    overflowWrap: 'anywhere',
    'pre&': {
      whiteSpace: 'pre-wrap',
      maxWidth: '100%',
    },
  }),
  appearanceControls: css({
    display: 'grid',
    gap: '16px',
    minWidth: '0',
  }),
  settingsGrid: css({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
    alignItems: 'start',
    gap: '16px',
    '& > label': {
      minWidth: '0',
    },
  }),
  settingsColors: css({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
    alignItems: 'start',
    gap: '16px',
    '& > label': {
      minWidth: '0',
    },
    "& input[type='color']": {
      boxSizing: 'border-box',
      width: '100%',
      minWidth: '0',
      height: '36px',
      padding: '4px',
      border: '1px solid var(--pfui-colors-control-border)',
      borderRadius: 'var(--pfui-radii-sm)',
      background: 'var(--pfui-colors-control)',
    },
    '& input:focus-visible': {
      outline: '2px solid var(--pfui-colors-focus)',
      outlineOffset: '2px',
    },
  }),
  settingsConfiguration: css({ display: 'grid', gap: '12px', minWidth: '0' }),
  settingsOption: css({ display: 'grid', gap: '2px', minWidth: '0' }),
  settingsDescription: css({ paddingInlineStart: '44px' }),
  settingsNote: css({
    margin: '0',
    color: 'var(--pfui-colors-text-muted)',
    lineHeight: '1.5',
  }),
  settingsFooter: css({
    justifyContent: 'space-between',
  }),
  shell: css({
    '--app-shell-navigation-width': '250px',
    '@media (max-width: 800px)': {
      display: 'block',
    },
  }),
  navigation: css({
    overflow: 'hidden',
    '@media (max-width: 800px)': {
      '&:not([data-gallery-navigation-open])': {
        display: 'none',
      },
      position: 'static',
      height: '65dvh',
    },
  }),
  brandLink: css({
    color: 'inherit',
    textDecoration: 'none',
    '&:focus-visible': {
      outline: '2px solid var(--pfui-colors-focus)',
      outlineOffset: '2px',
    },
  }),
  workspace: css({
    minWidth: '0',
  }),
  navigationToggle: css({
    '@media (min-width: 801px)': { display: 'none' },
    '@media (max-width: 800px)': {
      display: 'inline-flex',
      margin: '12px',
    },
  }),
  skipLink: css({
    position: 'fixed',
    zIndex: '1000',
    top: '8px',
    left: '8px',
    transform: 'translateY(-150%)',
    padding: '12px',
    background: 'var(--pfui-colors-card)',
    color: 'var(--pfui-colors-text)',
    '&:focus': {
      transform: 'translateY(0)',
    },
  }),
  propsTable: css({
    tableLayout: 'fixed',
    overflowWrap: 'anywhere',
    '& th:first-child': {
      width: '25%',
    },
  }),
  sidebarExample: css({
    maxWidth: '300px',
    minHeight: '260px',
    border: '1px solid var(--pfui-colors-control-border)',
    "&[data-layout='horizontal']": {
      maxWidth: 'none',
      minHeight: '0',
      width: '100%',
    },
    "&[data-layout='horizontal'] > :first-child": {
      display: 'none',
    },
    "&[data-layout='horizontal'] > :last-child": {
      display: 'none',
    },
  }),
  signalAccent: css({
    outline: '3px solid var(--pfui-colors-accent)',
    outlineOffset: '3px',
  }),
  navigationOpen: css({
    '@media (max-width: 800px)': {
      display: 'flex',
    },
  }),
  preview: css({
    boxSizing: 'border-box',
    display: 'grid',
    gap: '16px',
    justifyItems: 'start',
    minWidth: '0',
    padding: '20px',
    border: '1px solid var(--pfui-colors-control-border)',
    borderRadius: 'var(--pfui-radii-sm)',
    background: 'var(--pfui-colors-card)',
    '& > div': {
      minWidth: '0',
      maxWidth: '100%',
    },
    '& > form': {
      minWidth: '0',
      maxWidth: '100%',
    },
  }),
  documentationLink: css({
    color: 'var(--pfui-colors-primary)',
    '&:hover': {
      textDecoration: 'underline',
    },
    '&:focus-visible': {
      outline: '2px solid var(--pfui-colors-focus)',
      outlineOffset: '3px',
    },
  }),
  lead: css({
    margin: '0',
    maxWidth: '70ch',
    lineHeight: '1.6',
  }),
  docSection: css({
    display: 'grid',
    gap: '16px',
    minWidth: '0',
    alignContent: 'start',
    '& > h2': {
      marginBlock: '0',
    },
    '& > h3': {
      marginBlock: '0',
    },
    '& > p': {
      marginBlock: '0',
      maxWidth: '75ch',
      lineHeight: '1.6',
    },
    '& > ul': {
      marginBlock: '0',
      maxWidth: '75ch',
      lineHeight: '1.6',
      paddingInlineStart: '24px',
    },
    '& > pre': {
      marginBlock: '0',
    },
    '& > ul > li + li': {
      marginTop: '8px',
    },
    '& > div': {
      marginTop: '0',
    },
  }),
  apiReference: css({
    display: 'grid',
    gap: '32px',
    minWidth: '0',
    '& > section + section': {
      marginBlockStart: '8px',
    },
    '& > h2': {
      marginBlock: '0',
    },
  }),
  shellPreview: css({
    width: '100%',
    minWidth: '0',
    height: '560px',
    border: '1px solid var(--pfui-colors-control-border)',
    borderRadius: 'var(--pfui-radii-sm)',
  }),
};
