import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styles';
import { resolveClass } from '../../utils';
import { disclosureStyles } from './disclosure.styles';

export type DisclosureSummaryProps = JSX.HTMLAttributes<HTMLElement>;

export const DisclosureSummary = /* @__PURE__ */ forwardRef<HTMLElement, DisclosureSummaryProps>(
  function DisclosureSummary({ class: classProp, className, ...props }, ref): JSX.Element {
    return (
      <summary
        {...props}
        ref={ref}
        class={cx(disclosureStyles.summary, resolveClass(classProp, className))}
      />
    );
  },
);
