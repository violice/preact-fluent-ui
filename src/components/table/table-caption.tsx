import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styles';
import { resolveClass } from '../../utils';
import { useTableStyles } from './table-context';

export type TableCaptionProps = JSX.HTMLAttributes<HTMLTableCaptionElement>;

export const TableCaption = /* @__PURE__ */ forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  function TableCaption({ class: classProp, className, ...props }, ref) {
    const styles = useTableStyles();
    return (
      <caption
        {...props}
        ref={ref}
        class={cx(styles.caption, resolveClass(classProp, className))}
      />
    );
  },
);
