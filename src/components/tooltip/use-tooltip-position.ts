import type { RefObject } from 'preact';
import { useLayoutEffect, useRef } from 'preact/hooks';
import { getTooltipPosition } from './tooltip-position';
import type { TooltipPlacement } from './tooltip-position';
import { copyTooltipTheme } from './tooltip-theme';
import { tooltipPosition } from './tooltip.styles';

export function useTooltipPosition(
  anchor: RefObject<HTMLElement>,
  visible: boolean,
  content: string,
  placement: TooltipPlacement,
) {
  const tooltip = useRef<HTMLDivElement>(null);
  const geometry = useRef({ top: 0, left: 0, maxWidth: 280 });
  const dynamic = tooltipPosition(geometry.current);
  useLayoutEffect(() => {
    if (!visible || !anchor.current || !tooltip.current) return;
    const trigger = anchor.current;
    const target = tooltip.current;
    const update = () => {
      copyTooltipTheme(trigger, target);
      const applyGeometry = () => {
        for (const [name, value] of Object.entries(tooltipPosition(geometry.current).style)) {
          target.style.setProperty(name, String(value));
        }
      };
      geometry.current.maxWidth = Math.max(0, Math.min(280, window.innerWidth - 16));
      applyGeometry();
      const rect = target.getBoundingClientRect();
      const position = getTooltipPosition(
        trigger.getBoundingClientRect(),
        rect,
        { width: window.innerWidth, height: window.innerHeight },
        placement,
      );
      geometry.current.left = position.left;
      geometry.current.top = position.top;
      applyGeometry();
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
  }, [anchor, visible, content, placement]);

  return { tooltip, dynamic };
}
