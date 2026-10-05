import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { mergeClasses } from '../utils/merge-classes';
import { resolveClass } from '../utils/resolve-class';
import { textStyle } from './text-style';
import styles from './text-content.module.css';

export type TextPreviewProps = Omit<
  JSX.HTMLAttributes<HTMLPreElement>,
  'children' | 'dangerouslySetInnerHTML'
> & {
  text: string;
  wrap?: boolean;
};

export const TextPreview = /* @__PURE__ */ forwardRef<HTMLPreElement, TextPreviewProps>(
  function TextPreview(
    { text, wrap = true, style, tabIndex = 0, class: classProp, className, ...props },
    ref,
  ) {
    return (
      <pre
        {...props}
        ref={ref}
        tabIndex={tabIndex}
        style={textStyle(style, wrap)}
        class={mergeClasses(styles.preview, styles.text, resolveClass(classProp, className))}
      >
        {text}
      </pre>
    );
  },
);
