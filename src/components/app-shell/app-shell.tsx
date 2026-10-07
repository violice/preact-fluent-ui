import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/runtime/cx';
import { resolveClass } from '../../utils/resolve-class';
import { sidebarValue } from '../sidebar/sidebar-context';
import type { SidebarLayout } from '../sidebar/index';
import { appShellClasses } from './app-shell.styles';
import { AppShellContext } from './app-shell-context';

export type AppShellProps = JSX.HTMLAttributes<HTMLDivElement> & {
  navigationLayout?: JSX.Signalish<SidebarLayout>;
};

export const AppShell = /* @__PURE__ */ forwardRef<HTMLDivElement, AppShellProps>(function AppShell(
  { navigationLayout = 'expanded', class: classProp, className, ...props },
  ref,
) {
  const layout = sidebarValue(navigationLayout);
  const styles = appShellClasses({ navigationLayout: layout });
  return (
    <AppShellContext.Provider value={styles}>
      <div
        {...props}
        data-navigation-layout={layout}
        ref={ref}
        class={cx(styles.shell, resolveClass(classProp, className))}
      />
    </AppShellContext.Provider>
  );
});
