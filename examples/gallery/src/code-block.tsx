import { useMemo } from 'preact/hooks';
import { createHighlighter } from '@tanstack/highlight/core';
import { tsx } from '@tanstack/highlight/languages/tsx';
import { css } from '@tanstack/highlight/languages/css';
import { shell } from '@tanstack/highlight/languages/shell';
import {
  CodeBlock as LibraryCodeBlock,
  type CodeBlockTokenKind,
} from '../../../dist/components.js';
import styles from './code-block.module.css';

const highlighter = createHighlighter({ languages: [tsx, css, shell] });
const kinds = new Set<CodeBlockTokenKind>([
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
export function CodeBlock({
  code,
  language = 'tsx',
}: {
  code: string;
  language?: 'tsx' | 'css' | 'shell';
}) {
  const tokens = useMemo(
    () =>
      highlighter.tokenize(code, { lang: language }).tokens.map((token) => {
        const kind = token.className === 'attr' ? 'attribute' : token.className;
        return {
          text: token.value,
          kind:
            kind && kinds.has(kind as CodeBlockTokenKind)
              ? (kind as CodeBlockTokenKind)
              : undefined,
        };
      }),
    [code, language],
  );
  return (
    <LibraryCodeBlock
      class={styles.block}
      code={code}
      language={language}
      tokens={tokens}
      copy
      codeLabel={`${language.toUpperCase()} code example`}
    />
  );
}
export function CodeExample({
  code,
  language = 'tsx',
}: {
  code: string;
  language?: 'tsx' | 'css' | 'shell';
}) {
  return <CodeBlock code={code} language={language} />;
}
