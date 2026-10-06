import type { JSX, VNode } from 'preact';
import { createPortal } from 'preact/compat';
import { useId, useLayoutEffect, useRef, useState } from 'preact/hooks';
import { cx } from '../styling/cx';
import { resolveClass } from '../utils/resolve-class';
import { useRender } from '../utils/use-render';
import { getTooltipPosition } from './tooltip-position';
import type { TooltipPlacement } from './tooltip-position';
import { copyTooltipTheme } from './tooltip-theme';
import styles from './tooltip.module.css';

export type TooltipTriggerProps = JSX.HTMLAttributes<HTMLElement> & {
  ref: (node: HTMLElement | null) => void;
};
export type TooltipProps = {
  content: string;
  placement?: TooltipPlacement;
  triggerProps?: JSX.HTMLAttributes<HTMLElement>;
  children: (props: TooltipTriggerProps) => VNode;
  class?: JSX.Signalish<string | undefined>;
  className?: JSX.Signalish<string | undefined>;
  classes?: {
    root?: JSX.Signalish<string | undefined>;
    content?: JSX.Signalish<string | undefined>;
  };
};

export function Tooltip({
  content,
  placement = 'top',
  triggerProps,
  children,
  class: classProp,
  className,
  classes,
}: TooltipProps): JSX.Element {
  const id = useId();
  const anchor = useRef<HTMLElement | null>(null);
  const tooltip = useRef<HTMLDivElement>(null);
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
  const triggerRef = useRef((node: HTMLElement | null) => {
    anchor.current = node;
  }).current;

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

  useLayoutEffect(() => {
    if (!visible || !anchor.current || !tooltip.current) return;
    const trigger = anchor.current;
    const target = tooltip.current;
    const update = () => {
      copyTooltipTheme(trigger, target);
      target.style.maxWidth = `${Math.max(0, Math.min(280, window.innerWidth - 16))}px`;
      const rect = target.getBoundingClientRect();
      const position = getTooltipPosition(
        trigger.getBoundingClientRect(),
        rect,
        { width: window.innerWidth, height: window.innerHeight },
        placement,
      );
      target.style.left = `${position.left}px`;
      target.style.top = `${position.top}px`;
      target.dataset.placement = position.placement;
    };
    update();
    window.addEventListener('resize', update);
    document.addEventListener('scroll', update, true);
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(update);
    observer?.observe(trigger);
    observer?.observe(target);
    // Watch the trigger's ancestry without a subtree subscription, so writing
    // copied tokens to the portal cannot retrigger this observer.
    const themeObserver = new MutationObserver(update);
    for (let element: HTMLElement | null = trigger; element; element = element.parentElement) {
      themeObserver.observe(element, { attributes: true });
    }
    themeObserver.observe(document.head, {
      subtree: true,
      attributes: true,
      childList: true,
      characterData: true,
    });
    document.head.addEventListener('load', update, true);
    const media =
      typeof window.matchMedia === 'function'
        ? ['(prefers-color-scheme: dark)', '(forced-colors: active)'].map((query) =>
            window.matchMedia(query),
          )
        : [];
    for (const query of media) query.addEventListener('change', update);
    return () => {
      window.removeEventListener('resize', update);
      document.removeEventListener('scroll', update, true);
      observer?.disconnect();
      themeObserver.disconnect();
      document.head.removeEventListener('load', update, true);
      for (const query of media) query.removeEventListener('change', update);
    };
  }, [visible, content, placement]);

  const descriptions = triggerProps?.['aria-describedby'];
  const description =
    [...new Set(`${descriptions ?? ''} ${visible ? id : ''}`.split(/\s+/).filter(Boolean))].join(
      ' ',
    ) || undefined;
  const trigger = useRender<'span'>({
    defaultTagName: 'span',
    props: {
      ...triggerProps,
      'aria-describedby': description,
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
    },
    ref: triggerRef,
    render: (props) => children(props as TooltipTriggerProps),
  });
  return (
    <>
      {trigger}
      {visible &&
        portalTarget &&
        createPortal(
          <div
            ref={tooltip}
            id={id}
            role="tooltip"
            class={cx(styles.tooltip, resolveClass(classProp, className), classes?.root)}
            onPointerEnter={() => {
              interaction.current.tooltip = true;
              clearTimers();
            }}
            onPointerLeave={() => {
              interaction.current.tooltip = false;
              leave();
            }}
          >
            <span class={classes?.content}>{content}</span>
          </div>,
          portalTarget,
        )}
    </>
  );
}
