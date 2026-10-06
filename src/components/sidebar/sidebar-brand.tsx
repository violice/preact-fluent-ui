import type { ComponentChildren, JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/cx';
import { resolveClass } from '../../utils/resolve-class';
import styles from './sidebar.styles';
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
        class={cx(styles.brand, resolveClass(classProp, className), classes?.root)}
      >
        {hasLogo && (
          <span aria-hidden="true" class={cx(styles.brandLogo, classes?.logo)}>
            {logo}
          </span>
        )}
        <div class={cx(styles.brandContent, classes?.content)}>
          <div class={cx(styles.brandTitle, classes?.title)}>{title}</div>
          {description && (
            <div class={cx(styles.description, classes?.description)}>{description}</div>
          )}
        </div>
      </div>
    );
  },
);
