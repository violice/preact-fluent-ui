import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/runtime/cx';
import { resolveClass } from '../../utils/resolve-class';
import { useTableStyles } from './table-context';

export type TableHeaderProps = JSX.HTMLAttributes<HTMLTableSectionElement>;

export const TableHeader = /* @__PURE__ */ forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  function TableHeader({ class: classProp, className, ...props }, ref) {
    const styles = useTableStyles();
    return (
      <thead {...props} ref={ref} class={cx(styles.header, resolveClass(classProp, className))} />
    );
  },
);
