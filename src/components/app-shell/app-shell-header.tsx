import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/cx';
import { resolveClass } from '../../utils/resolve-class';
import styles from './app-shell.styles';

export type AppShellHeaderProps = JSX.HTMLAttributes<HTMLDivElement>;

export const AppShellHeader = /* @__PURE__ */ forwardRef<HTMLDivElement, AppShellHeaderProps>(
  function AppShellHeader({ class: classProp, className, ...props }, ref) {
    return (
      <div {...props} ref={ref} class={cx(styles.header, resolveClass(classProp, className))} />
    );
  },
);
