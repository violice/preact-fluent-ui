import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cva } from 'class-variance-authority';
import { mergeClasses, resolveClass } from '../classes';
import styles from './info-bar.module.css';

const infoBarClasses = cva(styles.infoBar, {
  variants: {
    tone: { info: null, success: styles.success, warning: styles.warning, error: styles.error },
  },
  defaultVariants: { tone: 'info' },
});

export type InfoBarProps = JSX.HTMLAttributes<HTMLDivElement> & {
  classes?: {
    root?: JSX.Signalish<string | undefined>;
    title?: JSX.Signalish<string | undefined>;
    content?: JSX.Signalish<string | undefined>;
  };
  tone?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
};

export const InfoBar = /* @__PURE__ */ forwardRef<HTMLDivElement, InfoBarProps>(function InfoBar(
  { tone = 'info', title, children, classes, class: classProp, className, role, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      role={role ?? (tone === 'error' ? 'alert' : 'status')}
      class={mergeClasses(
        infoBarClasses({ tone }),
        resolveClass(classProp, className),
        classes?.root,
      )}
    >
      {title && <strong class={mergeClasses(styles.title, classes?.title)}>{title}</strong>}
      {children != null && (
        <div class={mergeClasses(styles.content, classes?.content)}>{children}</div>
      )}
    </div>
  );
});
