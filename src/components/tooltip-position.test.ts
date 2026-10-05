import { expect, it } from 'vitest';
import { getTooltipPosition } from './tooltip-position';
const anchor = new DOMRect(100, 100, 40, 20);
const size = { width: 60, height: 30 };
const viewport = { width: 300, height: 300 };
it.each([
  ['top', 90, 62],
  ['bottom', 90, 128],
  ['left', 32, 95],
  ['right', 148, 95],
] as const)('positions %s with an 8px gap', (placement, left, top) => {
  expect(getTooltipPosition(anchor, size, viewport, placement)).toEqual({ left, top, placement });
});
it.each([
  ['top', new DOMRect(100, 10, 40, 20), 'bottom', 90, 38],
  ['bottom', new DOMRect(100, 270, 40, 20), 'top', 90, 232],
  ['left', new DOMRect(10, 100, 40, 20), 'right', 58, 95],
  ['right', new DOMRect(260, 100, 30, 20), 'left', 192, 95],
] as const)('flips %s at the viewport boundary', (placement, rect, flipped, left, top) => {
  expect(getTooltipPosition(rect, size, viewport, placement)).toEqual({
    left,
    top,
    placement: flipped,
  });
});
it('shifts cross-axis edges and keeps oversized content at viewport padding', () => {
  expect(getTooltipPosition(new DOMRect(0, 100, 10, 10), size, viewport, 'top').left).toBe(8);
  expect(getTooltipPosition(new DOMRect(290, 100, 10, 10), size, viewport, 'top').left).toBe(232);
  expect(getTooltipPosition(anchor, { width: 500, height: 500 }, viewport, 'top')).toEqual({
    left: 8,
    top: 8,
    placement: 'top',
  });
});
