import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { mergeClasses, resolveClass } from '../classes';
import { Icon } from '../icons/icon';
import styles from './select.module.css';

export type SelectProps = JSX.SelectHTMLAttributes<HTMLSelectElement> & {
  classes?: Partial<Record<'root' | 'wrapper' | 'icon', JSX.Signalish<string | undefined>>>;
};

export const Select = /* @__PURE__ */ forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { class: classProp, className, classes, children, ...props },
  ref,
) {
  return (
    <span class={mergeClasses(styles.control, classes?.wrapper)}>
      <select
        {...props}
        ref={ref}
        class={mergeClasses(styles.select, resolveClass(classProp, className), classes?.root)}
      >
        {children}
      </select>
      <Icon name="chevron-down" size={16} class={mergeClasses(styles.chevron, classes?.icon)} />
    </span>
  );
});
