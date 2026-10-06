import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/cx';
import { resolveClass } from '../../utils/resolve-class';
import { tableAlignClasses } from './table.styles';
import { useTableStyles } from './table-context';

export type TableHeaderCellProps = Omit<JSX.ThHTMLAttributes<HTMLTableCellElement>, 'align'> & {
  align?: 'start' | 'center' | 'end';
};

export const TableHeaderCell = /* @__PURE__ */ forwardRef<
  HTMLTableCellElement,
  TableHeaderCellProps
>(function TableHeaderCell(
  { align = 'start', scope = 'col', class: classProp, className, ...props },
  ref,
) {
  const styles = useTableStyles();
  return (
    <th
      {...props}
      scope={scope}
      ref={ref}
      class={cx(styles.heading, tableAlignClasses({ align }), resolveClass(classProp, className))}
    />
  );
});
