import type { FunctionComponent, JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/cx';
import { resolveClass } from '../../utils/resolve-class';
import styles from './sidebar.styles';

export type SidebarNavProps = JSX.HTMLAttributes<HTMLElement> &
  (
    | { 'aria-label': NonNullable<JSX.HTMLAttributes<HTMLElement>['aria-label']> }
    | { 'aria-labelledby': NonNullable<JSX.HTMLAttributes<HTMLElement>['aria-labelledby']> }
  );

export const SidebarNav: FunctionComponent<SidebarNavProps> = /* @__PURE__ */ forwardRef<
  HTMLElement,
  SidebarNavProps
>(function SidebarNav({ class: classProp, className, ...props }, ref) {
  return <nav {...props} ref={ref} class={cx(styles.nav, resolveClass(classProp, className))} />;
});
