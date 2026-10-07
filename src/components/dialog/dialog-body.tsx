import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/runtime/cx';
import { resolveClass } from '../../utils/resolve-class';
import { dialogBodyClass } from './dialog-content.styles';

export type DialogBodyProps = JSX.HTMLAttributes<HTMLDivElement>;

export const DialogBody = /* @__PURE__ */ forwardRef<HTMLDivElement, DialogBodyProps>(
  function DialogBody({ class: classProp, className, ...props }, ref) {
    return (
      <div {...props} ref={ref} class={cx(dialogBodyClass, resolveClass(classProp, className))} />
    );
  },
);
