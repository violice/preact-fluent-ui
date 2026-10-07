import type { JSX, RefObject } from 'preact';
import { useLayoutEffect, useRef } from 'preact/hooks';

function isAvailable(element: HTMLElement): boolean {
  if (!element.isConnected || element.matches(':disabled, input[type="hidden"]')) return false;
  for (let ancestor: HTMLElement | null = element; ancestor; ancestor = ancestor.parentElement) {
    if (
      ancestor.hidden ||
      ancestor.hasAttribute('inert') ||
      ancestor.getAttribute('aria-hidden') === 'true'
    )
      return false;
    if (ancestor !== element && ancestor instanceof HTMLDetailsElement && !ancestor.open) {
      const summary = Array.from(ancestor.children).find((child) => child.tagName === 'SUMMARY');
      if (!summary?.contains(element)) return false;
    }
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

function getControls(dialog: HTMLElement, backwards = false): HTMLElement[] {
  const controls = Array.from(
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
  return controls.filter((element) => {
    if (!(element instanceof HTMLInputElement) || element.type !== 'radio' || !element.name)
      return true;
    const group = controls.filter(
      (other): other is HTMLInputElement =>
        other instanceof HTMLInputElement &&
        other.type === 'radio' &&
        other.name === element.name &&
        other.form === element.form,
    );
    return (
      element ===
      (group.find((radio) => radio.checked) ?? (backwards ? group[group.length - 1] : group[0]))
    );
  });
}

function focusDialog(dialog: HTMLElement, initial?: HTMLElement | null) {
  if (initial && dialog.contains(initial) && tryFocus(initial)) return;
  if (!getControls(dialog).some((element) => tryFocus(element))) dialog.focus();
}

function focusBody() {
  const tabindex = document.body.getAttribute('tabindex');
  document.body.setAttribute('tabindex', '-1');
  document.body.focus();
  if (tabindex === null) document.body.removeAttribute('tabindex');
  else document.body.setAttribute('tabindex', tabindex);
}

interface ModalFocusOptions {
  dialogRef: RefObject<HTMLDivElement>;
  backdropRef: RefObject<HTMLDivElement>;
  initialFocusRef: RefObject<HTMLElement>;
  fallbackFocusRef?: RefObject<HTMLElement>;
  onClose: () => void;
  onKeyDown?: JSX.KeyboardEventHandler<HTMLDivElement>;
}

export function useModalFocus({
  dialogRef,
  backdropRef,
  initialFocusRef,
  fallbackFocusRef,
  onClose,
  onKeyDown,
}: ModalFocusOptions) {
  const latest = useRef({ initialFocusRef, fallbackFocusRef });
  latest.current = { initialFocusRef, fallbackFocusRef };

  useLayoutEffect(() => {
    const dialog = dialogRef.current!;
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
        // Restoration deliberately reads the current prop after any updates while open.
        // oxlint-disable-next-line react-hooks/exhaustive-deps
        if (!tryFocus(opener) && !tryFocus(latest.current.fallbackFocusRef?.current)) focusBody();
      });
    };
  }, [dialogRef, backdropRef]);

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
      const controls = getControls(dialog, event.shiftKey);
      const active = document.activeElement;
      const index = controls.findIndex(
        (element) =>
          element === active ||
          (element instanceof HTMLInputElement &&
            active instanceof HTMLInputElement &&
            element.type === 'radio' &&
            active.type === 'radio' &&
            !!element.name &&
            element.name === active.name &&
            element.form === active.form),
      );
      const atEdge = event.shiftKey ? index === 0 : index === controls.length - 1;
      // Browsers own interior Tab/arrow behavior, including radio selection. Native
      // inert is also enforced by the browser; aria-hidden alone is not a Tab exclusion.
      const hasExcludedInterior = dialog.querySelector('[aria-hidden="true"], [inert]');
      if (index >= 0 && !atEdge && !hasExcludedInterior) return;
      event.preventDefault();
      const step = event.shiftKey ? -1 : 1;
      const start = index < 0 ? (event.shiftKey ? 0 : -1) : index;
      for (let offset = 1; offset <= controls.length; offset++) {
        const next = (start + step * offset + controls.length) % controls.length;
        if (tryFocus(controls[next])) return;
      }
      dialog.focus();
    }
  }

  return handleKeyDown;
}
