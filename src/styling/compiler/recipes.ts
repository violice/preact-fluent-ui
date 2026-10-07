import { styleHash } from '../shared/identity.ts';
import { cx } from '../runtime/cx.ts';
import { compileStyles } from './atomic.ts';
import type { StyleContext, StyleObject } from '../shared/types.ts';
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
  const marker = styleHash(JSON.stringify(definition));
  const markers = Object.fromEntries(
    (slots ?? []).map((slot) => [slot, `pfui-sva-${marker}-${styleHash(slot)}`]),
  );
  function selectors(style: StyleObject): StyleObject {
    return Object.fromEntries(
      Object.entries(style).map(([key, value]) => {
        const selector =
          typeof value === 'object' && value !== null
            ? key.replace(/\$([\w-]+)/g, (_, slot: string) => {
                if (!(slot in markers)) throw new Error(`Unknown sva selector slot: ${slot}`);
                return `.${markers[slot]}`;
              })
            : key;
        return [selector, typeof value === 'object' && value !== null ? selectors(value) : value];
      }),
    );
  }
  function compile(
    style: StyleObject | Record<string, StyleObject> = {},
  ): string | Record<string, string> {
    if (multipart) {
      const output: Record<string, string> = {};
      for (const [slot, value] of Object.entries(style)) {
        if (!slots!.includes(slot)) throw new Error(`Unknown sva slot: ${slot}`);
        const result = compileStyles(selectors(value as StyleObject), context, 'recipes');
        output[slot] = result.className;
        css += result.css;
      }
      return output;
    }
    const result = compileStyles(style as StyleObject, context, 'recipes');
    css += result.css;
    return result.className;
  }
  for (const [key, value] of Object.entries(definition.defaultVariants ?? {})) {
    if (value != null && !definition.variants?.[key]?.[String(value)])
      throw new Error(`Unknown recipe default ${key}: ${value}`);
  }
  const base = compile(definition.base);
  return {
    definition: {
      ...(multipart ? { slots } : {}),
      base: multipart
        ? Object.fromEntries(
            Object.entries(markers).map(([slot, name]) => [
              slot,
              cx(name, (base as Record<string, string>)[slot]),
            ]),
          )
        : base,
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
