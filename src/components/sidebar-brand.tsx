import type { ComponentChildren, JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { mergeClasses, resolveClass } from '../classes';
import styles from './sidebar.module.css';
export type SidebarBrandProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, 'title'> & {
  title: string;
  description?: string;
  logo?: ComponentChildren;
  classes?: Partial<
    Record<'root' | 'logo' | 'content' | 'title' | 'description', JSX.Signalish<string | undefined>>
  >;
};
export const SidebarBrand = /* @__PURE__ */ forwardRef<HTMLDivElement, SidebarBrandProps>(
  function SidebarBrand(
    { title, description, logo, classes, class: classProp, className, ...props },
    ref,
  ) {
    const hasLogo = logo !== undefined && logo !== null && logo !== false;
    return (
      <div
        {...props}
        ref={ref}
        data-has-logo={hasLogo}
        class={mergeClasses(styles.brand, resolveClass(classProp, className), classes?.root)}
      >
        {hasLogo && (
          <span aria-hidden="true" class={mergeClasses(styles.brandLogo, classes?.logo)}>
            {logo}
          </span>
        )}
        <div class={mergeClasses(styles.brandContent, classes?.content)}>
          <div class={mergeClasses(styles.brandTitle, classes?.title)}>{title}</div>
          {description && (
            <div class={mergeClasses(styles.description, classes?.description)}>{description}</div>
          )}
        </div>
      </div>
    );
  },
);
