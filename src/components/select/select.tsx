import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/cx';
import { resolveClass } from '../../utils/resolve-class';
import { Icon } from '../../icons/icon';
import styles from './select.styles';

export type SelectProps = JSX.SelectHTMLAttributes<HTMLSelectElement> & {
  classes?: Partial<Record<'root' | 'wrapper' | 'icon', JSX.Signalish<string | undefined>>>;
};

export const Select = /* @__PURE__ */ forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { class: classProp, className, classes, children, ...props },
  ref,
) {
  return (
    <span class={cx(styles.control, classes?.wrapper)}>
      <select
        {...props}
        ref={ref}
        class={cx(styles.select, resolveClass(classProp, className), classes?.root)}
      >
        {children}
      </select>
      <Icon name="chevron-down" size={16} class={cx(styles.chevron, classes?.icon)} />
    </span>
  );
});
