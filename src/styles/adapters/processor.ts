import { BaseProcessor, validateParams } from '@wyw-in-js/processor-utils';
import type {
  AstService,
  Expression,
  Params,
  TailProcessorParams,
  ValueCache,
} from '@wyw-in-js/processor-utils';
import { cx } from '../runtime/cx.ts';
import { compileStyles } from '../compiler/atomic.ts';
import { compileRecipe } from '../compiler/recipes.ts';
import type { StyleContext, StyleObject } from '../shared/types.ts';
function literal(ast: AstService, value: unknown): Expression {
  if (value == null) return ast.nullLiteral();
  if (typeof value === 'string') return ast.stringLiteral(value);
  if (typeof value === 'number') return ast.numericLiteral(value);
  if (typeof value === 'boolean') return ast.booleanLiteral(value);
  if (Array.isArray(value)) return ast.arrayExpression(value.map((item) => literal(ast, item)));
  return ast.objectExpression(
    Object.entries(value as object).map(([key, item]) =>
      ast.objectProperty(ast.stringLiteral(key), literal(ast, item)),
    ),
  );
}
export default class FluentProcessor extends BaseProcessor {
  private output: { className?: string; definition?: unknown; css: string } = { css: '' };
  constructor(params: Params, ...args: TailProcessorParams) {
    validateParams(params, ['callee', 'call'], BaseProcessor.SKIP);
    super([params[0]], ...args);
    if (params[1][0] !== 'call' || params[1].length < 2)
      throw new Error('Fluent styles expects an object');
    this.dependencies.push(...(params[1].slice(1) as typeof this.dependencies));
  }
  get asSelector(): string {
    return `.${this.className}`;
  }
  get value(): Expression {
    return this.tagSource.imported === 'css'
      ? this.astService.stringLiteral(this.className)
      : this.astService.arrowFunctionExpression([], this.astService.stringLiteral(this.className));
  }
  doEvaltimeReplacement(): void {
    this.replacer(this.value, true);
  }
  doRuntimeReplacement(): void {
    if (this.tagSource.imported === 'css')
      this.replacer(this.astService.stringLiteral(this.output.className ?? ''), true);
    else {
      const helper = this.astService.addNamedImport(
        this.tagSource.imported === 'cva' ? '__createCva' : '__createSva',
        this.tagSource.source,
      );
      this.replacer(
        this.astService.callExpression(helper, [literal(this.astService, this.output.definition)]),
        true,
      );
    }
  }
  build(values: ValueCache): void {
    const objects = this.dependencies.map((expression) => {
      const value = 'value' in expression ? expression.value : values.get(expression.ex.name);
      if (!value || typeof value !== 'object' || Array.isArray(value))
        throw expression.buildCodeFrameError('Fluent styles requires a static object');
      return value;
    });
    const context =
      (this.options.processors as { fluent?: StyleContext } | undefined)?.fluent ?? {};
    if (this.tagSource.imported === 'css') {
      const outputs = objects.map((object) => compileStyles(object as StyleObject, context));
      this.output = {
        className: cx(...outputs.map((output) => output.className)),
        css: outputs.map((output) => output.css).join(''),
      };
    } else this.output = compileRecipe(objects[0], context, this.tagSource.imported === 'sva');
    this.artifacts.push([
      'css',
      [
        {
          [this.asSelector]: {
            atom: true,
            className: this.className,
            cssText: this.output.css,
            displayName: this.displayName,
            start: this.location?.start,
          },
        },
        [],
      ],
    ]);
  }
}
