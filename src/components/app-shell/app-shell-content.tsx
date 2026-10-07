import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styles';
import { resolveClass } from '../../utils';
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
