import type { ComponentChildren, JSX, RefObject } from 'preact';
import { createPortal, forwardRef } from 'preact/compat';
import { useImperativeHandle, useLayoutEffect, useRef } from 'preact/hooks';
import { mergeClasses } from '../classes';
import styles from './modal.module.css';

export type ModalProps = Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  'children' | 'onClose' | 'role' | 'aria-modal' | 'aria-labelledby'
> & {
  labelledBy: string;
  initialFocusRef: RefObject<HTMLElement>;
  fallbackFocusRef?: RefObject<HTMLElement>;
  onClose: () => void;
  children: ComponentChildren;
};

function isAvailable(element: HTMLElement): boolean {
  if (!element.isConnected || element.matches(':disabled, input[type="hidden"]')) return false;
  for (let ancestor: HTMLElement | null = element; ancestor; ancestor = ancestor.parentElement) {
    if (
      ancestor.hidden ||
      ancestor.hasAttribute('inert') ||
      ancestor.getAttribute('aria-hidden') === 'true'
    )
      return false;
    const style = getComputedStyle(ancestor);
    if (
      style.display === 'none' ||
      style.visibility === 'hidden' ||
      style.visibility === 'collapse'
    )
      return false;
  }
  return true;
}

function tryFocus(element: HTMLElement | null | undefined): boolean {
  if (!element || !isAvailable(element)) return false;
  element.focus();
  return document.activeElement === element;
}

function getControls(dialog: HTMLElement): HTMLElement[] {
  return Array.from(
    dialog.querySelectorAll<HTMLElement>(
      'button, input, select, textarea, a[href], area[href], [tabindex], [contenteditable], summary, audio[controls], video[controls]',
    ),
  )
    .filter((element) => element.tabIndex >= 0 && isAvailable(element))
    .sort((first, second) => {
      const firstIndex = first.tabIndex > 0 ? first.tabIndex : Infinity;
      const secondIndex = second.tabIndex > 0 ? second.tabIndex : Infinity;
      return firstIndex === secondIndex ? 0 : firstIndex - secondIndex;
    });
}

function focusDialog(dialog: HTMLElement, initial?: HTMLElement | null) {
  if (initial && dialog.contains(initial) && tryFocus(initial)) return;
  if (!tryFocus(getControls(dialog)[0])) dialog.focus();
}

function focusBody() {
  const tabindex = document.body.getAttribute('tabindex');
  document.body.setAttribute('tabindex', '-1');
  document.body.focus();
  if (tabindex === null) document.body.removeAttribute('tabindex');
  else document.body.setAttribute('tabindex', tabindex);
}

export const Modal = /* @__PURE__ */ forwardRef<HTMLDivElement, ModalProps>(function Modal(
  {
    labelledBy,
    initialFocusRef,
    fallbackFocusRef,
    onClose,
    children,
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
  const latest = useRef({ initialFocusRef, fallbackFocusRef });
  latest.current = { initialFocusRef, fallbackFocusRef };
  useImperativeHandle(ref, () => dialogRef.current!, []);

  useLayoutEffect(() => {
    const dialog = dialogRef.current!;
    const fallback = latest.current.fallbackFocusRef;
    const opener =
      document.activeElement instanceof HTMLElement && document.activeElement !== document.body
        ? document.activeElement
        : null;
    const background = Array.from(document.body.children).filter(
      (element) => element !== backdropRef.current && !element.hasAttribute('inert'),
    );
    background.forEach((element) => element.setAttribute('inert', ''));
    // Native CSSOM has no shorthand value when longhand priorities differ.
    const overflow = ['overflow', 'overflow-x', 'overflow-y'].map((property) => ({
      property,
      value: document.body.style.getPropertyValue(property),
      priority: document.body.style.getPropertyPriority(property),
    }));
    document.body.style.overflow = 'hidden';
    focusDialog(dialog, latest.current.initialFocusRef.current);

    const containFocus = (event: FocusEvent) => {
      if (event.target instanceof Node && !dialog.contains(event.target)) focusDialog(dialog);
    };
    document.addEventListener('focusin', containFocus);
    return () => {
      document.removeEventListener('focusin', containFocus);
      background.forEach((element) => element.removeAttribute('inert'));
      overflow.forEach(({ property, value, priority }) => {
        document.body.style.setProperty(property, value, priority);
      });
      queueMicrotask(() => {
        if (!tryFocus(opener) && !tryFocus(fallback?.current)) focusBody();
      });
    };
  }, []);

  // A controlled update can disable or hide the currently focused control.
  useLayoutEffect(() => {
    const dialog = dialogRef.current!;
    const active = document.activeElement;
    if (!(active instanceof HTMLElement) || !dialog.contains(active) || !isAvailable(active)) {
      focusDialog(dialog);
    }
  });

  function handleKeyDown(event: JSX.TargetedKeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      onClose();
    } else if (event.key === 'Tab') {
      const dialog = dialogRef.current!;
      const controls = getControls(dialog);
      const index = controls.indexOf(document.activeElement as HTMLElement);
      const next = event.shiftKey
        ? index <= 0
          ? controls.length - 1
          : index - 1
        : (index + 1) % controls.length;
      event.preventDefault();
      if (!tryFocus(controls[next])) dialog.focus();
    }
  }

  return createPortal(
    <div
      ref={backdropRef}
      class={styles.backdrop}
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
        class={mergeClasses(styles.dialog, classProp, className)}
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
