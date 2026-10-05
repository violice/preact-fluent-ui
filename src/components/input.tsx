import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { mergeClasses } from '../utils/merge-classes';
import { resolveClass } from '../utils/resolve-class';
import styles from './input.module.css';

export type InputProps = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  type?: 'text' | 'search' | 'email' | 'url' | 'tel' | 'password' | 'number';
};

export const Input = /* @__PURE__ */ forwardRef<HTMLInputElement, InputProps>(function Input(
  { class: classProp, className, type = 'text', ...props },
  ref,
) {
  return (
    <input
      {...props}
      ref={ref}
      type={type}
      class={mergeClasses(styles.input, resolveClass(classProp, className))}
    />
  );
});
