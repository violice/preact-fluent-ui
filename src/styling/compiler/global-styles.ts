import { normalizeStyles } from '../normalize.ts';
import type { StyleContext, StyleObject } from '../types.ts';
import type { ResolvedConfig } from '../config/types.ts';
import { layerOrder } from './layers.ts';
import { generateThemeCss, tokenReferences } from './tokens.ts';

export function generateGlobalStyles(
  styles: Record<string, StyleObject>,
  context: StyleContext,
): string {
  return Object.entries(styles)
    .map(([selector, style]) => {
      if (
        selector.startsWith('@media') ||
        selector.startsWith('@supports') ||
        selector.startsWith('@container')
      )
        return `${selector}{${generateGlobalStyles(style as Record<string, StyleObject>, context)}}`;
      return normalizeStyles(style, context, selector)
        .map((declaration) => {
          let rule = `${declaration.selector}{${declaration.property}:${declaration.value}}`;
          for (const condition of [...declaration.conditions].reverse())
            rule = `${condition}{${rule}}`;
          return rule;
        })
        .join('');
    })
    .join('');
}

export function generateStylesCss(config: ResolvedConfig, reset = '', native = ''): string {
  const global = generateGlobalStyles(config.globalStyles, {
    tokens: tokenReferences(config),
    conditions: config.conditions,
  });
  return `${layerOrder}${config.reset ? reset : ''}${config.native ? native : ''}@layer base{${global}}${generateThemeCss(config)}`;
}
