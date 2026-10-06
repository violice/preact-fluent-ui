import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/cx';
import { resolveClass } from '../../utils/resolve-class';
import styles from './table.styles';

export type TableCaptionProps = JSX.HTMLAttributes<HTMLTableCaptionElement>;

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
