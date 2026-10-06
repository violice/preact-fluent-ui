import { overlappingShorthand } from './conflicts.ts';
import type { ClassValue } from './types';
/** Last engine declaration wins in its property/selector/condition context. */
export function cx(...values: ClassValue[]): string {
  const classes = new Map<string, string>();
  const coordinates = new Map<string, string>();
  function visit(value: ClassValue): void {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (typeof value !== 'string') return;
    for (const name of value.split(/\s+/)) {
      if (!name) continue;
      const match = /^fui_([a-z0-9]+)_([-a-zA-Z0-9]+)_([a-z0-9]+)$/.exec(name);
      const key = match ? `${match[1]}:${match[2]}` : name;
      if (match) {
        for (const existing of classes.keys()) {
          const [context, property] = existing.split(':');
          if (context !== match[1]) continue;
          const shorthand = overlappingShorthand(property, match[2]);
          if (shorthand)
            throw new Error(
              `Cannot compose ${shorthand} with its longhands; use explicit longhand declarations`,
            );
        }
        const physical = /^(padding|margin)-(top|right|bottom|left)$/.exec(match[2]);
        const logical = /^(padding|margin)-(inline|block)-(start|end)$/.exec(match[2]);
        if (physical || logical) {
          const group = `${match[1]}:${(physical ?? logical)![1]}`;
          const coordinate = physical ? 'physical' : 'logical';
          if (coordinates.has(group) && coordinates.get(group) !== coordinate)
            throw new Error(
              'Cannot compose logical and physical spacing in the same selector/condition',
            );
          coordinates.set(group, coordinate);
        }
      }
      classes.delete(key);
      classes.set(key, name);
    }
  }
  values.forEach(visit);
  return [...classes.values()].join(' ');
}
