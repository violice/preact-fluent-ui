import type { JSX } from 'preact';
import { expandStyle, resolveStyleValue } from './normalize';
export interface StyleProps {
  class: string;
  style: JSX.CSSProperties;
}
export function styleProps(
  className: string,
  entries: readonly (readonly [string, unknown, string])[],
  tokens: Record<string, string> = {},
): StyleProps {
  const style: Record<string, string> = {};
  for (const [variable, input, property] of entries) {
    const value =
      input !== null && typeof input === 'object' && 'value' in input ? input.value : input;
    if (value == null) continue;
    if (typeof value !== 'number' && typeof value !== 'string')
      throw new Error(`Dynamic style ${property} must be a string, number or signal`);
    const resolved = resolveStyleValue(property, value, { tokens });
    const expanded = expandStyle(property, resolved);
    for (const [name, part] of expanded)
      style[expanded.length === 1 ? variable : `${variable}-${name}`] = part;
  }
  return { class: className, style };
}
