import { css } from '../../../../../.artifacts/gallery-styled-system/css';

export const changelogStyles = {
  prose: css({
    minWidth: '0',
    maxWidth: '80ch',
    overflowWrap: 'anywhere',
    lineHeight: '1.6',
    '& :is(h2, h3, h4, h5, h6)': {
      marginBlock: '1.5em 0.5em',
    },
    '& :is(p, ul, ol, blockquote)': {
      marginBlock: '0.75em',
    },
    '& :is(ul, ol)': {
      paddingInlineStart: '1.5em',
    },
    '& li + li': {
      marginBlockStart: '0.5em',
    },
    '& li > p': {
      marginBlock: '0',
    },
    '& blockquote': {
      marginInline: '0',
      paddingInlineStart: '1em',
      borderInlineStart: '3px solid var(--pfui-colors-border)',
      color: 'var(--pfui-colors-text-muted)',
    },
    '& :is(pre, figure)': {
      minWidth: '0',
      maxWidth: '100%',
    },
    '& pre': {
      overflowX: 'auto',
      overflowWrap: 'normal',
    },
    '& a': {
      color: 'var(--pfui-colors-accent)',
      textDecoration: 'underline',
    },
  }),
};
