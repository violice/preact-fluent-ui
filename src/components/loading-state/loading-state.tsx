import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/runtime/cx';
import { resolveClass } from '../../utils/resolve-class';
import { Spinner } from '../spinner/spinner';
import { loadingStateClasses } from './loading-state.styles';

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
    const styles = loadingStateClasses({ appearance });
    return (
      <div
        {...props}
        ref={ref}
        class={cx(styles.loading, resolveClass(classProp, className), classes?.root)}
        role="status"
        aria-label={label}
      >
        <Spinner class={cx(styles.spinner, classes?.spinner)} />
        <span class={cx(styles.label, classes?.label)}>{label}</span>
        {children != null && <div class={cx(styles.content, classes?.content)}>{children}</div>}
      </div>
    );
  },
);
