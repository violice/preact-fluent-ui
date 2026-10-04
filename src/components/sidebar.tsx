import type { ComponentChildren, FunctionComponent, JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { useId } from 'preact/hooks';
import { mergeClasses, resolveClass } from '../classes';
import styles from './sidebar.module.css';

export type SidebarProps = JSX.HTMLAttributes<HTMLElement>;
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
export type SidebarItemProps = Omit<JSX.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: NonNullable<JSX.AnchorHTMLAttributes<HTMLAnchorElement>['href']>;
  icon?: ComponentChildren;
  active?: JSX.Signalish<boolean>;
  classes?: Partial<Record<'root' | 'icon' | 'content', JSX.Signalish<string | undefined>>>;
};

export const Sidebar = /* @__PURE__ */ forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { class: classProp, className, ...props },
  ref,
) {
  return (
    <aside
      {...props}
      ref={ref}
      class={mergeClasses(styles.sidebar, resolveClass(classProp, className))}
    />
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
export const SidebarItem = /* @__PURE__ */ forwardRef<HTMLAnchorElement, SidebarItemProps>(
  function SidebarItem(
    { icon, active, classes, children, class: classProp, className, ...props },
    ref,
  ) {
    const isActive = active !== null && typeof active === 'object' ? active.value : active;
    return (
      <a
        {...props}
        ref={ref}
        aria-current={isActive ? 'page' : undefined}
        class={mergeClasses(styles.item, resolveClass(classProp, className), classes?.root)}
      >
        {icon !== undefined && icon !== null && icon !== false && (
          <span aria-hidden="true" class={mergeClasses(styles.icon, classes?.icon)}>
            {icon}
          </span>
        )}
        <span class={mergeClasses(styles.itemContent, classes?.content)}>{children}</span>
      </a>
    );
  },
);
