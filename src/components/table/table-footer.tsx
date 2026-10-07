import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styles';
import { resolveClass } from '../../utils';
import { useTableStyles } from './table-context';

export type TableFooterProps = JSX.HTMLAttributes<HTMLTableSectionElement>;

export const TableFooter = /* @__PURE__ */ forwardRef<HTMLTableSectionElement, TableFooterProps>(
  function TableFooter({ class: classProp, className, ...props }, ref) {
    const styles = useTableStyles();
    return (
      <tfoot {...props} ref={ref} class={cx(styles.footer, resolveClass(classProp, className))} />
    );
  },
);
