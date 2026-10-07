import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styles';
import { resolveClass } from '../../utils';
import { disclosureStyles } from './disclosure.styles';

export type DisclosureContentProps = JSX.HTMLAttributes<HTMLDivElement>;

export const DisclosureContent = /* @__PURE__ */ forwardRef<HTMLDivElement, DisclosureContentProps>(
  function DisclosureContent({ class: classProp, className, ...props }, ref): JSX.Element {
    return (
      <div
        {...props}
        ref={ref}
        class={cx(disclosureStyles.content, resolveClass(classProp, className))}
      />
    );
  },
);
