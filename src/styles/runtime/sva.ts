import type { SvaDefinition, SvaFunction } from '../shared/recipe-types';
export function sva<const D extends SvaDefinition>(_definition: D): SvaFunction<D> {
  throw new Error('sva() requires the Fluent styles compiler; configure fluentStyles() in Vite');
}
