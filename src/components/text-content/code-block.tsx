import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { useLayoutEffect, useRef, useState } from 'preact/hooks';
import { cx } from '../../styling/runtime/cx';
import { resolveClass } from '../../utils/resolve-class';
import { Button } from '../button/button';
import { textStyle } from './text-style';
import styles, { codeTokenClasses } from './code-block.styles';

export type CodeBlockTokenKind =
  | 'keyword'
  | 'string'
  | 'comment'
  | 'function'
  | 'type'
  | 'property'
  | 'number'
  | 'literal'
  | 'tag'
  | 'attribute'
  | 'operator'
  | 'punctuation'
  | 'command';
export type CodeBlockToken = { text: string; kind?: CodeBlockTokenKind };
export type CodeBlockProps = Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  'children' | 'dangerouslySetInnerHTML'
> & {
  code: string;
  language?: string;
  tokens?: readonly CodeBlockToken[];
  wrap?: boolean;
  copy?: boolean;
  codeLabel?: string;
  labels?: { copy?: string; success?: string; failure?: string };
  preStyle?: JSX.HTMLAttributes<HTMLPreElement>['style'];
};
const tokenKinds = /* @__PURE__ */ new Set<CodeBlockTokenKind>([
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

export const CodeBlock = /* @__PURE__ */ forwardRef<HTMLDivElement, CodeBlockProps>(
  function CodeBlock(
    {
      code,
      language,
      tokens,
      wrap = false,
      copy = false,
      codeLabel = 'Code',
      labels,
      preStyle,
      class: classProp,
      className,
      ...props
    },
    ref,
  ) {
    const [status, setStatus] = useState<'success' | 'failure' | null>(null);
    const requests = useRef({ version: 0 });
    useLayoutEffect(() => {
      const current = requests.current;
      current.version++;
      setStatus(null);
      return () => {
        current.version++;
      };
    }, [code]);
    async function copyCode() {
      const request = ++requests.current.version;
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(code);
        if (request === requests.current.version) setStatus('success');
      } catch {
        if (request === requests.current.version) setStatus('failure');
      }
    }
    return (
      <div {...props} ref={ref} class={cx(styles.block, resolveClass(classProp, className))}>
        {(language || copy) && (
          <div class={styles.toolbar}>
            {language && <span>{language.toUpperCase()}</span>}
            {copy && (
              <>
                <span role="status" aria-live="polite">
                  {status === 'success'
                    ? (labels?.success ?? 'Copied')
                    : status === 'failure'
                      ? (labels?.failure ?? 'Could not copy. Select the code to copy it manually.')
                      : ''}
                </span>
                <Button class={styles.copy} size="compact" onClick={copyCode}>
                  {labels?.copy ?? 'Copy code'}
                </Button>
              </>
            )}
          </div>
        )}
        <pre
          class={styles.text}
          tabIndex={0}
          aria-label={codeLabel}
          style={textStyle(preStyle, wrap)}
        >
          <code>
            {tokens
              ? tokens.map((token, index) =>
                  token.kind && tokenKinds.has(token.kind) ? (
                    <span key={index} class={codeTokenClasses({ kind: token.kind })}>
                      {token.text}
                    </span>
                  ) : (
                    token.text
                  ),
                )
              : code}
          </code>
        </pre>
      </div>
    );
  },
);
