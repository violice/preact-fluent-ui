import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { mergeClasses } from '../utils/merge-classes';
import { resolveClass } from '../utils/resolve-class';
import styles from './textarea.module.css';

export type TextareaProps = JSX.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = /* @__PURE__ */ forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ class: classProp, className, ...props }, ref) {
    return (
      <textarea
        {...props}
        ref={ref}
        class={mergeClasses(styles.textarea, resolveClass(classProp, className))}
      />
    );
  },
);
