export function variableName(path: string): string {
  return `--pfui-${path.replaceAll('.', '-')}`;
}
