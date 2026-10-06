import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/cx';
import { resolveClass } from '../../utils/resolve-class';
import { toolbarClasses } from './toolbar.styles';

export type ToolbarGroupProps = JSX.HTMLAttributes<HTMLDivElement> & {
  align?: 'start' | 'end';
};

export const ToolbarGroup = /* @__PURE__ */ forwardRef<HTMLDivElement, ToolbarGroupProps>(
  function ToolbarGroup({ align = 'start', class: classProp, className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        class={cx(toolbarClasses({ align }).group, resolveClass(classProp, className))}
      />
    );
  },
);
