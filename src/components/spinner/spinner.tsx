import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/runtime/cx';
import { resolveClass } from '../../utils/resolve-class';
import { spinnerClasses } from './spinner.styles';

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
  const styles = spinnerClasses({ size });
  return (
    <span
      {...props}
      ref={ref}
      class={cx(styles.spinner, resolveClass(classProp, className), classes?.root)}
      role={label ? 'status' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
    >
      <span aria-hidden="true" class={cx(styles.indicator, classes?.indicator)} />
      {label && <span class={cx(styles.label, classes?.label)}>{label}</span>}
    </span>
  );
});
