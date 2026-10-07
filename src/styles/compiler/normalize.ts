import type { Declaration, StyleContext, StyleObject } from '../shared/types.ts';
import { cssName, expandStyle, resolveStyleValue } from '../shared/style-values.ts';
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
