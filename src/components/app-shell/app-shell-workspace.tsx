import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styles';
import { resolveClass } from '../../utils';
import { useAppShellStyles } from './app-shell-context';

export type AppShellWorkspaceProps = JSX.HTMLAttributes<HTMLElement>;

export const AppShellWorkspace = /* @__PURE__ */ forwardRef<HTMLElement, AppShellWorkspaceProps>(
  function AppShellWorkspace({ class: classProp, className, ...props }, ref) {
    const styles = useAppShellStyles();
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
