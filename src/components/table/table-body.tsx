import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/cx';
import { resolveClass } from '../../utils/resolve-class';
import styles from './table.styles';

export type TableBodyProps = JSX.HTMLAttributes<HTMLTableSectionElement>;

export const TableBody = /* @__PURE__ */ forwardRef<HTMLTableSectionElement, TableBodyProps>(
  function TableBody({ class: classProp, className, ...props }, ref) {
    return (
      <tbody {...props} ref={ref} class={cx(styles.body, resolveClass(classProp, className))} />
    );
  },
);
