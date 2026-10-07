import { parseSync } from 'oxc-parser';

export function runtimeImports(js) {
  const { program, errors } = parseSync('library.js', js);
  if (errors.length) throw new Error('Cannot inspect library imports: ' + JSON.stringify(errors));
  const imports = [];
  function visit(node) {
    if (!node || typeof node !== 'object') return;
    if (
      [
        'ImportDeclaration',
        'ExportNamedDeclaration',
        'ExportAllDeclaration',
        'ImportExpression',
      ].includes(node.type) &&
      typeof node.source?.value === 'string'
    ) {
      imports.push(node.source.value);
    }
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach(visit);
      else if (value && typeof value === 'object') visit(value);
    }
  }
  visit(program);
  return imports;
}
