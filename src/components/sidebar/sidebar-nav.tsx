import type { FunctionComponent, JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styles';
import { resolveClass } from '../../utils';
import { useSidebarStyles } from './sidebar-context';

export type SidebarNavProps = JSX.HTMLAttributes<HTMLElement> &
  (
    | { 'aria-label': NonNullable<JSX.HTMLAttributes<HTMLElement>['aria-label']> }
    | { 'aria-labelledby': NonNullable<JSX.HTMLAttributes<HTMLElement>['aria-labelledby']> }
  );

export const SidebarNav: FunctionComponent<SidebarNavProps> = /* @__PURE__ */ forwardRef<
  HTMLElement,
  SidebarNavProps
>(function SidebarNav({ class: classProp, className, ...props }, ref) {
  const styles = useSidebarStyles();
  return <nav {...props} ref={ref} class={cx(styles.nav, resolveClass(classProp, className))} />;
});
