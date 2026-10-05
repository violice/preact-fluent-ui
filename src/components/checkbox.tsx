import type { ComponentChildren, JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { useCallback, useLayoutEffect, useRef } from 'preact/hooks';
import { mergeClasses } from '../utils/merge-classes';
import { resolveClass } from '../utils/resolve-class';
import styles from './checkbox.module.css';

export type CheckboxProps = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'> & {
  label: ComponentChildren;
  indeterminate?: boolean;
  classes?: Partial<
    Record<'root' | 'wrapper' | 'label' | 'indicator', JSX.Signalish<string | undefined>>
  >;
};

export const Checkbox = /* @__PURE__ */ forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    { label, indeterminate = false, class: classProp, className, classes, ...props },
    ref,
  ) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const setRef = useCallback(
      (input: HTMLInputElement | null) => {
        inputRef.current = input;
        if (typeof ref === 'function') ref(input);
        else if (ref) ref.current = input;
      },
      [ref],
    );

    useLayoutEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = indeterminate;
    }, [props.checked, indeterminate]);

    return (
      <label class={mergeClasses(styles.wrapper, classes?.wrapper)} hidden={props.hidden}>
        <input
          {...props}
          type="checkbox"
          ref={setRef}
          class={mergeClasses(styles.input, resolveClass(classProp, className), classes?.root)}
        />
        <span class={mergeClasses(styles.indicator, classes?.indicator)} aria-hidden="true" />
        <span class={mergeClasses(styles.label, classes?.label)}>{label}</span>
      </label>
    );
  },
);
