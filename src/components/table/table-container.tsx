import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/cx';
import { resolveClass } from '../../utils/resolve-class';
import styles from './table.styles';

export type TableContainerProps = JSX.HTMLAttributes<HTMLDivElement>;

export const TableContainer = /* @__PURE__ */ forwardRef<HTMLDivElement, TableContainerProps>(
  function TableContainer({ class: classProp, className, ...props }, ref) {
    return (
      <div {...props} ref={ref} class={cx(styles.container, resolveClass(classProp, className))} />
    );
  },
);
