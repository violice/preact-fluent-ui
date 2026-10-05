import type { ComponentChildren, FunctionComponent, JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { useId } from 'preact/hooks';
import { SidebarContext, sidebarValue } from './sidebar-context';
import type { SidebarLayout } from './sidebar-context';
export type { SidebarLayout } from './sidebar-context';
export { SidebarItem } from './sidebar-item';
export type { SidebarItemProps } from './sidebar-item';
export { SidebarBrand } from './sidebar-brand';
export type { SidebarBrandProps } from './sidebar-brand';
import { mergeClasses, resolveClass } from '../classes';
import styles from './sidebar.module.css';

export type SidebarProps = JSX.HTMLAttributes<HTMLElement> & {
  appearance?: 'default' | 'app';
  layout?: JSX.Signalish<SidebarLayout>;
  scrollable?: JSX.Signalish<boolean>;
};
export type SidebarHeaderProps = JSX.HTMLAttributes<HTMLDivElement>;
export type SidebarFooterProps = JSX.HTMLAttributes<HTMLDivElement>;
export type SidebarNavProps = JSX.HTMLAttributes<HTMLElement> &
  (
    | { 'aria-label': NonNullable<JSX.HTMLAttributes<HTMLElement>['aria-label']> }
    | { 'aria-labelledby': NonNullable<JSX.HTMLAttributes<HTMLElement>['aria-labelledby']> }
  );
export type SidebarGroupProps = JSX.HTMLAttributes<HTMLDivElement> & {
  label?: ComponentChildren;
  classes?: Partial<Record<'root' | 'label' | 'content', JSX.Signalish<string | undefined>>>;
};
export const Sidebar = /* @__PURE__ */ forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  {
    class: classProp,
    className,
    appearance = 'default',
    layout = 'expanded',
    scrollable = false,
    ...props
  },
  ref,
) {
  return (
    <SidebarContext.Provider value={sidebarValue(layout)}>
      <aside
        data-appearance={appearance}
        data-layout={sidebarValue(layout)}
        data-scrollable={sidebarValue(scrollable)}
        {...props}
        ref={ref}
        class={mergeClasses(styles.sidebar, resolveClass(classProp, className))}
      />
    </SidebarContext.Provider>
  );
});
export const SidebarHeader = /* @__PURE__ */ forwardRef<HTMLDivElement, SidebarHeaderProps>(
  function SidebarHeader({ class: classProp, className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        class={mergeClasses(styles.header, resolveClass(classProp, className))}
      />
    );
  },
);
export const SidebarNav: FunctionComponent<SidebarNavProps> = /* @__PURE__ */ forwardRef<
  HTMLElement,
  SidebarNavProps
>(function SidebarNav({ class: classProp, className, ...props }, ref) {
  return (
    <nav
      {...props}
      ref={ref}
      class={mergeClasses(styles.nav, resolveClass(classProp, className))}
    />
  );
});
export const SidebarFooter = /* @__PURE__ */ forwardRef<HTMLDivElement, SidebarFooterProps>(
  function SidebarFooter({ class: classProp, className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        class={mergeClasses(styles.footer, resolveClass(classProp, className))}
      />
    );
  },
);
export const SidebarGroup = /* @__PURE__ */ forwardRef<HTMLDivElement, SidebarGroupProps>(
  function SidebarGroup({ label, classes, children, class: classProp, className, ...props }, ref) {
    const id = useId();
    const hasLabel = label !== undefined && label !== null && label !== false && label !== '';
    return (
      <div
        {...props}
        ref={ref}
        role={props.role ?? (hasLabel ? 'group' : undefined)}
        aria-labelledby={hasLabel ? id : props['aria-labelledby']}
        class={mergeClasses(styles.group, resolveClass(classProp, className), classes?.root)}
      >
        {hasLabel && (
          <div id={id} class={mergeClasses(styles.label, classes?.label)}>
            {label}
          </div>
        )}
        <div class={mergeClasses(styles.content, classes?.content)}>{children}</div>
      </div>
    );
  },
);
