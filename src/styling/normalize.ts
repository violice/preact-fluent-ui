import type { Declaration, StyleContext, StyleObject } from './types.ts';
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
function nestedParent(selector: string): string {
  let depth = 0;
  let quote = '';
  for (let index = 0; index < selector.length; index++) {
    const char = selector[index];
    if (char === '\\') {
      index++;
      continue;
    }
    if (quote) {
      if (char === quote) quote = '';
      continue;
    }
    if (char === '"' || char === "'") quote = char;
    else if (char === '(' || char === '[') depth++;
    else if (char === ')' || char === ']') depth--;
    else if (char === ',' && depth === 0) return `:is(${selector})`;
  }
  return selector;
}
export function normalizeStyles(
  style: StyleObject,
  context: StyleContext = {},
  selector = '&',
  conditions: string[] = [],
): Declaration[] {
  const output: Declaration[] = [];
  for (const [property, value] of Object.entries(style)) {
    if (value == null) continue;
    if (typeof value === 'object') {
      let condition = property;
      if (property.startsWith('_')) {
        condition =
          context.conditions?.[property.slice(1)] ??
          (
            {
              hover: '&:hover',
              focusVisible: '&:focus-visible',
              active: '&:active',
              disabled: '&:disabled',
            } as Record<string, string>
          )[property.slice(1)];
        if (!condition) throw new Error(`Unknown condition: ${property}`);
      }
      if (condition.startsWith('@'))
        output.push(...normalizeStyles(value, context, selector, [...conditions, condition]));
      else if (condition.includes('&'))
        output.push(
          ...normalizeStyles(
            value,
            context,
            condition.replaceAll('&', nestedParent(selector)),
            conditions,
          ),
        );
      else throw new Error(`Nested styles require a selector or condition: ${property}`);
      continue;
    }
    for (const [name, resolved] of expandStyle(
      property,
      resolveStyleValue(property, value, context),
    )) {
      output.push({ property: cssName(name), value: resolved, selector, conditions });
    }
  }
  const coordinates = new Map<string, string>();
  for (const declaration of output) {
    const match = /^(padding|margin)-(top|right|bottom|left|inline|block)/.exec(
      declaration.property,
    );
    if (!match) continue;
    const key = JSON.stringify([declaration.selector, declaration.conditions, match[1]]);
    const coordinate = /^(inline|block)$/.test(match[2]) ? 'logical' : 'physical';
    if (coordinates.has(key) && coordinates.get(key) !== coordinate)
      throw new Error(
        'Mixing logical and physical spacing in compiled styles is ambiguous; use one coordinate system',
      );
    coordinates.set(key, coordinate);
  }
  return output;
}
