import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cva } from 'class-variance-authority';
import { mergeClasses } from '../classes';
import styles from './info-bar.module.css';

const infoBarClasses = cva(styles.infoBar, {
  variants: {
    tone: { info: null, success: styles.success, warning: styles.warning, error: styles.error },
  },
  defaultVariants: { tone: 'info' },
});

export type InfoBarProps = JSX.HTMLAttributes<HTMLDivElement> & {
  tone?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
};

export const InfoBar = forwardRef<HTMLDivElement, InfoBarProps>(function InfoBar(
  { tone = 'info', title, children, class: classProp, className, role, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      role={role ?? (tone === 'error' ? 'alert' : 'status')}
      class={mergeClasses(infoBarClasses({ tone }), classProp, className)}
    >
      {title && <strong class={styles.title}>{title}</strong>}
      {children != null && <div class={styles.content}>{children}</div>}
    </div>
  );
});
