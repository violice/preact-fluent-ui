import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styles';
import { resolveClass } from '../../utils';
import { counterBadgeClass } from './counter-badge.styles';

export type CounterBadgeProps = JSX.HTMLAttributes<HTMLSpanElement>;

export const CounterBadge = /* @__PURE__ */ forwardRef<HTMLSpanElement, CounterBadgeProps>(
  function CounterBadge({ class: classProp, className, ...props }, ref) {
    return (
      <span
        {...props}
        ref={ref}
        class={cx(counterBadgeClass, resolveClass(classProp, className))}
      />
    );
  },
);
