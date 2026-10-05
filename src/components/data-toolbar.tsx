import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { mergeClasses } from '../utils/merge-classes';
import { resolveClass } from '../utils/resolve-class';
import styles from './data-toolbar.module.css';

export type DataToolbarProps = JSX.HTMLAttributes<HTMLDivElement>;
export type DataToolbarGroupProps = JSX.HTMLAttributes<HTMLDivElement> & {
  align?: 'start' | 'end';
};
export const DataToolbar = /* @__PURE__ */ forwardRef<HTMLDivElement, DataToolbarProps>(
  function DataToolbar({ class: classProp, className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        class={mergeClasses(styles.toolbar, resolveClass(classProp, className))}
      />
    );
  },
);
export const DataToolbarGroup = /* @__PURE__ */ forwardRef<HTMLDivElement, DataToolbarGroupProps>(
  function DataToolbarGroup({ align = 'start', class: classProp, className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        class={mergeClasses(
          styles.group,
          align === 'end' ? styles.end : undefined,
          resolveClass(classProp, className),
        )}
      />
    );
  },
);
