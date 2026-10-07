import { layerOrder } from './layers.ts';
import { declarationClass } from '../shared/identity.ts';
import { normalizeStyles } from './normalize.ts';
import { cx } from '../runtime/cx.ts';
import type { Declaration, StyleContext, StyleObject } from '../shared/types.ts';
const identities = new Map<string, string>();
export function compileDeclarations(
  declarations: Declaration[],
  layer: 'utilities' | 'recipes' = 'utilities',
): {
  className: string;
  css: string;
} {
  const rules = new Map<string, string>();
  for (const declaration of declarations) {
    const { property, value, selector, conditions } = declaration;
    const name = declarationClass(property, value, selector, conditions, layer);
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
    css: `${layerOrder}@layer ${layer}{${[...rules.values()].join('')}}`,
  };
}
export function compileStyles(
  style: StyleObject,
  context: StyleContext = {},
  layer: 'utilities' | 'recipes' = 'utilities',
): { className: string; css: string } {
  let globals = '';
  function extract(input: StyleObject, nested = false): StyleObject {
    const local: StyleObject = {};
    for (const [key, value] of Object.entries(input)) {
      if (key.startsWith('@keyframes')) {
        if (nested) throw new Error('Keyframes must be declared at the top level');
        if (!/^@keyframes [A-Za-z_][\w-]*$/.test(key) || !value || typeof value !== 'object')
          throw new Error(`Invalid keyframes definition: ${key}`);
        const frames = Object.entries(value)
          .map(([frame, declarations]) => {
            if (
              !/^(from|to|(?:\d+(?:\.\d+)?%)(?:\s*,\s*\d+(?:\.\d+)?%)*)$/.test(frame) ||
              !declarations ||
              typeof declarations !== 'object'
            )
              throw new Error(`Invalid keyframe selector: ${frame}`);
            if (
              Object.values(declarations).some((item) => item !== null && typeof item === 'object')
            )
              throw new Error('Keyframes do not support nested selectors');
            const normalized = normalizeStyles(declarations, context);
            return `${frame}{${normalized.map((declaration) => `${declaration.property}:${declaration.value}`).join(';')}}`;
          })
          .join('');
        const rule = `${key}{${frames}}`;
        globals += rule;
      } else local[key] = value && typeof value === 'object' ? extract(value, true) : value;
    }
    return local;
  }
  const output = compileDeclarations(normalizeStyles(extract(style), context), layer);
  return {
    className: output.className,
    css: globals ? `${output.css}@layer ${layer}{${globals}}` : output.css,
  };
}
