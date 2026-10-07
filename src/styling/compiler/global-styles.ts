import { cssName } from '../shared/style-values.ts';
import { fluentResetStyles } from '../config/fluent/reset-styles.ts';
import { fluentNativeStyles } from '../config/fluent/native-styles.ts';
import { normalizeStyles } from './normalize.ts';
import type { StyleContext, StyleObject } from '../shared/types.ts';
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

// Document defaults retain shorthands: background and border also reset image properties.
function generateDocumentRules(styles: Record<string, StyleObject>): string {
  return Object.entries(styles)
    .map(([selector, style]) => {
      if (selector.startsWith('@'))
        return `${selector}{${generateDocumentRules(style as Record<string, StyleObject>)}}`;
      const declarations = Object.entries(style)
        .filter(([, value]) => value != null)
        .map(([property, value]) => {
          if (typeof value === 'object') throw new Error('Document declarations must be static');
          return `${cssName(property)}:${value};`;
        })
        .join('');
      return `${selector}{${declarations}}`;
    })
    .join('');
}

export function generateResetCss(): string {
  return `${layerOrder}@layer reset{${generateDocumentRules(fluentResetStyles)}}`;
}

export function generateNativeCss(): string {
  return `${layerOrder}@layer native{${generateDocumentRules(fluentNativeStyles)}}`;
}

export function generateStylesCss(config: ResolvedConfig): string {
  const global = generateGlobalStyles(config.globalStyles, {
    tokens: tokenReferences(config),
    conditions: config.conditions,
  });
  return `${layerOrder}${config.reset ? generateResetCss() : ''}${config.native ? generateNativeCss() : ''}@layer base{${global}}${generateThemeCss(config)}`;
}
