import type { StyleContext } from '../shared/types.ts';
const unitless = new Set([
  'flex',
  'flexGrow',
  'flexShrink',
  'order',
  'gridColumn',
  'gridRow',
  'opacity',
  'zIndex',
  'fontWeight',
  'lineHeight',
  'scale',
  'aspectRatio',
  'animationIterationCount',
  'columnCount',
  'fillOpacity',
  'strokeOpacity',
  'strokeWidth',
  'strokeMiterlimit',
  'zoom',
]);
export function cssName(property: string): string {
  return property.startsWith('--')
    ? property
    : property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}
export function resolveStyleValue(
  property: string,
  value: string | number,
  context: StyleContext = {},
): string {
  if (typeof value === 'number')
    return `${value}${unitless.has(property) || property.startsWith('--') ? '' : 'px'}`;
  const category = /^(gap|rowGap|columnGap|padding|margin)/.test(property)
    ? 'spacing'
    : /color|background|fill|stroke/i.test(property)
      ? 'colors'
      : /radius/i.test(property)
        ? 'radii'
        : property === 'fontFamily'
          ? 'fonts'
          : '';
  const token = context.tokens?.[`${category}.${value}`];
  if (token) return token;
  if (
    /^(gap|rowGap|columnGap|padding|margin)/.test(property) &&
    /^space-(1|2|3|4|5|6|8)$/.test(value)
  )
    return `var(--${value})`;
  return value.replace(/\{([\w.-]+)\}/g, (_, path: string) => {
    const reference = context.tokens?.[path];
    if (!reference) throw new Error(`Unknown token: ${path}`);
    return reference;
  });
}
function words(value: string): string[] {
  const parts: string[] = [];
  let start = 0,
    depth = 0,
    quote = '';
  for (let i = 0; i <= value.length; i++) {
    const char = value[i] ?? ' ';
    if (quote) {
      if (char === quote && value[i - 1] !== '\\') quote = '';
    } else if (char === '"' || char === "'") quote = char;
    else if (char === '(') depth++;
    else if (char === ')') depth--;
    else if (/\s/.test(char) && depth === 0) {
      if (i > start) parts.push(value.slice(start, i));
      start = i + 1;
    }
  }
  return parts;
}
export function expandStyle(property: string, value: string): [string, string][] {
  if (/^border(Top|Right|Bottom|Left)?$/.test(property)) {
    const parts = words(value);
    const style =
      parts.find((part) =>
        /^(none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset)$/.test(part),
      ) ?? 'none';
    const width =
      parts.find((part) => /^(thin|medium|thick|[0-9.]+[a-z%]*)$/.test(part)) ?? 'medium';
    const color =
      parts.filter((part) => part !== style && part !== width).join(' ') || 'currentColor';
    const sides = property === 'border' ? ['Top', 'Right', 'Bottom', 'Left'] : [property.slice(6)];
    return sides.flatMap(
      (side) =>
        [
          [`border${side}Width`, width],
          [`border${side}Style`, style],
          [`border${side}Color`, color],
        ] as [string, string][],
    );
  }
  if (/^border(Color|Width|Style)$/.test(property)) {
    const parts = words(value);
    return ['Top', 'Right', 'Bottom', 'Left'].map((side, i) => [
      `border${side}${property.slice(6)}`,
      parts[i] ?? (i === 2 ? parts[0] : (parts[1] ?? parts[0])),
    ]);
  }
  if (
    property === 'background' &&
    !value.startsWith('var(--pfui-local-') &&
    /^(var\(|#|[a-zA-Z]+$)/.test(value)
  )
    return [['backgroundColor', value]];

  if (/^(padding|margin)(Inline|Block)?$/.test(property)) {
    const parts = words(value);
    if (parts.length === 0 || parts.length > 4)
      throw new Error(`Invalid ${property} shorthand: ${value}`);
    if (property.endsWith('Inline') || property.endsWith('Block')) {
      if (parts.length > 2) throw new Error(`Invalid ${property} shorthand: ${value}`);
      return [
        [`${property}Start`, parts[0]],
        [`${property}End`, parts[1] ?? parts[0]],
      ];
    }
    return [
      ['Top', parts[0]],
      ['Right', parts[1] ?? parts[0]],
      ['Bottom', parts[2] ?? parts[0]],
      ['Left', parts[3] ?? parts[1] ?? parts[0]],
    ].map(([side, part]) => [`${property}${side}`, part]);
  }
  if (property === 'gap') {
    const parts = words(value);
    if (parts.length > 2) throw new Error(`Invalid gap shorthand: ${value}`);
    return [
      ['rowGap', parts[0]],
      ['columnGap', parts[1] ?? parts[0]],
    ];
  }
  if (property === 'overflow') {
    const parts = words(value);
    return [
      ['overflowX', parts[0]],
      ['overflowY', parts[1] ?? parts[0]],
    ];
  }
  return [[property, value]];
}
