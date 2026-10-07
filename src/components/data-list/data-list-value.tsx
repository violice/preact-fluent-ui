import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styles';
import { resolveClass } from '../../utils';
import { dataListValueClass } from './data-list.styles';

export type DataListValueProps = JSX.HTMLAttributes<HTMLElement>;

export const DataListValue = /* @__PURE__ */ forwardRef<HTMLElement, DataListValueProps>(
  function DataListValue({ class: classProp, className, ...props }, ref) {
    return (
      <dd {...props} ref={ref} class={cx(dataListValueClass, resolveClass(classProp, className))} />
    );
  },
);
