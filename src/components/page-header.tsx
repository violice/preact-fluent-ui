import type { ComponentChildren, JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { mergeClasses, resolveClass } from '../classes';
import styles from './page-header.module.css';

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
          class={mergeClasses(styles.header, resolveClass(classProp, className), classes?.root)}
        >
          <div class={mergeClasses(classes?.content)}>
            <h1 class={mergeClasses(classes?.title)}>{title}</h1>
            <p class={mergeClasses(classes?.description)}>{description}</p>
          </div>
          {actions != null && (
            <div class={mergeClasses(styles.actions, classes?.actions)}>{actions}</div>
          )}
        </header>
        {notices != null && (
          <div class={mergeClasses(styles.notices, classes?.notices)}>{notices}</div>
        )}
      </>
    );
  },
);
