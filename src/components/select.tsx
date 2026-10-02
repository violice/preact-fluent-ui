import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { mergeClasses } from '../classes';
import { Icon } from '../icons/icon';
import styles from './select.module.css';

export type SelectProps = JSX.SelectHTMLAttributes<HTMLSelectElement> & {
  wrapperClassName?: string;
};

export const Select = /* @__PURE__ */ forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { class: classProp, className, wrapperClassName, children, ...props },
  ref,
) {
  return (
    <span class={mergeClasses(styles.control, wrapperClassName)}>
      <select {...props} ref={ref} class={mergeClasses(styles.select, classProp, className)}>
        {children}
      </select>
      <Icon name="chevron-down" size={16} className={styles.chevron} />
    </span>
  );
});
