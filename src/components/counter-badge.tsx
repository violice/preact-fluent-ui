import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { mergeClasses } from '../utils/merge-classes';
import { resolveClass } from '../utils/resolve-class';
import styles from './counter-badge.module.css';

export type CounterBadgeProps = JSX.HTMLAttributes<HTMLSpanElement>;

export const CounterBadge = /* @__PURE__ */ forwardRef<HTMLSpanElement, CounterBadgeProps>(
  function CounterBadge({ class: classProp, className, ...props }, ref) {
    return (
      <span
        {...props}
        ref={ref}
        class={mergeClasses(styles.badge, resolveClass(classProp, className))}
      />
    );
  },
);
