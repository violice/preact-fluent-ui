import type { ComponentChildren, JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { useId } from 'preact/hooks';
import { cx } from '../../styles';
import { resolveClass } from '../../utils';
import { useSidebarStyles } from './sidebar-context';

export type SidebarGroupProps = JSX.HTMLAttributes<HTMLDivElement> & {
  label?: ComponentChildren;
  classes?: Partial<Record<'root' | 'label' | 'content', JSX.Signalish<string | undefined>>>;
};

export const SidebarGroup = /* @__PURE__ */ forwardRef<HTMLDivElement, SidebarGroupProps>(
  function SidebarGroup({ label, classes, children, class: classProp, className, ...props }, ref) {
    const styles = useSidebarStyles();
    const id = useId();
    const hasLabel = label !== undefined && label !== null && label !== false && label !== '';
    return (
      <div
        {...props}
        ref={ref}
        role={props.role ?? (hasLabel ? 'group' : undefined)}
        aria-labelledby={hasLabel ? id : props['aria-labelledby']}
        class={cx(styles.group, resolveClass(classProp, className), classes?.root)}
      >
        {hasLabel && (
          <div id={id} class={cx(styles.label, classes?.label)}>
            {label}
          </div>
        )}
        <div class={cx(styles.content, classes?.content)}>{children}</div>
      </div>
    );
  },
);
