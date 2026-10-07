/** Two independent 32-bit accumulators; collision checks also run during compilation. */
export function styleHash(value: string): string {
  let first = 2166136261;
  let second = 5381;
  for (let i = 0; i < value.length; i++) {
    first = Math.imul(first ^ value.charCodeAt(i), 16777619);
    second = Math.imul(second, 33) ^ value.charCodeAt(i);
  }
  return `${(first >>> 0).toString(36)}${(second >>> 0).toString(36)}`;
}
export function declarationClass(
  property: string,
  value: string,
  selector = '&',
  conditions: readonly string[] = [],
  layer: 'utilities' | 'recipes' = 'utilities',
): string {
  return `pfui_${styleHash(JSON.stringify(layer === 'utilities' ? [selector, conditions] : [selector, conditions, layer]))}_${property}_${styleHash(value)}`;
}
