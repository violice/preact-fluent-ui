import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cva } from 'class-variance-authority';
import { mergeClasses } from '../utils/merge-classes';
import { Spinner } from './spinner';
import styles from './button.module.css';

const buttonClasses = cva(styles.button, {
  variants: {
    variant: {
      default: null,
      primary: styles.primary,
      subtle: styles.subtle,
      danger: styles.danger,
    },
    size: {
      default: null,
      compact: styles.compact,
      icon: styles.iconOnly,
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

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
      class={mergeClasses(
        buttonClasses({ variant, size }),
        loading ? styles.loading : undefined,
        classProp,
        className,
      )}
    >
      {loading && <Spinner size="small" />}
      {loading ? (size === 'icon' ? null : (loadingLabel ?? children)) : children}
    </button>
  );
});
