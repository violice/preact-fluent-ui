import { BaseProcessor, validateParams } from '@wyw-in-js/processor-utils';

// Throwaway flat-object processor. Production normalization is outside this probe.
export default class PrototypeCssProcessor extends BaseProcessor {
  constructor(params, ...args) {
    validateParams(params, ['callee', 'call'], 'Prototype css expects one object');
    super([params[0]], ...args);
    if (params[1].length !== 2) throw new Error('Prototype css expects one object');
    this.expression = params[1][1];
    this.dependencies.push(this.expression);
  }
  get asSelector() {
    return `.${this.className}`;
  }
  get value() {
    return this.astService.stringLiteral(this.className);
  }
  doEvaltimeReplacement() {
    this.replacer(this.value, true);
  }
  doRuntimeReplacement() {
    this.replacer(this.value, true);
  }
  build(values) {
    const object = values.get(this.expression.ex.name);
    if (!object || typeof object !== 'object' || Array.isArray(object)) {
      throw this.expression.buildCodeFrameError('Prototype css requires a static style object');
    }
    const cssText = Object.entries(object)
      .map(([name, value]) => {
        if (typeof value !== 'string')
          throw this.expression.buildCodeFrameError('Prototype values must be static strings');
        return `${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}:${value};`;
      })
      .join('');
    this.artifacts.push([
      'css',
      [
        {
          [this.asSelector]: {
            className: this.className,
            cssText,
            displayName: this.displayName,
            start: this.location?.start,
          },
        },
        [],
      ],
    ]);
  }
}
