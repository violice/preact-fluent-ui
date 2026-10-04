import type { ComponentChildren, JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { mergeClasses, resolveClass } from '../classes';
import styles from './switch.module.css';

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
    <label class={mergeClasses(styles.wrapper, classes?.wrapper)} hidden={props.hidden}>
      <input
        {...props}
        type="checkbox"
        role="switch"
        ref={ref}
        class={mergeClasses(styles.input, resolveClass(classProp, className), classes?.root)}
      />
      <span class={mergeClasses(styles.track, classes?.track)} aria-hidden="true">
        <span class={mergeClasses(styles.thumb, classes?.thumb)} aria-hidden="true" />
      </span>
      <span class={mergeClasses(styles.label, classes?.label)}>{label}</span>
    </label>
  );
});
