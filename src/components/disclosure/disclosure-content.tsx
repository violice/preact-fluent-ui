import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/cx';
import { resolveClass } from '../../utils/resolve-class';
import styles from './disclosure.styles';

export type DisclosureContentProps = JSX.HTMLAttributes<HTMLDivElement>;

export const DisclosureContent = /* @__PURE__ */ forwardRef<HTMLDivElement, DisclosureContentProps>(
  function DisclosureContent({ class: classProp, className, ...props }, ref): JSX.Element {
    return (
      <div {...props} ref={ref} class={cx(styles.content, resolveClass(classProp, className))} />
    );
  },
);
