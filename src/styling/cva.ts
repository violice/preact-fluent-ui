import type { CvaDefinition, CvaFunction, VariantDefinitions } from './recipe-types';
export function cva<const V extends VariantDefinitions>(
  _definition: CvaDefinition<V>,
): CvaFunction<V> {
  throw new Error('cva() requires the Fluent styling compiler; configure fluentStyles() in Vite');
}
