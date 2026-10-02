import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cva } from 'class-variance-authority';
import { mergeClasses } from '../classes';
import styles from './status-badge.module.css';

const badgeClasses = cva(styles.badge, {
  variants: {
    tone: { neutral: null, success: styles.success, warning: styles.warning, error: styles.error },
  },
  defaultVariants: { tone: 'neutral' },
});

export type StatusBadgeProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  tone?: 'neutral' | 'success' | 'warning' | 'error';
};

export const StatusBadge = /* @__PURE__ */ forwardRef<HTMLSpanElement, StatusBadgeProps>(
  function StatusBadge({ tone = 'neutral', class: classProp, className, ...props }, ref) {
    return (
      <span
        {...props}
        ref={ref}
        class={mergeClasses(badgeClasses({ tone }), classProp, className)}
      />
    );
  },
);
