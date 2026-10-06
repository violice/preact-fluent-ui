import { cx } from './cx';
type Selection = Record<string, string | boolean | null | undefined>;
interface CompiledRecipe<Value> {
  base?: Value;
  variants?: Record<string, Record<string, Value>>;
  defaultVariants?: Selection;
  compoundVariants?: (Record<string, unknown> & { css: Value })[];
}
function select<Value>(definition: CompiledRecipe<Value>, input: Selection = {}): Value[] {
  const selection = { ...definition.defaultVariants };
  for (const [key, value] of Object.entries(input)) if (value !== undefined) selection[key] = value;
  const output: Value[] = definition.base ? [definition.base] : [];
  for (const [key, branches] of Object.entries(definition.variants ?? {})) {
    const value = selection[key];
    if (value == null) continue;
    const branch = branches[String(value)];
    if (branch === undefined && value === false && 'true' in branches) continue;
    if (branch === undefined) {
      if (import.meta.env?.DEV) throw new Error(`Unknown recipe variant ${key}: ${value}`);
    } else output.push(branch);
  }
  for (const compound of definition.compoundVariants ?? []) {
    if (
      Object.entries(compound).every(
        ([key, value]) =>
          key === 'css' ||
          (Array.isArray(value) ? value.includes(selection[key]) : selection[key] === value),
      )
    )
      output.push(compound.css);
  }
  return output;
}
export function createCva(definition: CompiledRecipe<string>): (selection?: Selection) => string {
  return (selection) => cx(...select(definition, selection));
}
export function createSva(
  definition: CompiledRecipe<Record<string, string>> & { slots: readonly string[] },
): (selection?: Selection) => Record<string, string> {
  return (selection) => {
    const styles = select(definition, selection);
    return Object.fromEntries(
      definition.slots.map((slot) => [slot, cx(...styles.map((style) => style[slot]))]),
    );
  };
}
