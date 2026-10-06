import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/cx';
import { resolveClass } from '../../utils/resolve-class';
import styles from './app-shell.styles';

export type AppShellWorkspaceProps = JSX.HTMLAttributes<HTMLElement>;

export const AppShellWorkspace = /* @__PURE__ */ forwardRef<HTMLElement, AppShellWorkspaceProps>(
  function AppShellWorkspace({ class: classProp, className, ...props }, ref) {
    return (
      <main
        {...props}
        data-app-shell-workspace=""
        ref={ref}
        class={cx(styles.workspace, resolveClass(classProp, className))}
      />
    );
  },
);
