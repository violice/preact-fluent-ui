import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/cx';
import { resolveClass } from '../../utils/resolve-class';
import styles from './dialog-content.styles';

export type DialogFooterProps = JSX.HTMLAttributes<HTMLElement>;

export const DialogFooter = /* @__PURE__ */ forwardRef<HTMLElement, DialogFooterProps>(
  function DialogFooter({ class: classProp, className, ...props }, ref) {
    return (
      <footer {...props} ref={ref} class={cx(styles.actions, resolveClass(classProp, className))} />
    );
  },
);
