export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export function getTooltipPosition(
  anchor: DOMRect,
  tooltip: { width: number; height: number },
  viewport: { width: number; height: number },
  placement: TooltipPlacement,
): { left: number; top: number; placement: TooltipPlacement } {
  const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' } as const;
  const point = (side: TooltipPlacement) => {
    const left =
      side === 'left'
        ? anchor.left - tooltip.width - 8
        : side === 'right'
          ? anchor.right + 8
          : anchor.left + (anchor.width - tooltip.width) / 2;
    const top =
      side === 'top'
        ? anchor.top - tooltip.height - 8
        : side === 'bottom'
          ? anchor.bottom + 8
          : anchor.top + (anchor.height - tooltip.height) / 2;
    return { left, top };
  };
  const fits = (side: TooltipPlacement) => {
    const position = point(side);
    return side === 'top' || side === 'bottom'
      ? position.top >= 8 && position.top + tooltip.height <= viewport.height - 8
      : position.left >= 8 && position.left + tooltip.width <= viewport.width - 8;
  };
  const side = !fits(placement) && fits(opposite[placement]) ? opposite[placement] : placement;
  const position = point(side);
  return {
    left: Math.max(8, Math.min(position.left, viewport.width - tooltip.width - 8)),
    top: Math.max(8, Math.min(position.top, viewport.height - tooltip.height - 8)),
    placement: side,
  };
}
