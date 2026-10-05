import type { JSX } from 'preact';

export function textStyle(
  style: JSX.HTMLAttributes<HTMLPreElement>['style'],
  wrap: boolean,
): JSX.HTMLAttributes<HTMLPreElement>['style'] {
  const whiteSpace = wrap ? 'pre-wrap' : 'pre';
  if (typeof style === 'string') return `${style};white-space:${whiteSpace}`;
  return { ...style, whiteSpace };
}
