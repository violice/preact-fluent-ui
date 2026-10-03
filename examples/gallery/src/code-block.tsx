import { useEffect, useMemo, useState } from 'preact/hooks';
import { createHighlighter } from '@tanstack/highlight/core';
import { tsx } from '@tanstack/highlight/languages/tsx';
import { css } from '@tanstack/highlight/languages/css';
import { shell } from '@tanstack/highlight/languages/shell';
import { Button, Icon } from '../../../dist/index.js';
import styles from './code-block.module.css';

const highlighter = createHighlighter({ languages: [tsx, css, shell] });
export function CodeBlock({
  code,
  language = 'tsx',
}: {
  code: string;
  language?: 'tsx' | 'css' | 'shell';
}) {
  const tokens = useMemo(
    () => highlighter.tokenize(code, { lang: language }).tokens,
    [code, language],
  );
  const [status, setStatus] = useState('');
  useEffect(() => setStatus(''), [code]);
  return (
    <div class={styles.block}>
      <div class={styles.toolbar}>
        <span>{language.toUpperCase()}</span>
        <span role="status" aria-live="polite">
          {status}
        </span>
        <Button
          size="compact"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code);
              setStatus('Copied');
            } catch {
              setStatus('Could not copy. Select the code to copy it manually.');
            }
          }}
        >
          <Icon name="copy" size={16} />
          Copy code
        </Button>
      </div>
      <pre class={styles.code} tabIndex={0} aria-label={`${language.toUpperCase()} code example`}>
        <code>
          {tokens.map((token, index) =>
            token.className ? (
              <span class={`th-${token.className}`} key={index}>
                {token.value}
              </span>
            ) : (
              token.value
            ),
          )}
        </code>
      </pre>
    </div>
  );
}
export function CodeExample({
  code,
  language = 'tsx',
}: {
  code: string;
  language?: 'tsx' | 'css' | 'shell';
}) {
  return (
    <details class={styles.example}>
      <summary>Show code</summary>
      <CodeBlock code={code} language={language} />
    </details>
  );
}
