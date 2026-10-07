import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styles';
import { resolveClass } from '../../utils';
import { dataListItemClass } from './data-list.styles';

export type DataListItemProps = JSX.HTMLAttributes<HTMLDivElement>;

export const DataListItem = /* @__PURE__ */ forwardRef<HTMLDivElement, DataListItemProps>(
  function DataListItem({ class: classProp, className, ...props }, ref) {
    return (
      <div {...props} ref={ref} class={cx(dataListItemClass, resolveClass(classProp, className))} />
    );
  },
);
