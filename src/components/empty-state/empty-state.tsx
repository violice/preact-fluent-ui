import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styles';
import { resolveClass } from '../../utils';
import { Icon, type IconName } from '../icon/icon';
import { emptyStateStyles } from './empty-state.styles';

export type EmptyStateProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'title'> & {
  classes?: {
    root?: JSX.Signalish<string | undefined>;
    icon?: JSX.Signalish<string | undefined>;
    title?: JSX.Signalish<string | undefined>;
    content?: JSX.Signalish<string | undefined>;
  };
  title: string;
  icon?: IconName;
};

export const EmptyState = /* @__PURE__ */ forwardRef<HTMLElement, EmptyStateProps>(
  function EmptyState(
    {
      title,
      children,
      icon = 'routes',
      classes,
      class: classProp,
      className,
      role = 'status',
      ...props
    },
    ref,
  ) {
    return (
      <section
        {...props}
        ref={ref}
        class={cx(emptyStateStyles.empty, resolveClass(classProp, className), classes?.root)}
        role={role}
      >
        <Icon name={icon} size={24} class={classes?.icon} />
        <h2 class={cx(emptyStateStyles.title, classes?.title)}>{title}</h2>
        <div class={cx(emptyStateStyles.content, classes?.content)}>{children}</div>
      </section>
    );
  },
);
