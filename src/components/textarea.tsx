import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../styling/cx';
import { resolveClass } from '../utils/resolve-class';
import styles from './textarea.module.css';

export type TextareaProps = JSX.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = /* @__PURE__ */ forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ class: classProp, className, ...props }, ref) {
    return (
      <textarea
        {...props}
        ref={ref}
        class={cx(styles.textarea, resolveClass(classProp, className))}
      />
    );
  },
);
