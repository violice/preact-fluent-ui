import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { SidebarContext, sidebarValue } from './sidebar-context';
import type { SidebarLayout } from './sidebar-context';
import { cx } from '../../styling/cx';
import { resolveClass } from '../../utils/resolve-class';
import { sidebarClasses } from './sidebar.styles';

export type SidebarProps = JSX.HTMLAttributes<HTMLElement> & {
  layout?: JSX.Signalish<SidebarLayout>;
  scrollable?: JSX.Signalish<boolean>;
};

export const Sidebar = /* @__PURE__ */ forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { class: classProp, className, layout = 'expanded', scrollable = false, ...props },
  ref,
) {
  const resolvedLayout = sidebarValue(layout);
  const resolvedScrollable = sidebarValue(scrollable);
  const styles = sidebarClasses({ layout: resolvedLayout, scrollable: resolvedScrollable });
  return (
    <SidebarContext.Provider value={{ layout: resolvedLayout, styles }}>
      <aside
        data-sidebar=""
        data-layout={resolvedLayout}
        data-scrollable={resolvedScrollable}
        {...props}
        ref={ref}
        class={cx(styles.sidebar, resolveClass(classProp, className))}
      />
    </SidebarContext.Provider>
  );
});
