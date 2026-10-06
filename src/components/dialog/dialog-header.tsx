import type { ComponentChildren, JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/cx';
import { resolveClass } from '../../utils/resolve-class';
import styles from './dialog-content.styles';

export type DialogHeaderProps = Omit<
  JSX.HTMLAttributes<HTMLElement>,
  'id' | 'title' | 'children'
> & {
  classes?: {
    root?: JSX.Signalish<string | undefined>;
    title?: JSX.Signalish<string | undefined>;
    description?: JSX.Signalish<string | undefined>;
  };
  id: string;
  title: string;
  description?: ComponentChildren;
};

export const DialogHeader = /* @__PURE__ */ forwardRef<HTMLElement, DialogHeaderProps>(
  function DialogHeader(
    { id, title, description, classes, class: classProp, className, ...props },
    ref,
  ) {
    return (
      <header
        {...props}
        ref={ref}
        class={cx(styles.header, resolveClass(classProp, className), classes?.root)}
      >
        <h2 id={id} class={cx(styles.title, classes?.title)}>
          {title}
        </h2>
        {description != null && (
          <p class={cx(styles.description, classes?.description)}>{description}</p>
        )}
      </header>
    );
  },
);
