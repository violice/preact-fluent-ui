import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { infoBarClasses, titleClass, contentClass } from './info-bar.styles';
import { mergeClasses } from '../utils/merge-classes';
import { resolveClass } from '../utils/resolve-class';

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
      {title && <strong class={mergeClasses(titleClass, classes?.title)}>{title}</strong>}
      {children != null && (
        <div class={mergeClasses(contentClass, classes?.content)}>{children}</div>
      )}
    </div>
  );
});
