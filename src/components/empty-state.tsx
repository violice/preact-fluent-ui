import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { mergeClasses } from '../classes';
import { Icon, type IconName } from '../icons/icon';
import styles from './empty-state.module.css';

export type EmptyStateProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'title'> & {
  title: string;
  icon?: IconName;
};

export const EmptyState = /* @__PURE__ */ forwardRef<HTMLElement, EmptyStateProps>(
  function EmptyState(
    { title, children, icon = 'routes', class: classProp, className, role = 'status', ...props },
    ref,
  ) {
    return (
      <section
        {...props}
        ref={ref}
        class={mergeClasses(styles.empty, classProp, className)}
        role={role}
      >
        <Icon name={icon} size={24} />
        <h2>{title}</h2>
        <div class={styles.content}>{children}</div>
      </section>
    );
  },
);
