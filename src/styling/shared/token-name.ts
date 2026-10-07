export function variableName(path: string): string {
  if (/^spacing\.(1|2|3|4|5|6|8)$/.test(path)) return `--space-${path.split('.')[1]}`;
  return `--pfui-${path.replaceAll('.', '-')}`;
}
