import { createHighlighter } from '@tanstack/highlight/core';
import { tsx } from '@tanstack/highlight/languages/tsx';
import { css } from '@tanstack/highlight/languages/css';
import { shell } from '@tanstack/highlight/languages/shell';
import { type CodeBlockTokenKind } from '../../../../../dist/components.js';

export const highlighter = createHighlighter({ languages: [tsx, css, shell] });

export const kinds = new Set<CodeBlockTokenKind>([
  'keyword',
  'string',
  'comment',
  'function',
  'type',
  'property',
  'number',
  'literal',
  'tag',
  'attribute',
  'operator',
  'punctuation',
  'command',
]);
