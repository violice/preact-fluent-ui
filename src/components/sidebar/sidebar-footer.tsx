import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styles';
import { resolveClass } from '../../utils';
import { useSidebarStyles } from './sidebar-context';

export type SidebarFooterProps = JSX.HTMLAttributes<HTMLDivElement>;

export const SidebarFooter = /* @__PURE__ */ forwardRef<HTMLDivElement, SidebarFooterProps>(
  function SidebarFooter({ class: classProp, className, ...props }, ref) {
    const styles = useSidebarStyles();
    return (
      <div {...props} ref={ref} class={cx(styles.footer, resolveClass(classProp, className))} />
    );
  },
);
