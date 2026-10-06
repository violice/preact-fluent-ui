import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/cx';
import { resolveClass } from '../../utils/resolve-class';
import { useTableStyles } from './table-context';

export type TableRowProps = JSX.HTMLAttributes<HTMLTableRowElement>;

export const TableRow = /* @__PURE__ */ forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow({ class: classProp, className, ...props }, ref) {
    const styles = useTableStyles();
    return <tr {...props} ref={ref} class={cx(styles.row, resolveClass(classProp, className))} />;
  },
);
