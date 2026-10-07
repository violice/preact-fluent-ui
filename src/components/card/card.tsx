import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/runtime/cx';
import { resolveClass } from '../../utils/resolve-class';
import { cardClasses } from './card.styles';

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
      class={cx(cardClasses({ padding }), resolveClass(classProp, className))}
    />
  );
});
