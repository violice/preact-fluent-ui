import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/cx';
import { resolveClass } from '../../utils/resolve-class';
import styles from './table.styles';

export type TableFooterProps = JSX.HTMLAttributes<HTMLTableSectionElement>;

export const TableFooter = /* @__PURE__ */ forwardRef<HTMLTableSectionElement, TableFooterProps>(
  function TableFooter({ class: classProp, className, ...props }, ref) {
    return (
      <tfoot {...props} ref={ref} class={cx(styles.footer, resolveClass(classProp, className))} />
    );
  },
);
