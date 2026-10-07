import { useMemo } from 'preact/hooks';
import {
  CodeBlock as LibraryCodeBlock,
  type CodeBlockTokenKind,
} from '../../../../../dist/components.js';
import { codeBlockStyles } from './code-block.styles.ts';
import { highlighter, kinds } from './highlighter';

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
      class={codeBlockStyles.block}
      code={code}
      language={language}
      tokens={tokens}
      copy
      codeLabel={`${language.toUpperCase()} code example`}
    />
  );
}
