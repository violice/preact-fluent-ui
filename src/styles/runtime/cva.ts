import type { CvaDefinition, CvaFunction, VariantDefinitions } from '../shared/recipe-types';
export function cva<const V extends VariantDefinitions>(
  _definition: CvaDefinition<V>,
): CvaFunction<V> {
  throw new Error('cva() requires the Fluent styles compiler; configure fluentStyles() in Vite');
}
