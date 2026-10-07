import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styles';
import { resolveClass } from '../../utils';
import { useAppShellStyles } from './app-shell-context';

export type AppShellHeaderProps = JSX.HTMLAttributes<HTMLDivElement>;

export const AppShellHeader = /* @__PURE__ */ forwardRef<HTMLDivElement, AppShellHeaderProps>(
  function AppShellHeader({ class: classProp, className, ...props }, ref) {
    const styles = useAppShellStyles();
    return (
      <div {...props} ref={ref} class={cx(styles.header, resolveClass(classProp, className))} />
    );
  },
);
