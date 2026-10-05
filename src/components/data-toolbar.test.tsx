import { createRef } from 'preact';
import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { afterEach, expect, it } from 'vitest';
import { Button, DataToolbar, DataToolbarGroup, Input } from '../index';

afterEach(cleanup);

it('composes independent controls in reading order without toolbar keyboard semantics', () => {
  let clicks = 0;
  const values: string[] = [];
  const root = createRef<HTMLDivElement>();
  const group = createRef<HTMLDivElement>();
  const { unmount } = render(
    <DataToolbar ref={root} dir="rtl" aria-label="Filter routes">
      <DataToolbarGroup>
        <Input aria-label="Search" onInput={(event) => values.push(event.currentTarget.value)} />
      </DataToolbarGroup>
      <DataToolbarGroup ref={group} align="end">
        <Button onClick={() => clicks++}>Add</Button>
      </DataToolbarGroup>
    </DataToolbar>,
  );
  expect(root.current?.tagName).toBe('DIV');
  expect(root.current?.hasAttribute('role')).toBe(false);
  expect(root.current?.dir).toBe('rtl');
  expect(group.current?.parentElement).toBe(root.current);
  expect(group.current?.hasAttribute('align')).toBe(false);
  expect(
    [...root.current!.querySelectorAll('input, button')].map((element) => element.tagName),
  ).toEqual(['INPUT', 'BUTTON']);
  fireEvent.input(screen.getByRole('textbox'), { target: { value: 'office' } });
  fireEvent.click(screen.getByRole('button', { name: 'Add' }));
  expect(values).toEqual(['office']);
  expect(clicks).toBe(1);
  unmount();
  expect(root.current).toBe(null);
  expect(group.current).toBe(null);
});

it('forwards native attributes and class precedence to root and group', () => {
  const root = createRef<HTMLDivElement>();
  const group = createRef<HTMLDivElement>();
  render(
    <DataToolbar
      ref={root}
      hidden
      class="primary"
      className="fallback"
      id="filters"
      data-kind="filters"
    >
      <DataToolbarGroup ref={group} hidden class="group" className="ignored" />
    </DataToolbar>,
  );
  expect(root.current?.hidden).toBe(true);
  expect(root.current?.id).toBe('filters');
  expect(root.current?.dataset.kind).toBe('filters');
  expect(root.current?.classList.contains('primary')).toBe(true);
  expect(root.current?.classList.contains('fallback')).toBe(false);
  expect(group.current?.hidden).toBe(true);
  expect(group.current?.classList.contains('group')).toBe(true);
  expect(group.current?.classList.contains('ignored')).toBe(false);
});
