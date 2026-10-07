import { signal } from '@preact/signals';
import { describe, expect, it } from 'vitest';
import { mergeProps } from './index';

describe('mergeProps', () => {
  it('applies ordinary right precedence without mutating sources', () => {
    const left = Object.freeze({ id: 'left', title: 'retained', ref: 'left-ref' });
    const right = Object.freeze({ id: 'right', ref: 'right-ref' });
    expect(
      mergeProps<{ id?: string; title?: string; ref?: string }>(left, null, undefined, right),
    ).toEqual({
      id: 'right',
      title: 'retained',
      ref: 'right-ref',
    });
    expect(mergeProps()).toEqual({});
    expect(mergeProps(left, { id: undefined }).id).toBeUndefined();
  });

  it('calls handlers from right to left exactly once with the original arguments', () => {
    const calls: string[] = [];
    const event = new Event('click', { cancelable: true });
    const handler = (name: string) => (received: Event, value: string) => {
      expect(received).toBe(event);
      expect(value).toBe('argument');
      calls.push(name);
    };
    const props = mergeProps(
      { onClick: handler('internal') },
      { onClick: handler('middle') },
      { onClick: handler('external') },
    );
    props.onClick(event, 'argument');
    expect(calls).toEqual(['external', 'middle', 'internal']);
  });

  it('stops earlier handlers when an external handler prevents default', () => {
    const calls: string[] = [];
    const props = mergeProps(
      { onClick: () => calls.push('internal') },
      {
        onClick: (event: Event) => {
          calls.push('external');
          event.preventDefault();
        },
      },
    );
    props.onClick(new Event('click', { cancelable: true }));
    expect(calls).toEqual(['external']);
  });

  it('composes custom callbacks with no event or a non-event argument', () => {
    const calls: unknown[] = [];
    const props = mergeProps(
      { onValueChange: (value?: string) => calls.push(['internal', value]) },
      { onValueChange: (value?: string) => calls.push(['external', value]) },
    );
    props.onValueChange();
    props.onValueChange('hello');
    expect(calls).toEqual([
      ['external', undefined],
      ['internal', undefined],
      ['external', 'hello'],
      ['internal', 'hello'],
    ]);
  });

  it('resolves each source class alias before merging classes in source order', () => {
    expect(
      mergeProps<{ class?: unknown; className?: unknown }>(
        { class: signal('first'), className: 'ignored' },
        { class: '', className: 'also-ignored' },
        { className: signal('last') },
      ),
    ).toEqual({ class: 'first last' });
  });

  it('merges object styles without mutating their objects', () => {
    const left = Object.freeze({ color: 'red', padding: 4 });
    const right = Object.freeze({ color: 'blue' });
    const props = mergeProps<{ style: Record<string, string | number> }>(
      { style: left },
      { style: right },
    );
    expect(props.style).toEqual({ color: 'blue', padding: 4 });
    expect(props.style).not.toBe(left);
    expect(props.style).not.toBe(right);
  });

  it('replaces styles when changing between object and string', () => {
    expect(
      mergeProps<{ style: unknown }>({ style: { color: 'red' } }, { style: 'color:blue' }).style,
    ).toBe('color:blue');
    expect(
      mergeProps<{ style: unknown }>({ style: 'color:red' }, { style: { padding: 4 } }).style,
    ).toEqual({ padding: 4 });
  });
});
