import type { JSX, VNode } from 'preact';
import { createPortal } from 'preact/compat';
import { useId, useRef } from 'preact/hooks';
import { cx } from '../../styling/runtime/cx';
import { resolveClass } from '../../utils/resolve-class';
import { useRender } from '../../utils/use-render';
import type { TooltipPlacement } from './tooltip-position';
import { tooltipClass } from './tooltip.styles';
import { useTooltipInteraction } from './use-tooltip-interaction';
import { useTooltipPosition } from './use-tooltip-position';

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
  const triggerRef = useRef((node: HTMLElement | null) => {
    anchor.current = node;
  }).current;

  const { visible, portalTarget, triggerEvents, tooltipEvents } = useTooltipInteraction(
    anchor,
    triggerProps,
  );
  const { tooltip, dynamic } = useTooltipPosition(anchor, visible, content, placement);

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
      ...triggerEvents,
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
            class={cx(
              tooltipClass,
              dynamic.class,
              resolveClass(classProp, className),
              classes?.root,
            )}
            style={dynamic.style}
            {...tooltipEvents}
          >
            <span class={classes?.content}>{content}</span>
          </div>,
          portalTarget,
        )}
    </>
  );
}
