import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/cx';
import { resolveClass } from '../../utils/resolve-class';
import styles from './table.styles';

export type TableHeaderProps = JSX.HTMLAttributes<HTMLTableSectionElement>;

export const TableHeader = /* @__PURE__ */ forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  function TableHeader({ class: classProp, className, ...props }, ref) {
    return (
      <thead {...props} ref={ref} class={cx(styles.header, resolveClass(classProp, className))} />
    );
  },
);
