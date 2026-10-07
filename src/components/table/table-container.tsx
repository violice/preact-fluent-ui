import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styles';
import { resolveClass } from '../../utils';
import { useTableStyles } from './table-context';

export type TableContainerProps = JSX.HTMLAttributes<HTMLDivElement>;

export const TableContainer = /* @__PURE__ */ forwardRef<HTMLDivElement, TableContainerProps>(
  function TableContainer({ class: classProp, className, ...props }, ref) {
    const styles = useTableStyles();
    return (
      <div {...props} ref={ref} class={cx(styles.container, resolveClass(classProp, className))} />
    );
  },
);
