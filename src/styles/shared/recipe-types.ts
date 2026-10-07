import type { StyleObject } from './types';
export type VariantDefinitions = Record<string, Record<string, StyleObject>>;
type Branch<Key> = Key extends 'true' | 'false' ? boolean : Key;
export type Selections<V> = { [Key in keyof V]?: Branch<keyof V[Key]> | null | undefined };
export interface CvaDefinition<V extends VariantDefinitions = VariantDefinitions> {
  base?: StyleObject;
  variants?: V;
  defaultVariants?: Selections<V>;
  compoundVariants?: readonly (Record<string, unknown> & { css: StyleObject })[];
}
export interface SvaDefinition {
  slots: readonly string[];
  base?: Record<string, StyleObject>;
  variants?: Record<string, Record<string, Record<string, StyleObject>>>;
  defaultVariants?: Record<string, string | boolean | null | undefined>;
  compoundVariants?: readonly (Record<string, unknown> & { css: Record<string, StyleObject> })[];
}
export type RecipeVariantProps<T extends (...args: never[]) => unknown> = NonNullable<
  Parameters<T>[0]
>;
export type RecipeVariant<T extends (...args: never[]) => unknown> = {
  [Key in keyof RecipeVariantProps<T>]-?: Exclude<RecipeVariantProps<T>[Key], null | undefined>;
};
export type CvaFunction<V> = (selection?: Selections<V>) => string;
export type SvaFunction<D extends SvaDefinition> = (
  selection?: Selections<NonNullable<D['variants']>>,
) => Record<D['slots'][number], string>;
