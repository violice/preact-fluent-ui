import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/runtime/cx';
import { resolveClass } from '../../utils/resolve-class';
import { disclosureClasses } from './disclosure.styles';

export type DisclosureProps = JSX.DetailsHTMLAttributes<HTMLDetailsElement> & {
  appearance?: 'default' | 'card';
};

export const Disclosure = /* @__PURE__ */ forwardRef<HTMLDetailsElement, DisclosureProps>(
  function Disclosure(
    { appearance = 'default', class: classProp, className, ...props },
    ref,
  ): JSX.Element {
    return (
      <details
        {...props}
        ref={ref}
        class={cx(disclosureClasses({ appearance }).disclosure, resolveClass(classProp, className))}
      />
    );
  },
);
