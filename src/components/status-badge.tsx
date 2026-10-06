import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { badgeClasses } from './status-badge.styles';
import { cx } from '../styling/cx';
import { resolveClass } from '../utils/resolve-class';

export type StatusBadgeProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  tone?: 'neutral' | 'success' | 'warning' | 'error';
};

export const StatusBadge = /* @__PURE__ */ forwardRef<HTMLSpanElement, StatusBadgeProps>(
  function StatusBadge({ tone = 'neutral', class: classProp, className, ...props }, ref) {
    return (
      <span
        {...props}
        ref={ref}
        class={cx(badgeClasses({ tone }), resolveClass(classProp, className))}
      />
    );
  },
);
