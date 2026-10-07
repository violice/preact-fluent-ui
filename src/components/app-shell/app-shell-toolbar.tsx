import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styles';
import { resolveClass } from '../../utils';
import { Toolbar } from '../toolbar/index';
import { appShellToolbarStyles } from './app-shell-toolbar.styles';

export type AppShellToolbarProps = JSX.HTMLAttributes<HTMLDivElement>;

export const AppShellToolbar = /* @__PURE__ */ forwardRef<HTMLDivElement, AppShellToolbarProps>(
  function AppShellToolbar({ children, class: classProp, className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        class={cx(appShellToolbarStyles.root, resolveClass(classProp, className))}
      >
        <Toolbar class={appShellToolbarStyles.inner}>{children}</Toolbar>
      </div>
    );
  },
);
