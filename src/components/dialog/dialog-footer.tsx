import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styles';
import { resolveClass } from '../../utils';
import { dialogFooterClass } from './dialog-content.styles';

export type DialogFooterProps = JSX.HTMLAttributes<HTMLElement>;

export const DialogFooter = /* @__PURE__ */ forwardRef<HTMLElement, DialogFooterProps>(
  function DialogFooter({ class: classProp, className, ...props }, ref) {
    return (
      <footer
        {...props}
        ref={ref}
        class={cx(dialogFooterClass, resolveClass(classProp, className))}
      />
    );
  },
);
