import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/cx';
import { resolveClass } from '../../utils/resolve-class';
import { useSidebarStyles } from './sidebar-context';

export type SidebarHeaderProps = JSX.HTMLAttributes<HTMLDivElement>;

export const SidebarHeader = /* @__PURE__ */ forwardRef<HTMLDivElement, SidebarHeaderProps>(
  function SidebarHeader({ class: classProp, className, ...props }, ref) {
    const styles = useSidebarStyles();
    return (
      <div {...props} ref={ref} class={cx(styles.header, resolveClass(classProp, className))} />
    );
  },
);
