import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/cx';
import { resolveClass } from '../../utils/resolve-class';
import { inputClass } from './input.styles';

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
      class={cx(inputClass, resolveClass(classProp, className))}
    />
  );
});
