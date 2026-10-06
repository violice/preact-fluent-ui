import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../styling/cx';
import { resolveClass } from '../utils/resolve-class';
import styles from './spinner.module.css';

export type SpinnerProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  size?: 'small' | 'medium' | 'large';
  label?: string;
  classes?: {
    root?: JSX.Signalish<string | undefined>;
    indicator?: JSX.Signalish<string | undefined>;
    label?: JSX.Signalish<string | undefined>;
  };
};

export const Spinner = /* @__PURE__ */ forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 'medium', label, classes, class: classProp, className, ...props },
  ref,
): JSX.Element {
  return (
    <span
      {...props}
      ref={ref}
      class={cx(styles.spinner, resolveClass(classProp, className), classes?.root)}
      role={label ? 'status' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
    >
      <span aria-hidden="true" class={cx(styles.indicator, styles[size], classes?.indicator)} />
      {label && <span class={cx(styles.label, classes?.label)}>{label}</span>}
    </span>
  );
});
