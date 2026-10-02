import type { ComponentChildren, JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { mergeClasses } from '../classes';
import styles from './dialog-content.module.css';

export type DialogHeaderProps = Omit<
  JSX.HTMLAttributes<HTMLElement>,
  'id' | 'title' | 'children'
> & {
  id: string;
  title: string;
  description?: ComponentChildren;
};
export type DialogBodyProps = JSX.HTMLAttributes<HTMLDivElement>;
export type DialogFooterProps = JSX.HTMLAttributes<HTMLElement>;

export const DialogHeader = /* @__PURE__ */ forwardRef<HTMLElement, DialogHeaderProps>(
  function DialogHeader({ id, title, description, class: classProp, className, ...props }, ref) {
    return (
      <header {...props} ref={ref} class={mergeClasses(styles.header, classProp, className)}>
        <h2 id={id} class={styles.title}>
          {title}
        </h2>
        {description != null && <p class={styles.description}>{description}</p>}
      </header>
    );
  },
);

export const DialogBody = /* @__PURE__ */ forwardRef<HTMLDivElement, DialogBodyProps>(
  function DialogBody({ class: classProp, className, ...props }, ref) {
    return <div {...props} ref={ref} class={mergeClasses(styles.body, classProp, className)} />;
  },
);

export const DialogFooter = /* @__PURE__ */ forwardRef<HTMLElement, DialogFooterProps>(
  function DialogFooter({ class: classProp, className, ...props }, ref) {
    return (
      <footer {...props} ref={ref} class={mergeClasses(styles.actions, classProp, className)} />
    );
  },
);
