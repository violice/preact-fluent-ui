import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cva } from 'class-variance-authority';
import { mergeClasses } from '../classes';
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
};

export const Button = /* @__PURE__ */ forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'default', size = 'default', type = 'button', class: classProp, className, ...props },
  ref,
) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      class={mergeClasses(buttonClasses({ variant, size }), classProp, className)}
    />
  );
});
