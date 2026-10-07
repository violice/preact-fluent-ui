import { CodeBlock } from './code-block';

export function CodeExample({
  code,
  language = 'tsx',
}: {
  code: string;
  language?: 'tsx' | 'css' | 'shell';
}) {
  return <CodeBlock code={code} language={language} />;
}
