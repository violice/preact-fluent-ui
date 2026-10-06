import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../styling/cx';
import { resolveClass } from '../utils/resolve-class';
import styles from './table.module.css';

export type TableProps = JSX.TableHTMLAttributes<HTMLTableElement> & {
  density?: 'regular' | 'compact';
  dividers?: 'all' | 'between';
};
export type TableContainerProps = JSX.HTMLAttributes<HTMLDivElement>;
export type TableHeaderProps = JSX.HTMLAttributes<HTMLTableSectionElement>;
export type TableBodyProps = JSX.HTMLAttributes<HTMLTableSectionElement>;
export type TableFooterProps = JSX.HTMLAttributes<HTMLTableSectionElement>;
export type TableRowProps = JSX.HTMLAttributes<HTMLTableRowElement>;
export type TableHeaderCellProps = Omit<JSX.ThHTMLAttributes<HTMLTableCellElement>, 'align'> & {
  align?: 'start' | 'center' | 'end';
};
export type TableCellProps = Omit<JSX.TdHTMLAttributes<HTMLTableCellElement>, 'align'> & {
  align?: 'start' | 'center' | 'end';
};
export type TableCaptionProps = JSX.HTMLAttributes<HTMLTableCaptionElement>;

export const Table = /* @__PURE__ */ forwardRef<HTMLTableElement, TableProps>(function Table(
  { density = 'regular', dividers = 'all', class: classProp, className, ...props },
  ref,
) {
  return (
    <table
      {...props}
      ref={ref}
      class={cx(
        styles.table,
        density === 'compact' ? styles.compact : undefined,
        dividers === 'between' ? styles.between : undefined,
        resolveClass(classProp, className),
      )}
    />
  );
});

export const TableContainer = /* @__PURE__ */ forwardRef<HTMLDivElement, TableContainerProps>(
  function TableContainer({ class: classProp, className, ...props }, ref) {
    return (
      <div {...props} ref={ref} class={cx(styles.container, resolveClass(classProp, className))} />
    );
  },
);

export const TableHeader = /* @__PURE__ */ forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  function TableHeader({ class: classProp, className, ...props }, ref) {
    return (
      <thead {...props} ref={ref} class={cx(styles.header, resolveClass(classProp, className))} />
    );
  },
);

export const TableBody = /* @__PURE__ */ forwardRef<HTMLTableSectionElement, TableBodyProps>(
  function TableBody({ class: classProp, className, ...props }, ref) {
    return (
      <tbody {...props} ref={ref} class={cx(styles.body, resolveClass(classProp, className))} />
    );
  },
);

export const TableFooter = /* @__PURE__ */ forwardRef<HTMLTableSectionElement, TableFooterProps>(
  function TableFooter({ class: classProp, className, ...props }, ref) {
    return (
      <tfoot {...props} ref={ref} class={cx(styles.footer, resolveClass(classProp, className))} />
    );
  },
);

export const TableRow = /* @__PURE__ */ forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow({ class: classProp, className, ...props }, ref) {
    return <tr {...props} ref={ref} class={cx(styles.row, resolveClass(classProp, className))} />;
  },
);

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
      class={cx(styles.heading, styles[align], resolveClass(classProp, className))}
    />
  );
});

export const TableCell = /* @__PURE__ */ forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell({ align = 'start', class: classProp, className, ...props }, ref) {
    return (
      <td
        {...props}
        ref={ref}
        class={cx(styles.cell, styles[align], resolveClass(classProp, className))}
      />
    );
  },
);

export const TableCaption = /* @__PURE__ */ forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  function TableCaption({ class: classProp, className, ...props }, ref) {
    return (
      <caption
        {...props}
        ref={ref}
        class={cx(styles.caption, resolveClass(classProp, className))}
      />
    );
  },
);
