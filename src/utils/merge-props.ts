import type { JSX } from 'preact';
import { cx } from '../styling/cx';
import { resolveClass } from './resolve-class';

type Handler = (...args: unknown[]) => unknown;

function isStyleObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

function isDefaultPrevented(value: unknown): boolean {
  return (
    value !== null &&
    typeof value === 'object' &&
    'defaultPrevented' in value &&
    value.defaultPrevented === true
  );
}

/**
 * Merges props left to right. Classes accumulate, object styles merge and
 * handlers run right to left until default is prevented. Each source's class
 * takes precedence over its className. Refs use ordinary right precedence;
 * useRender composes refs separately.
 */
export function mergeProps<P extends object>(...sources: (Partial<P> | null | undefined)[]): P {
  const result: Record<string, unknown> = {};
  for (const source of sources) {
    if (source == null) continue;
    const props = source as Record<string, unknown>;
    for (const key of Object.keys(props)) {
      if (key === 'class' || key === 'className') continue;
      const value = props[key];
      const previous = result[key];
      if (key === 'style' && isStyleObject(value)) {
        result[key] = { ...(isStyleObject(previous) ? previous : {}), ...value };
      } else if (
        key.startsWith('on') &&
        typeof value === 'function' &&
        typeof previous === 'function'
      ) {
        result[key] = (...args: unknown[]) => {
          (value as Handler)(...args);
          if (!isDefaultPrevented(args[0])) (previous as Handler)(...args);
        };
      } else {
        result[key] = value;
      }
    }
    if ('class' in props || 'className' in props) {
      result.class = cx(
        result.class as string | undefined,
        resolveClass(
          props.class as JSX.Signalish<string | undefined>,
          props.className as JSX.Signalish<string | undefined>,
        ),
      );
    }
  }
  return result as P;
}
