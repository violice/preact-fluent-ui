import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/runtime/cx';
import { resolveClass } from '../../utils/resolve-class';
import { Toolbar } from '../toolbar/index';
import styles from './app-shell-toolbar.styles';

export type AppShellToolbarProps = JSX.HTMLAttributes<HTMLDivElement>;

export const AppShellToolbar = /* @__PURE__ */ forwardRef<HTMLDivElement, AppShellToolbarProps>(
  function AppShellToolbar({ children, class: classProp, className, ...props }, ref) {
    return (
      <div {...props} ref={ref} class={cx(styles.root, resolveClass(classProp, className))}>
        <Toolbar class={styles.inner}>{children}</Toolbar>
      </div>
    );
  },
);
