import type { ComponentChildren, JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/runtime/cx';
import { resolveClass } from '../../utils/resolve-class';
import styles from './switch.styles';

export type SwitchProps = Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'children' | 'role' | 'indeterminate'
> & {
  label: ComponentChildren;
  classes?: Partial<
    Record<'root' | 'wrapper' | 'label' | 'track' | 'thumb', JSX.Signalish<string | undefined>>
  >;
};

export const Switch = /* @__PURE__ */ forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, class: classProp, className, classes, ...props },
  ref,
) {
  return (
    <label class={cx(styles.wrapper, classes?.wrapper)} hidden={props.hidden}>
      <input
        {...props}
        type="checkbox"
        role="switch"
        ref={ref}
        class={cx(styles.input, resolveClass(classProp, className), classes?.root)}
      />
      <span class={cx(styles.track, classes?.track)} aria-hidden="true">
        <span class={cx(styles.thumb, classes?.thumb)} aria-hidden="true" />
      </span>
      <span class={cx(styles.label, classes?.label)}>{label}</span>
    </label>
  );
});
