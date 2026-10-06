import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../styling/cx';
import { resolveClass } from '../utils/resolve-class';
import styles from './disclosure.module.css';

export type DisclosureProps = JSX.DetailsHTMLAttributes<HTMLDetailsElement> & {
  appearance?: 'default' | 'card';
};
export type DisclosureSummaryProps = JSX.HTMLAttributes<HTMLElement>;
export type DisclosureContentProps = JSX.HTMLAttributes<HTMLDivElement>;

export const Disclosure = /* @__PURE__ */ forwardRef<HTMLDetailsElement, DisclosureProps>(
  function Disclosure(
    { appearance = 'default', class: classProp, className, ...props },
    ref,
  ): JSX.Element {
    return (
      <details
        {...props}
        ref={ref}
        class={cx(styles.disclosure, styles[appearance], resolveClass(classProp, className))}
      />
    );
  },
);

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

export const DisclosureContent = /* @__PURE__ */ forwardRef<HTMLDivElement, DisclosureContentProps>(
  function DisclosureContent({ class: classProp, className, ...props }, ref): JSX.Element {
    return (
      <div {...props} ref={ref} class={cx(styles.content, resolveClass(classProp, className))} />
    );
  },
);
