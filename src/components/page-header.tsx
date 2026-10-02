import type { ComponentChildren, JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { mergeClasses } from '../classes';
import styles from './page-header.module.css';

export type PageHeaderProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'children' | 'title'> & {
  title: string;
  description: string;
  actions?: ComponentChildren;
  notices?: ComponentChildren;
};

export const PageHeader = forwardRef<HTMLElement, PageHeaderProps>(function PageHeader(
  { title, description, actions, notices, class: classProp, className, ...props },
  ref,
) {
  return (
    <>
      <header {...props} ref={ref} class={mergeClasses(styles.header, classProp, className)}>
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {actions != null && <div class={styles.actions}>{actions}</div>}
      </header>
      {notices != null && <div class={styles.notices}>{notices}</div>}
    </>
  );
});
