import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { infoBarClasses } from './info-bar.styles';
import { cx } from '../../styles';
import { resolveClass } from '../../utils';

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
  const styles = infoBarClasses({ tone });
  return (
    <div
      {...props}
      ref={ref}
      role={role ?? (tone === 'error' ? 'alert' : 'status')}
      class={cx(styles.root, resolveClass(classProp, className), classes?.root)}
    >
      {title && <strong class={cx(styles.title, classes?.title)}>{title}</strong>}
      {children != null && <div class={cx(styles.content, classes?.content)}>{children}</div>}
    </div>
  );
});
