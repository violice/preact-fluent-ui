import type { ComponentDoc } from '../../types';
import { DocCodeBlockExample } from './code-block-example';

export const codeBlockDoc: ComponentDoc = {
  title: 'CodeBlock',
  slug: 'code-block',
  purpose: 'Read source code with optional generic syntax tokens and exact-source copying.',
  example: DocCodeBlockExample,
  code: '<CodeBlock code={source} language="json" copy codeLabel="Configuration" />',
  props: [
    ['code', 'string', 'Raw source; copying always uses this exact string.'],
    [
      'tokens',
      'readonly CodeBlockToken[]',
      'Optional safe text/kind tokens. Their text must concatenate to code to preserve displayed source. No parsing or runtime mismatch fallback.',
    ],
    ['language', 'string', 'Display label only.'],
    ['wrap', 'boolean = false', 'Wrap long lines when enabled.'],
    ['copy', 'boolean = false', 'Show a native copy button and live result.'],
    [
      'codeLabel',
      'string = "Code"',
      'Localized accessible name of the scrollable pre. Root aria-label only names the div.',
    ],
    [
      'labels',
      '{ copy?: string; success?: string; failure?: string }',
      'Override English copy and result labels.',
    ],
    [
      'preStyle',
      'Native style',
      'Constrain code height with maxHeight. Root style applies to the div.',
    ],
  ],
  accessibility:
    'Native div root and ref with pre/code semantics. hidden is forwarded. Source is escaped; plain or unknown kinds render as text. The pre has tabIndex 0. Clipboard rejection or absence announces failure.',
  note: 'Token kinds: keyword, string, comment, function, type, property, number, literal, tag, attribute, operator, punctuation, command. Override --pfui-codeColors-<kind> theme variables. Forced colors use CanvasText. Tokenization remains external; this gallery maps TanStack tokens to library kinds.',
};
