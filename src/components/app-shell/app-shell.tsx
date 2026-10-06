import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/cx';
import { resolveClass } from '../../utils/resolve-class';
import { sidebarValue } from '../sidebar/sidebar-context';
import type { SidebarLayout } from '../sidebar/index';
import styles from './app-shell.styles';

export type AppShellProps = JSX.HTMLAttributes<HTMLDivElement> & {
  navigationLayout?: JSX.Signalish<SidebarLayout>;
};

export const AppShell = /* @__PURE__ */ forwardRef<HTMLDivElement, AppShellProps>(function AppShell(
  { navigationLayout = 'expanded', class: classProp, className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      data-navigation-layout={sidebarValue(navigationLayout)}
      ref={ref}
      class={cx(styles.shell, resolveClass(classProp, className))}
    />
  );
});
