import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { mergeClasses } from '../utils/merge-classes';
import { resolveClass } from '../utils/resolve-class';
import { Spinner } from './spinner';
import styles from './loading-state.module.css';

export type LoadingStateProps = JSX.HTMLAttributes<HTMLDivElement> & {
  label: string;
  appearance?: 'default' | 'inline';
  classes?: {
    root?: JSX.Signalish<string | undefined>;
    spinner?: JSX.Signalish<string | undefined>;
    label?: JSX.Signalish<string | undefined>;
    content?: JSX.Signalish<string | undefined>;
  };
};

export const LoadingState = /* @__PURE__ */ forwardRef<HTMLDivElement, LoadingStateProps>(
  function LoadingState(
    { label, appearance = 'default', children, classes, class: classProp, className, ...props },
    ref,
  ): JSX.Element {
    return (
      <div
        {...props}
        ref={ref}
        class={mergeClasses(
          styles.loading,
          styles[appearance],
          resolveClass(classProp, className),
          classes?.root,
        )}
        role="status"
        aria-label={label}
      >
        <Spinner class={mergeClasses(styles.spinner, classes?.spinner)} />
        <span class={mergeClasses(styles.label, classes?.label)}>{label}</span>
        {children != null && (
          <div class={mergeClasses(styles.content, classes?.content)}>{children}</div>
        )}
      </div>
    );
  },
);
