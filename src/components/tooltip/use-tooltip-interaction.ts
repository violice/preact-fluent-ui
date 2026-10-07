import type { JSX, RefObject } from 'preact';
import { useLayoutEffect, useRef, useState } from 'preact/hooks';

export function useTooltipInteraction(
  anchor: RefObject<HTMLElement>,
  triggerProps?: JSX.HTMLAttributes<HTMLElement>,
) {
  const interaction = useRef({ pointer: false, focus: false, tooltip: false, suppressed: false });
  const timers = useRef<{
    show?: ReturnType<typeof setTimeout>;
    hide?: ReturnType<typeof setTimeout>;
  }>({});
  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(visible);
  useLayoutEffect(() => {
    visibleRef.current = visible;
  }, [visible]);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  function clearTimers() {
    clearTimeout(timers.current.show);
    clearTimeout(timers.current.hide);
    timers.current = {};
  }
  function show(immediate = false) {
    clearTimers();
    if (interaction.current.suppressed) return;
    const open = () => {
      timers.current.show = undefined;
      const trigger = anchor.current;
      if (!trigger || interaction.current.suppressed) return;
      const dialog = trigger.closest('[role="dialog"][aria-modal="true"]');
      setPortalTarget(dialog?.parentElement ?? document.body);
      setVisible(true);
    };
    if (immediate) open();
    else timers.current.show = setTimeout(open, 500);
  }
  function leave() {
    clearTimers();
    const state = interaction.current;
    if (!state.pointer && !state.focus && !state.tooltip) {
      state.suppressed = false;
      // A short grace period allows crossing the 8px gap to the tooltip.
      timers.current.hide = setTimeout(() => setVisible(false), 100);
    }
  }
  useLayoutEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || (!visibleRef.current && timers.current.show === undefined))
        return;
      event.preventDefault();
      event.stopPropagation();
      clearTimeout(timers.current.show);
      clearTimeout(timers.current.hide);
      timers.current = {};
      interaction.current.suppressed = interaction.current.pointer || interaction.current.focus;
      interaction.current.tooltip = false;
      setVisible(false);
    };
    document.addEventListener('keydown', escape, true);
    return () => {
      clearTimeout(timers.current.show);
      clearTimeout(timers.current.hide);
      document.removeEventListener('keydown', escape, true);
    };
  }, []);

  const triggerEvents: JSX.HTMLAttributes<HTMLElement> = {
    onPointerEnter: (event) => {
      triggerProps?.onPointerEnter?.(event);
      if (event.defaultPrevented) return;
      interaction.current.pointer = true;
      show(interaction.current.focus);
    },
    onPointerLeave: (event) => {
      triggerProps?.onPointerLeave?.(event);
      interaction.current.pointer = false;
      leave();
    },
    onFocus: (event) => {
      triggerProps?.onFocus?.(event);
      if (event.defaultPrevented) return;
      interaction.current.focus = true;
      show(true);
    },
    onBlur: (event) => {
      triggerProps?.onBlur?.(event);
      interaction.current.focus = false;
      leave();
    },
  };
  const tooltipEvents: JSX.HTMLAttributes<HTMLDivElement> = {
    onPointerEnter: () => {
      interaction.current.tooltip = true;
      clearTimers();
    },
    onPointerLeave: () => {
      interaction.current.tooltip = false;
      leave();
    },
  };
  return { visible, portalTarget, triggerEvents, tooltipEvents };
}
