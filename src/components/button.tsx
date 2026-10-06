import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { buttonClasses } from './button.styles';
import { cx } from '../styling/cx';
import { resolveClass } from '../utils/resolve-class';
import { Spinner } from './spinner';
export type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'primary' | 'subtle' | 'danger';
  size?: 'default' | 'compact' | 'icon';
  loading?: boolean;
  loadingLabel?: string;
};

export const Button = /* @__PURE__ */ forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'default',
    size = 'default',
    type = 'button',
    loading = false,
    loadingLabel,
    disabled,
    onClick,
    children,
    class: classProp,
    className,
    ...props
  },
  ref,
) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      disabled={disabled}
      data-pfui-loading={loading || undefined}
      aria-busy={loading ? true : props['aria-busy']}
      aria-disabled={loading ? true : props['aria-disabled']}
      onClick={(event) => {
        if (loading || event.currentTarget.disabled) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        onClick?.(event);
      }}
      class={cx(buttonClasses({ variant, size, loading }), resolveClass(classProp, className))}
    >
      {loading && <Spinner size="small" />}
      {loading ? (size === 'icon' ? null : (loadingLabel ?? children)) : children}
    </button>
  );
});
