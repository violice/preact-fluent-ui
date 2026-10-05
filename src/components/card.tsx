import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { mergeClasses } from '../utils/merge-classes';
import styles from './card.module.css';

export type CardProps = JSX.HTMLAttributes<HTMLElement> & {
  padding?: 'regular' | 'none';
};

export const Card = /* @__PURE__ */ forwardRef<HTMLElement, CardProps>(function Card(
  { padding = 'regular', class: classProp, className, ...props },
  ref,
) {
  return (
    <section
      {...props}
      ref={ref}
      class={mergeClasses(
        styles.card,
        padding === 'none' ? styles.unpadded : undefined,
        classProp,
        className,
      )}
    />
  );
});
