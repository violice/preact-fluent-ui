export function demoSource(source: string): string {
  return source
    .replaceAll('../../../../../../dist/components.js', '@violice/preact-fluent-ui/components')
    .replaceAll('../../../../../../.artifacts/gallery-styled-system/css', './styled-system/css');
}
