import type { ComponentChildren, JSX, RefObject } from 'preact';
import { createPortal, forwardRef } from 'preact/compat';
import { useImperativeHandle, useRef } from 'preact/hooks';
import { cx } from '../../styling/runtime/cx';
import { resolveClass } from '../../utils/resolve-class';
import styles from './modal.styles';
import { useModalFocus } from './use-modal-focus';

export type ModalProps = Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  'children' | 'onClose' | 'role' | 'aria-modal' | 'aria-labelledby'
> & {
  classes?: {
    root?: JSX.Signalish<string | undefined>;
    backdrop?: JSX.Signalish<string | undefined>;
  };
  labelledBy: string;
  initialFocusRef: RefObject<HTMLElement>;
  fallbackFocusRef?: RefObject<HTMLElement>;
  onClose: () => void;
  children: ComponentChildren;
};

export const Modal = /* @__PURE__ */ forwardRef<HTMLDivElement, ModalProps>(function Modal(
  {
    labelledBy,
    initialFocusRef,
    fallbackFocusRef,
    onClose,
    children,
    classes,
    class: classProp,
    className,
    onKeyDown,
    tabIndex = -1,
    ...props
  },
  ref,
) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => dialogRef.current!, []);
  const handleKeyDown = useModalFocus({
    dialogRef,
    backdropRef,
    initialFocusRef,
    fallbackFocusRef,
    onClose,
    onKeyDown,
  });

  return createPortal(
    <div
      ref={backdropRef}
      class={cx(styles.backdrop, classes?.backdrop)}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) event.preventDefault();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        {...props}
        ref={dialogRef}
        class={cx(styles.dialog, resolveClass(classProp, className), classes?.root)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={tabIndex}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
});
