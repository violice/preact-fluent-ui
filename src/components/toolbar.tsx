import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../styling/cx';
import { resolveClass } from '../utils/resolve-class';
import styles from './toolbar.module.css';

export type ToolbarProps = JSX.HTMLAttributes<HTMLDivElement>;
export type ToolbarGroupProps = JSX.HTMLAttributes<HTMLDivElement> & {
  align?: 'start' | 'end';
};
export const Toolbar = /* @__PURE__ */ forwardRef<HTMLDivElement, ToolbarProps>(function Toolbar(
  { class: classProp, className, ...props },
  ref,
) {
  return (
    <div {...props} ref={ref} class={cx(styles.toolbar, resolveClass(classProp, className))} />
  );
});
export const ToolbarGroup = /* @__PURE__ */ forwardRef<HTMLDivElement, ToolbarGroupProps>(
  function ToolbarGroup({ align = 'start', class: classProp, className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        class={cx(
          styles.group,
          align === 'end' ? styles.end : undefined,
          resolveClass(classProp, className),
        )}
      />
    );
  },
);
