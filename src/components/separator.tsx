import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { mergeClasses } from '../utils/merge-classes';
import { resolveClass } from '../utils/resolve-class';
import styles from './separator.module.css';

export type SeparatorProps = Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  'role' | 'aria-hidden' | 'aria-orientation'
> & {
  role?: never;
  'aria-hidden'?: never;
  'aria-orientation'?: never;
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
};

export const Separator = /* @__PURE__ */ forwardRef<HTMLDivElement, SeparatorProps>(
  function Separator(
    { orientation = 'horizontal', decorative = true, class: classProp, className, ...props },
    ref,
  ) {
    return (
      <div
        {...props}
        ref={ref}
        role={decorative ? 'none' : 'separator'}
        aria-hidden={decorative ? true : undefined}
        aria-orientation={decorative ? undefined : orientation}
        class={mergeClasses(
          styles.separator,
          styles[orientation],
          resolveClass(classProp, className),
        )}
      />
    );
  },
);
