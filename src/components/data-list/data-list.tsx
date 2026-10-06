import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/cx';
import { resolveClass } from '../../utils/resolve-class';
import { dataListClasses } from './data-list.styles';

export type DataListProps = JSX.HTMLAttributes<HTMLDListElement> & {
  direction?: 'horizontal' | 'vertical';
};

export const DataList = /* @__PURE__ */ forwardRef<HTMLDListElement, DataListProps>(
  function DataList({ direction = 'horizontal', class: classProp, className, ...props }, ref) {
    return (
      <dl
        {...props}
        ref={ref}
        class={cx(dataListClasses({ direction }).list, resolveClass(classProp, className))}
      />
    );
  },
);
