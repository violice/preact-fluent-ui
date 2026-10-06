import { sva, cva } from '../../styling';
export const codeBlockClasses = sva({
  slots: ['block', 'text', 'toolbar', 'copy'],
  base: {
    block: {
      boxSizing: 'border-box',
      minWidth: '0',
      maxWidth: '100%',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      background: 'var(--color-surface-muted)',
      color: 'var(--color-text)',
      overflow: 'hidden',
    },
    text: {
      boxSizing: 'border-box',
      margin: '0',
      padding: '16px',
      maxWidth: '100%',
      overflow: 'auto',
      font: '13px / 1.7 var(--font-mono)',
      tabSize: '2',
      overflowWrap: 'anywhere',
      '&:focus-visible': {
        outline: '2px solid var(--color-focus)',
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
      borderBottom: '1px solid var(--color-border)',
      font: 'var(--type-caption) / 1.5 var(--font-body)',
    },
    copy: {
      marginInlineStart: 'auto',
    },
  },
});
export default codeBlockClasses();
export const codeTokenClasses = cva({
  variants: {
    kind: {
      keyword: { color: 'var(--code-color-keyword)' },
      tag: { color: 'var(--code-color-tag)' },
      string: { color: 'var(--code-color-string)' },
      comment: { color: 'var(--code-color-comment)' },
      function: { color: 'var(--code-color-function)' },
      type: { color: 'var(--code-color-type)' },
      attribute: { color: 'var(--code-color-attribute)' },
      property: { color: 'var(--code-color-property)' },
      number: { color: 'var(--code-color-number)' },
      literal: { color: 'var(--code-color-literal)' },
      command: { color: 'var(--code-color-command)' },
      operator: { color: 'var(--code-color-operator)' },
      punctuation: { color: 'var(--code-color-punctuation)' },
    },
  },
});
