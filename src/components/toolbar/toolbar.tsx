import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styles';
import { resolveClass } from '../../utils';
import { toolbarClass } from './toolbar.styles';

export type ToolbarProps = JSX.HTMLAttributes<HTMLDivElement>;

export const Toolbar = /* @__PURE__ */ forwardRef<HTMLDivElement, ToolbarProps>(function Toolbar(
  { class: classProp, className, ...props },
  ref,
) {
  return <div {...props} ref={ref} class={cx(toolbarClass, resolveClass(classProp, className))} />;
});
