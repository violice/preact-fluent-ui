import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styles';
import { resolveClass } from '../../utils';
import { Icon } from '../icon/icon';
import { selectStyles } from './select.styles';

export type SelectProps = JSX.SelectHTMLAttributes<HTMLSelectElement> & {
  classes?: Partial<Record<'root' | 'wrapper' | 'icon', JSX.Signalish<string | undefined>>>;
};

export const Select = /* @__PURE__ */ forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { class: classProp, className, classes, children, ...props },
  ref,
) {
  return (
    <span class={cx(selectStyles.control, classes?.wrapper)}>
      <select
        {...props}
        ref={ref}
        class={cx(selectStyles.select, resolveClass(classProp, className), classes?.root)}
      >
        {children}
      </select>
      <Icon name="chevron-down" size={16} class={cx(selectStyles.chevron, classes?.icon)} />
    </span>
  );
});
