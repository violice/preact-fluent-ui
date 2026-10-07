import type { ComponentChildren, JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { useCallback, useLayoutEffect, useRef } from 'preact/hooks';
import { cx } from '../../styling/runtime/cx';
import { resolveClass } from '../../utils/resolve-class';
import styles from './checkbox.styles';

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
      <label class={cx(styles.wrapper, classes?.wrapper)} hidden={props.hidden}>
        <input
          {...props}
          type="checkbox"
          ref={setRef}
          class={cx(styles.input, resolveClass(classProp, className), classes?.root)}
        />
        <span class={cx(styles.indicator, classes?.indicator)} aria-hidden="true" />
        <span class={cx(styles.label, classes?.label)}>{label}</span>
      </label>
    );
  },
);
