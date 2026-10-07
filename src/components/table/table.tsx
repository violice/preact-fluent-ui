import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/runtime/cx';
import { resolveClass } from '../../utils/resolve-class';
import { tableClasses } from './table.styles';
import { TableContext } from './table-context';

export type TableProps = JSX.TableHTMLAttributes<HTMLTableElement> & {
  density?: 'regular' | 'compact';
  dividers?: 'all' | 'between';
};

export const Table = /* @__PURE__ */ forwardRef<HTMLTableElement, TableProps>(function Table(
  { density = 'regular', dividers = 'all', class: classProp, className, ...props },
  ref,
) {
  const styles = tableClasses({ density, dividers });
  return (
    <TableContext.Provider value={styles}>
      <table {...props} ref={ref} class={cx(styles.table, resolveClass(classProp, className))} />
    </TableContext.Provider>
  );
});
