import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/cx';
import { resolveClass } from '../../utils/resolve-class';
import { useAppShellStyles } from './app-shell-context';

export type AppShellContentProps = JSX.HTMLAttributes<HTMLDivElement>;

export const AppShellContent = /* @__PURE__ */ forwardRef<HTMLDivElement, AppShellContentProps>(
  function AppShellContent({ class: classProp, className, ...props }, ref) {
    const styles = useAppShellStyles();
    return (
      <div {...props} ref={ref} class={cx(styles.content, resolveClass(classProp, className))} />
    );
  },
);
