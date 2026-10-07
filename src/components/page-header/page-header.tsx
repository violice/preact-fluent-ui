import type { ComponentChildren, JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styles';
import { resolveClass } from '../../utils';
import { pageHeaderStyles } from './page-header.styles';

export type PageHeaderProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'children' | 'title'> & {
  classes?: {
    root?: JSX.Signalish<string | undefined>;
    content?: JSX.Signalish<string | undefined>;
    title?: JSX.Signalish<string | undefined>;
    description?: JSX.Signalish<string | undefined>;
    actions?: JSX.Signalish<string | undefined>;
    notices?: JSX.Signalish<string | undefined>;
  };
  title: string;
  description: string;
  actions?: ComponentChildren;
  notices?: ComponentChildren;
};

export const PageHeader = /* @__PURE__ */ forwardRef<HTMLElement, PageHeaderProps>(
  function PageHeader(
    { title, description, actions, notices, classes, class: classProp, className, ...props },
    ref,
  ) {
    return (
      <>
        <header
          {...props}
          ref={ref}
          class={cx(pageHeaderStyles.header, resolveClass(classProp, className), classes?.root)}
        >
          <div class={classes?.content}>
            <h1 class={cx(pageHeaderStyles.title, classes?.title)}>{title}</h1>
            <p class={cx(pageHeaderStyles.description, classes?.description)}>{description}</p>
          </div>
          {actions != null && (
            <div class={cx(pageHeaderStyles.actions, classes?.actions)}>{actions}</div>
          )}
        </header>
        {notices != null && (
          <div class={cx(pageHeaderStyles.notices, classes?.notices)}>{notices}</div>
        )}
      </>
    );
  },
);
