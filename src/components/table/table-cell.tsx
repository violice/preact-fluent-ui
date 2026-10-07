import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/runtime/cx';
import { resolveClass } from '../../utils/resolve-class';
import { tableAlignClasses } from './table.styles';
import { useTableStyles } from './table-context';

export type TableCellProps = Omit<JSX.TdHTMLAttributes<HTMLTableCellElement>, 'align'> & {
  align?: 'start' | 'center' | 'end';
};

export const TableCell = /* @__PURE__ */ forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell({ align = 'start', class: classProp, className, ...props }, ref) {
    const styles = useTableStyles();
    return (
      <td
        {...props}
        ref={ref}
        class={cx(styles.cell, tableAlignClasses({ align }), resolveClass(classProp, className))}
      />
    );
  },
);
