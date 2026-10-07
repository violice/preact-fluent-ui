import { parseSync } from 'oxc-parser';
import type { Node, ObjectExpression } from 'oxc-parser';
import MagicString from 'magic-string';
import type { StyleContext } from '../shared/types.ts';
import { expandStyle } from '../shared/style-values.ts';
import { styleHash } from '../shared/identity.ts';
function names(node: Node): string[] {
  if (node.type === 'Identifier') return [node.name];
  if (node.type === 'RestElement') return names(node.argument);
  if (node.type === 'AssignmentPattern') return names(node.left);
  if (node.type === 'ObjectPattern')
    return node.properties.flatMap((property) =>
      names(property.type === 'RestElement' ? property.argument : property.value),
    );
  if (node.type === 'ArrayPattern')
    return node.elements.flatMap((element) => (element ? names(element) : []));
  return [];
}
export function transformDynamic(
  code: string,
  id: string,
  isSource: (source: string) => boolean,
  context: StyleContext = {},
): { code: string; map: ReturnType<MagicString['generateMap']> } | null {
  if (!code.includes('.dynamic')) return null;
  const parsed = parseSync(id, code);
  if (parsed.errors.length) throw new Error(parsed.errors[0].message);
  const bindings = new Map<string, string>();
  for (const statement of parsed.program.body)
    if (statement.type === 'ImportDeclaration' && isSource(statement.source.value)) {
      for (const specifier of statement.specifiers)
        if (
          specifier.type === 'ImportSpecifier' &&
          specifier.imported.type === 'Identifier' &&
          specifier.imported.name === 'css'
        )
          bindings.set(specifier.local.name, statement.source.value);
    }
  if (!bindings.size) return null;
  const output = new MagicString(code);
  let changed = false;
  const imports = new Map<string, string>();
  function hoisted(node: Node, scope: Set<string>): void {
    if (
      node.type === 'FunctionDeclaration' ||
      node.type === 'FunctionExpression' ||
      node.type === 'ArrowFunctionExpression'
    )
      return;
    if (node.type === 'VariableDeclaration' && node.kind === 'var')
      node.declarations
        .flatMap((declaration) => names(declaration.id))
        .forEach((name) => scope.add(name));
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) {
        for (const child of value)
          if (child && typeof child === 'object' && 'type' in child) hoisted(child as Node, scope);
      } else if (value && typeof value === 'object' && 'type' in value)
        hoisted(value as Node, scope);
    }
  }
  function visit(node: Node, shadows: Set<string>): void {
    let scope = shadows;
    if (
      node.type === 'FunctionDeclaration' ||
      node.type === 'FunctionExpression' ||
      node.type === 'ArrowFunctionExpression'
    ) {
      scope = new Set(scope);
      node.params.flatMap(names).forEach((name) => scope.add(name));
      if (node.type !== 'ArrowFunctionExpression' && node.id) scope.add(node.id.name);
      if (node.body) hoisted(node.body, scope);
    }
    if (
      node.type === 'CatchClause' ||
      node.type === 'ForStatement' ||
      node.type === 'ForOfStatement' ||
      node.type === 'ForInStatement'
    ) {
      scope = new Set(scope);
      const binding =
        node.type === 'CatchClause'
          ? node.param
          : node.type === 'ForStatement'
            ? node.init
            : node.left;
      if (binding?.type === 'VariableDeclaration')
        binding.declarations
          .flatMap((declaration) => names(declaration.id))
          .forEach((name) => scope.add(name));
      else if (binding && node.type === 'CatchClause')
        names(binding).forEach((name) => scope.add(name));
    }
    if (node.type === 'SwitchStatement') {
      visit(node.discriminant, shadows);
      scope = new Set(scope);
      for (const statement of node.cases.flatMap((branch) => branch.consequent)) {
        if (statement.type === 'VariableDeclaration')
          statement.declarations
            .flatMap((declaration) => names(declaration.id))
            .forEach((name) => scope.add(name));
        if (
          (statement.type === 'FunctionDeclaration' || statement.type === 'ClassDeclaration') &&
          statement.id
        )
          scope.add(statement.id.name);
      }
      for (const branch of node.cases) visit(branch, scope);
      return;
    }
    if (node.type === 'BlockStatement') {
      scope = new Set(scope);
      for (const statement of node.body) {
        if (statement.type === 'VariableDeclaration')
          statement.declarations
            .flatMap((declaration) => names(declaration.id))
            .forEach((name) => scope.add(name));
        if (
          (statement.type === 'FunctionDeclaration' || statement.type === 'ClassDeclaration') &&
          statement.id
        )
          scope.add(statement.id.name);
      }
    }
    if (
      node.type === 'CallExpression' &&
      node.callee.type === 'MemberExpression' &&
      !node.callee.computed &&
      node.callee.object.type === 'Identifier' &&
      node.callee.property.type === 'Identifier' &&
      node.callee.property.name === 'dynamic'
    ) {
      const local = node.callee.object.name;
      const source = bindings.get(local);
      if (source && !scope.has(local)) {
        const argument = node.arguments[0];
        if (node.arguments.length !== 1 || argument.type !== 'ObjectExpression')
          throw new Error(`${id}: css.dynamic requires one explicit object without spreads`);
        const entries: string[] = [];
        function style(object: ObjectExpression, path: string[]): string {
          return `{${object.properties
            .map((property) => {
              if (
                property.type !== 'Property' ||
                property.computed ||
                property.kind !== 'init' ||
                property.method
              )
                throw new Error(
                  `${id}: css.dynamic does not support spreads, computed keys or methods`,
                );
              const key =
                property.key.type === 'Identifier'
                  ? property.key.name
                  : property.key.type === 'Literal'
                    ? String(property.key.value)
                    : '';
              if (!key) throw new Error(`${id}: invalid css.dynamic property`);
              if (property.value.type === 'ObjectExpression')
                return `${JSON.stringify(key)}:${style(property.value, [...path, key])}`;
              const raw = code.slice(property.value.start, property.value.end);
              if (
                property.value.type === 'Literal' ||
                (property.value.type === 'UnaryExpression' &&
                  property.value.argument.type === 'Literal')
              )
                return `${JSON.stringify(key)}:${raw}`;
              const variable = `--pfui-local-${styleHash(`${id}:${node.start}:${[...path, key].join('.')}`)}`;
              entries.push(`[${JSON.stringify(variable)},(${raw}),${JSON.stringify(key)}]`);
              const expanded = expandStyle(key, `var(${variable})`);
              return expanded
                .map(
                  ([name, value]) =>
                    `${JSON.stringify(name)}:${JSON.stringify(expanded.length === 1 ? value : `var(${variable}-${name})`)}`,
                )
                .join(',');
            })
            .join(',')}}`;
        }
        const styles = style(argument, []);
        let helper = imports.get(source);
        if (!helper) {
          helper = `__pfuiDynamic_${styleHash(source + id)}`;
          while (code.includes(helper)) helper += '_';
          imports.set(source, helper);
        }
        output.overwrite(
          node.start,
          node.end,
          `${helper}(${local}(${styles}),[${entries.join(',')}],${JSON.stringify(context.tokens ?? {})})`,
        );
        changed = true;
        return;
      }
    }
    for (const value of Object.values(node)) {
      if (Array.isArray(value))
        for (const child of value) {
          if (child && typeof child === 'object' && 'type' in child) visit(child as Node, scope);
        }
      else if (value && typeof value === 'object' && 'type' in value) visit(value as Node, scope);
    }
  }
  visit(parsed.program, new Set());
  if (!changed) return null;
  for (const [source, helper] of imports)
    output.prepend(`import {__styleProps as ${helper}} from ${JSON.stringify(source)};\n`);
  return {
    code: output.toString(),
    map: output.generateMap({ source: id, includeContent: true, hires: true }),
  };
}
