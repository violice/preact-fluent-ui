import { textPresets } from '../../../../examples/controls/text-presets';
import { TextExample } from '../../../../examples/controls/text-example';
import type { ComponentDoc } from '../../types';

export const textDoc: ComponentDoc = {
  title: 'Text',
  slug: 'text',
  purpose: 'Apply Fluent 2 typography independently of the semantic HTML element.',
  example: TextExample,
  code: '<Text preset="subtitle2" render={<h2 />}>Saved routes</Text>\n<Text color="muted" render={<p />}>Profile details</Text>\n<Text>Inline text</Text>',
  props: [
    [
      'preset',
      textPresets.join(' | '),
      'Default body1. Accepts a signal; selects size, line height and weight.',
    ],
    [
      'color',
      'inherit | default | muted | subtle',
      'Default inherit leaves the surrounding color unchanged. Other values use theme text tokens. Accepts a signal.',
    ],
    [
      'render',
      'VNode | (props: TextRenderProps, state: TextRenderState) => VNode',
      'Default span. Composes a native root without a wrapper; callbacks must forward props and ref.',
    ],
  ],
  accessibility:
    'Choose h1–h6 for headings and p for paragraphs. Visual presets do not imply heading semantics. Text adds no tab stop or live region.',
  note: 'The optional reset configuration clears native h1–h6 and p margins and typography. Text preserves native block or inline display and uses the theme body font.',
};
