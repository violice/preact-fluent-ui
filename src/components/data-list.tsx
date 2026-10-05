import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { mergeClasses } from '../utils/merge-classes';
import { resolveClass } from '../utils/resolve-class';
import styles from './data-list.module.css';

export type DataListProps = JSX.HTMLAttributes<HTMLDListElement> & {
  direction?: 'horizontal' | 'vertical';
};
export type DataListItemProps = JSX.HTMLAttributes<HTMLDivElement>;
export type DataListLabelProps = JSX.HTMLAttributes<HTMLElement>;
export type DataListValueProps = JSX.HTMLAttributes<HTMLElement>;

export const DataList = /* @__PURE__ */ forwardRef<HTMLDListElement, DataListProps>(
  function DataList({ direction = 'horizontal', class: classProp, className, ...props }, ref) {
    return (
      <dl
        {...props}
        ref={ref}
        class={mergeClasses(styles.list, styles[direction], resolveClass(classProp, className))}
      />
    );
  },
);
export const DataListItem = /* @__PURE__ */ forwardRef<HTMLDivElement, DataListItemProps>(
  function DataListItem({ class: classProp, className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        class={mergeClasses(styles.item, resolveClass(classProp, className))}
      />
    );
  },
);
export const DataListLabel = /* @__PURE__ */ forwardRef<HTMLElement, DataListLabelProps>(
  function DataListLabel({ class: classProp, className, ...props }, ref) {
    return (
      <dt
        {...props}
        ref={ref}
        class={mergeClasses(styles.label, resolveClass(classProp, className))}
      />
    );
  },
);
export const DataListValue = /* @__PURE__ */ forwardRef<HTMLElement, DataListValueProps>(
  function DataListValue({ class: classProp, className, ...props }, ref) {
    return (
      <dd
        {...props}
        ref={ref}
        class={mergeClasses(styles.value, resolveClass(classProp, className))}
      />
    );
  },
);
