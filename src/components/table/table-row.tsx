import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/cx';
import { resolveClass } from '../../utils/resolve-class';
import styles from './table.styles';

export type TableRowProps = JSX.HTMLAttributes<HTMLTableRowElement>;

export const TableRow = /* @__PURE__ */ forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow({ class: classProp, className, ...props }, ref) {
    return <tr {...props} ref={ref} class={cx(styles.row, resolveClass(classProp, className))} />;
  },
);
