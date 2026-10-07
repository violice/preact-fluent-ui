import type { ComponentDoc } from '../../types';
import { DocTextPreviewExample } from './text-preview-example';

export const textPreviewDoc: ComponentDoc = {
  title: 'TextPreview',
  slug: 'text-preview',
  purpose: 'Read selectable diagnostics or configuration without changing whitespace.',
  example: DocTextPreviewExample,
  code: '<TextPreview text={diagnostics} aria-label="Diagnostics" class={css({ maxHeight: "220px" })} />',
  props: [
    ['text', 'string', 'Literal selectable text, preserving whitespace and newlines.'],
    ['wrap', 'boolean = true', 'Wrap long lines; false enables horizontal scrolling.'],
    ['style.maxHeight', 'CSS-compatible value', 'Constrain the native pre and scroll inside it.'],
  ],
  accessibility:
    'Native pre root, ref, hidden and attributes are forwarded. tabIndex defaults to 0 for keyboard scrolling and can be overridden. No live announcement or editing role.',
};
