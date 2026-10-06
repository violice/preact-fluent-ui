import type { JSX } from 'preact';
import { signal } from '@preact/signals';
import { act, cleanup, render } from '@testing-library/preact';
import { afterEach, expect, it } from 'vitest';
import { Button, Card, StatusBadge, Icon, DialogBody, DialogFooter } from '../../index';
afterEach(cleanup);
type Classes = {
  class: JSX.Signalish<string | undefined>;
  className: JSX.Signalish<string | undefined>;
};
const components = [
  ['Button', (props: Classes) => <Button {...props} />],
  ['Card', (props: Classes) => <Card {...props} />],
  ['StatusBadge', (props: Classes) => <StatusBadge {...props} />],
  ['Icon', (props: Classes) => <Icon name="info" {...props} />],
  ['DialogBody', (props: Classes) => <DialogBody {...props} />],
  ['DialogFooter', (props: Classes) => <DialogFooter {...props} />],
] as const;
it.each(components)('%s resolves class aliases after reading signals', (_, component) => {
  const primary = signal<string | undefined>('primary');
  const fallback = signal('fallback');
  const { container } = render(component({ class: primary, className: fallback }));
  const element = container.firstElementChild!;
  expect(element.classList.contains('primary')).toBe(true);
  expect(element.classList.contains('fallback')).toBe(false);
  act(() => {
    primary.value = '';
  });
  expect(element.classList.contains('primary')).toBe(false);
  expect(element.classList.contains('fallback')).toBe(false);
  act(() => {
    primary.value = undefined;
  });
  expect(element.classList.contains('fallback')).toBe(true);
  act(() => {
    fallback.value = 'updated';
  });
  expect(element.classList.contains('updated')).toBe(true);
  expect(element.classList.contains('fallback')).toBe(false);
});
