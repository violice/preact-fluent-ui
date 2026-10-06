import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/cx';
import { resolveClass } from '../../utils/resolve-class';
import styles from './sidebar.styles';

export type SidebarFooterProps = JSX.HTMLAttributes<HTMLDivElement>;

export const SidebarFooter = /* @__PURE__ */ forwardRef<HTMLDivElement, SidebarFooterProps>(
  function SidebarFooter({ class: classProp, className, ...props }, ref) {
    return (
      <div {...props} ref={ref} class={cx(styles.footer, resolveClass(classProp, className))} />
    );
  },
);
