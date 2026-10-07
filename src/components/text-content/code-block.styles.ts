import { sva, cva } from '../../styles';
export const codeBlockClasses = sva({
  slots: ['block', 'text', 'toolbar', 'copy'],
  base: {
    block: {
      boxSizing: 'border-box',
      minWidth: '0',
      maxWidth: '100%',
      border: '1px solid var(--pfui-colors-border)',
      borderRadius: 'var(--pfui-radii-md)',
      background: 'var(--pfui-colors-surface-muted)',
      color: 'var(--pfui-colors-text)',
      overflow: 'hidden',
    },
    text: {
      boxSizing: 'border-box',
      margin: '0',
      padding: '16px',
      maxWidth: '100%',
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
    },
    toolbar: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 12px',
      borderBottom: '1px solid var(--pfui-colors-border)',
      font: 'var(--pfui-fontSizes-caption) / 1.5 var(--pfui-fonts-body)',
    },
    copy: {
      marginInlineStart: 'auto',
    },
  },
});
export const codeBlockStyles = codeBlockClasses();
export const codeTokenClasses = cva({
  variants: {
    kind: {
      keyword: { color: 'var(--pfui-codeColors-keyword)' },
      tag: { color: 'var(--pfui-codeColors-tag)' },
      string: { color: 'var(--pfui-codeColors-string)' },
      comment: { color: 'var(--pfui-codeColors-comment)' },
      function: { color: 'var(--pfui-codeColors-function)' },
      type: { color: 'var(--pfui-codeColors-type)' },
      attribute: { color: 'var(--pfui-codeColors-attribute)' },
      property: { color: 'var(--pfui-codeColors-property)' },
      number: { color: 'var(--pfui-codeColors-number)' },
      literal: { color: 'var(--pfui-codeColors-literal)' },
      command: { color: 'var(--pfui-codeColors-command)' },
      operator: { color: 'var(--pfui-codeColors-operator)' },
      punctuation: { color: 'var(--pfui-codeColors-punctuation)' },
    },
  },
});
