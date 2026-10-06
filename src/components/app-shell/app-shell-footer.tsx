import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/cx';
import { resolveClass } from '../../utils/resolve-class';
import styles from './app-shell.styles';

export type AppShellFooterProps = JSX.HTMLAttributes<HTMLDivElement>;

export const AppShellFooter = /* @__PURE__ */ forwardRef<HTMLDivElement, AppShellFooterProps>(
  function AppShellFooter({ class: classProp, className, ...props }, ref) {
    return (
      <div {...props} ref={ref} class={cx(styles.footer, resolveClass(classProp, className))} />
    );
  },
);
