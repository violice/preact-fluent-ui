import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { mergeClasses, resolveClass } from '../classes';
import { sidebarValue } from './sidebar-context';
import type { SidebarLayout } from './sidebar';
import styles from './app-shell.module.css';

export type AppShellProps = JSX.HTMLAttributes<HTMLDivElement> & {
  navigationLayout?: JSX.Signalish<SidebarLayout>;
};
export type AppShellWorkspaceProps = JSX.HTMLAttributes<HTMLElement>;
export type AppShellHeaderProps = JSX.HTMLAttributes<HTMLDivElement>;
export type AppShellContentProps = JSX.HTMLAttributes<HTMLDivElement>;
export type AppShellFooterProps = JSX.HTMLAttributes<HTMLDivElement>;

export const AppShell = /* @__PURE__ */ forwardRef<HTMLDivElement, AppShellProps>(function AppShell(
  { navigationLayout = 'expanded', class: classProp, className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      data-navigation-layout={sidebarValue(navigationLayout)}
      ref={ref}
      class={mergeClasses(styles.shell, resolveClass(classProp, className))}
    />
  );
});
export const AppShellWorkspace = /* @__PURE__ */ forwardRef<HTMLElement, AppShellWorkspaceProps>(
  function AppShellWorkspace({ class: classProp, className, ...props }, ref) {
    return (
      <main
        {...props}
        data-app-shell-workspace=""
        ref={ref}
        class={mergeClasses(styles.workspace, resolveClass(classProp, className))}
      />
    );
  },
);
export const AppShellHeader = /* @__PURE__ */ forwardRef<HTMLDivElement, AppShellHeaderProps>(
  function AppShellHeader({ class: classProp, className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        class={mergeClasses(styles.header, resolveClass(classProp, className))}
      />
    );
  },
);
export const AppShellContent = /* @__PURE__ */ forwardRef<HTMLDivElement, AppShellContentProps>(
  function AppShellContent({ class: classProp, className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        class={mergeClasses(styles.content, resolveClass(classProp, className))}
      />
    );
  },
);
export const AppShellFooter = /* @__PURE__ */ forwardRef<HTMLDivElement, AppShellFooterProps>(
  function AppShellFooter({ class: classProp, className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        class={mergeClasses(styles.footer, resolveClass(classProp, className))}
      />
    );
  },
);
