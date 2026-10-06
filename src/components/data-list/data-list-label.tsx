import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/cx';
import { resolveClass } from '../../utils/resolve-class';
import { dataListLabelClass } from './data-list.styles';

export type DataListLabelProps = JSX.HTMLAttributes<HTMLElement>;

export const DataListLabel = /* @__PURE__ */ forwardRef<HTMLElement, DataListLabelProps>(
  function DataListLabel({ class: classProp, className, ...props }, ref) {
    return (
      <dt {...props} ref={ref} class={cx(dataListLabelClass, resolveClass(classProp, className))} />
    );
  },
);
