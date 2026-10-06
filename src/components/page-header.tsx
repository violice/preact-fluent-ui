import type { ComponentChildren, JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../styling/cx';
import { resolveClass } from '../utils/resolve-class';
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
          class={cx(styles.header, resolveClass(classProp, className), classes?.root)}
        >
          <div class={cx(classes?.content)}>
            <h1 class={cx(classes?.title)}>{title}</h1>
            <p class={cx(classes?.description)}>{description}</p>
          </div>
          {actions != null && <div class={cx(styles.actions, classes?.actions)}>{actions}</div>}
        </header>
        {notices != null && <div class={cx(styles.notices, classes?.notices)}>{notices}</div>}
      </>
    );
  },
);
