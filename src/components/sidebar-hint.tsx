import { createPortal } from 'preact/compat';
import { useLayoutEffect, useRef, useState } from 'preact/hooks';
import type { RefObject } from 'preact';
import styles from './sidebar.module.css';
export function SidebarHint({
  trigger,
  text,
  onDismiss,
}: {
  trigger: RefObject<HTMLElement>;
  text: string;
  onDismiss: () => void;
}) {
  const hint = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !event.defaultPrevented) onDismiss();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onDismiss]);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  useLayoutEffect(() => {
    const update = () => {
      const element = trigger.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const hintRect = hint.current?.getBoundingClientRect();
      const width = hintRect?.width || Math.min(240, window.innerWidth - 16);
      const height = hintRect?.height || 24;
      const rtl = getComputedStyle(element).direction === 'rtl';
      const left = rtl ? rect.left - width - 8 : rect.right + 8;
      setPosition({
        top: Math.max(
          8 + height / 2,
          Math.min(rect.top + rect.height / 2, window.innerHeight - 8 - height / 2),
        ),
        left: Math.max(8, Math.min(left, window.innerWidth - width - 8)),
      });
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [trigger, text]);
  return createPortal(
    <div ref={hint} data-sidebar-hint="" aria-hidden="true" class={styles.hint} style={position}>
      {text}
    </div>,
    document.body,
  );
}
