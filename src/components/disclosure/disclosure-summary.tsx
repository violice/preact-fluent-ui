import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/cx';
import { resolveClass } from '../../utils/resolve-class';
import styles from './disclosure.styles';

export type DisclosureSummaryProps = JSX.HTMLAttributes<HTMLElement>;

export const DisclosureSummary = /* @__PURE__ */ forwardRef<HTMLElement, DisclosureSummaryProps>(
  function DisclosureSummary({ class: classProp, className, ...props }, ref): JSX.Element {
    return (
      <summary
        {...props}
        ref={ref}
        class={cx(styles.summary, resolveClass(classProp, className))}
      />
    );
  },
);
