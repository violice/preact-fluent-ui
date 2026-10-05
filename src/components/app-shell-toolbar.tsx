import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { mergeClasses } from '../utils/merge-classes';
import { resolveClass } from '../utils/resolve-class';
import { Toolbar } from './toolbar';
import styles from './app-shell-toolbar.module.css';

export type AppShellToolbarProps = JSX.HTMLAttributes<HTMLDivElement>;

export const AppShellToolbar = /* @__PURE__ */ forwardRef<HTMLDivElement, AppShellToolbarProps>(
  function AppShellToolbar({ children, class: classProp, className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        class={mergeClasses(styles.root, resolveClass(classProp, className))}
      >
        <Toolbar class={styles.inner}>{children}</Toolbar>
      </div>
    );
  },
);
