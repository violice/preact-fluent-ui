import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/cx';
import { resolveClass } from '../../utils/resolve-class';
import styles, { tableAlignClasses } from './table.styles';

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
  return (
    <th
      {...props}
      scope={scope}
      ref={ref}
      class={cx(styles.heading, tableAlignClasses({ align }), resolveClass(classProp, className))}
    />
  );
});
