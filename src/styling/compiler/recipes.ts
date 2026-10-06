import { compileStyles } from './atomic.ts';
import type { StyleContext, StyleObject } from '../types.ts';
interface Definition {
  slots?: string[];
  base?: StyleObject | Record<string, StyleObject>;
  variants?: Record<string, Record<string, StyleObject | Record<string, StyleObject>>>;
  defaultVariants?: Record<string, unknown>;
  compoundVariants?: (Record<string, unknown> & {
    css: StyleObject | Record<string, StyleObject>;
  })[];
}
export function compileRecipe(
  definition: Definition,
  context: StyleContext = {},
  multipart = false,
): { definition: unknown; css: string } {
  let css = '';
  const slots = definition.slots;
  if (multipart && (!slots?.length || new Set(slots).size !== slots.length))
    throw new Error('sva requires unique slots');
  function compile(
    style: StyleObject | Record<string, StyleObject> = {},
  ): string | Record<string, string> {
    if (multipart) {
      const output: Record<string, string> = {};
      for (const [slot, value] of Object.entries(style)) {
        if (!slots!.includes(slot)) throw new Error(`Unknown sva slot: ${slot}`);
        const result = compileStyles(value as StyleObject, context);
        output[slot] = result.className;
        css += result.css;
      }
      return output;
    }
    const result = compileStyles(style as StyleObject, context);
    css += result.css;
    return result.className;
  }
  for (const [key, value] of Object.entries(definition.defaultVariants ?? {})) {
    if (value != null && !definition.variants?.[key]?.[String(value)])
      throw new Error(`Unknown recipe default ${key}: ${value}`);
  }
  return {
    definition: {
      ...(multipart ? { slots } : {}),
      base: compile(definition.base),
      variants: Object.fromEntries(
        Object.entries(definition.variants ?? {}).map(([name, branches]) => [
          name,
          Object.fromEntries(
            Object.entries(branches).map(([branch, styles]) => [branch, compile(styles)]),
          ),
        ]),
      ),
      defaultVariants: definition.defaultVariants ?? {},
      compoundVariants: (definition.compoundVariants ?? []).map(
        ({ css: styles, ...predicates }) => {
          for (const [key, values] of Object.entries(predicates))
            for (const value of Array.isArray(values) ? values : [values]) {
              if (value != null && !definition.variants?.[key]?.[String(value)])
                throw new Error(`Unknown compound variant ${key}: ${value}`);
            }
          return { ...predicates, css: compile(styles) };
        },
      ),
    },
    get css() {
      return css;
    },
  };
}
