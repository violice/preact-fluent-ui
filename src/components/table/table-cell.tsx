import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/cx';
import { resolveClass } from '../../utils/resolve-class';
import styles, { tableAlignClasses } from './table.styles';

export type TableCellProps = Omit<JSX.TdHTMLAttributes<HTMLTableCellElement>, 'align'> & {
  align?: 'start' | 'center' | 'end';
};

export const TableCell = /* @__PURE__ */ forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell({ align = 'start', class: classProp, className, ...props }, ref) {
    return (
      <td
        {...props}
        ref={ref}
        class={cx(styles.cell, tableAlignClasses({ align }), resolveClass(classProp, className))}
      />
    );
  },
);
