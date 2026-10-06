import { declarationClass } from '../identity.ts';
import { normalizeStyles } from '../normalize.ts';
import { cx } from '../cx.ts';
import type { Declaration, StyleContext, StyleObject } from '../types.ts';
const identities = new Map<string, string>();
export function compileDeclarations(declarations: Declaration[]): {
  className: string;
  css: string;
} {
  const rules = new Map<string, string>();
  for (const declaration of declarations) {
    const { property, value, selector, conditions } = declaration;
    const name = declarationClass(property, value, selector, conditions);
    const identity = JSON.stringify(declaration);
    if (identities.has(name) && identities.get(name) !== identity)
      throw new Error(`Style identifier collision: ${name}`);
    identities.set(name, identity);
    let rule = `${selector.replaceAll('&', `.${name}`)}{${property}:${value}}`;
    for (const condition of [...conditions].reverse()) rule = `${condition}{${rule}}`;
    rules.set(name, rule);
  }
  return {
    className: cx(...rules.keys()),
    css: `@layer fui.utilities{${[...rules.values()].join('')}}`,
  };
}
export function compileStyles(
  style: StyleObject,
  context: StyleContext = {},
): { className: string; css: string } {
  return compileDeclarations(normalizeStyles(style, context));
}
