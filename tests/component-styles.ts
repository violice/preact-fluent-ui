import { compileRecipe } from '../src/styling/compiler/recipes';
/** jsdom has no cascade-layer support. Keep rules and conditions, unwrap layers. */
export function flattenLayers(css: string): string {
  let result = '';
  for (let index = 0; index < css.length;) {
    const match = /^@layer\s+[^;{]+([;{])/.exec(css.slice(index));
    if (!match) {
      result += css[index++];
      continue;
    }
    index += match[0].length;
    if (match[1] === ';') continue;
    const start = index;
    let depth = 1;
    while (index < css.length && depth) {
      if (css[index] === '{') depth++;
      if (css[index] === '}') depth--;
      index++;
    }
    result += flattenLayers(css.slice(start, index - 1));
  }
  return result;
}
/** Evaluate our static recipe source with the compiler instead of the browser stub. */
export function recipeCss(source: string): string {
  const rules: string[] = [];
  const code = source
    .replace(/^import .*;\s*$/gm, '')
    .replace(/export const /g, 'const ')
    .replace(/export default [\s\S]*$/, '');
  const sva = (definition: Parameters<typeof compileRecipe>[0]) => {
    rules.push(compileRecipe(definition, {}, true).css);
    return () => ({});
  };
  new Function('sva', code)(sva);
  return flattenLayers(rules.join(''));
}
