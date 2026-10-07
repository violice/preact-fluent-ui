// @vitest-environment node
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parseSync } from 'oxc-parser';
import { expect, it } from 'vitest';
async function files(directory: string): Promise<string[]> {
  return (
    await Promise.all(
      (await readdir(directory, { withFileTypes: true })).map((entry) => {
        const path = join(directory, entry.name);
        return entry.isDirectory() ? files(path) : [path];
      }),
    )
  ).flat();
}
it('keeps production components grouped, one component per file, without CSS Modules', async () => {
  const sources = await files('src/components');
  expect(sources.some((path) => path.endsWith('.module.css'))).toBe(false);
  for (const path of sources.filter(
    (path) => path.endsWith('.tsx') && !path.endsWith('.test.tsx'),
  )) {
    expect(path.split('/')).toHaveLength(4);
    const code = await readFile(path, 'utf8');
    expect(code).not.toContain('.module.css');
    const { program, errors } = parseSync(path, code);
    expect(errors).toEqual([]);
    const components = program.body.filter(
      (node) =>
        node.type === 'ExportNamedDeclaration' &&
        (node.declaration?.type === 'VariableDeclaration' ||
          node.declaration?.type === 'FunctionDeclaration'),
    );
    expect(components, path).toHaveLength(1);
  }
});
