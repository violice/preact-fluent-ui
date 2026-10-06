import { createRef } from 'preact';
import { cleanup, render, screen } from '@testing-library/preact';
import { afterEach, expect, it } from 'vitest';
import { DataList, DataListItem, DataListLabel, DataListValue, StatusBadge } from '../../index';

afterEach(cleanup);

it('preserves native definition semantics, rich values, and refs', () => {
  const list = createRef<HTMLDListElement>();
  const item = createRef<HTMLDivElement>();
  const label = createRef<HTMLElement>();
  const value = createRef<HTMLElement>();
  const { unmount } = render(
    <DataList ref={list} aria-label="Profile" dir="rtl">
      <DataListItem ref={item}>
        <DataListLabel ref={label} id="name">
          Name
        </DataListLabel>
        <DataListValue ref={value}>
          <a href="/profile">Office</a>
          <StatusBadge>Connected</StatusBadge>
        </DataListValue>
      </DataListItem>
    </DataList>,
  );
  expect(
    [list.current, item.current, label.current, value.current].map((element) => element?.tagName),
  ).toEqual(['DL', 'DIV', 'DT', 'DD']);
  expect(item.current?.parentElement).toBe(list.current);
  expect(value.current?.parentElement).toBe(item.current);
  expect(screen.getByRole('link', { name: 'Office' }).getAttribute('href')).toBe('/profile');
  expect(screen.getByText('Connected').parentElement).toBe(value.current);
  expect(list.current?.dir).toBe('rtl');
  expect(list.current?.getAttribute('aria-label')).toBe('Profile');
  unmount();
  expect([list.current, item.current, label.current, value.current]).toEqual([
    null,
    null,
    null,
    null,
  ]);
});

it('consumes layout direction and keeps native hidden and primary classes', () => {
  const ref = createRef<HTMLDListElement>();
  const { rerender } = render(
    <DataList
      ref={ref}
      direction="vertical"
      hidden
      class="primary"
      className="fallback"
      data-kind="details"
    />,
  );
  expect(ref.current?.hasAttribute('direction')).toBe(false);
  expect(ref.current?.hidden).toBe(true);
  expect(ref.current?.dataset.kind).toBe('details');
  expect(ref.current?.classList.contains('primary')).toBe(true);
  expect(ref.current?.classList.contains('fallback')).toBe(false);
  rerender(<DataList ref={ref} direction="horizontal" />);
  expect(ref.current?.hasAttribute('direction')).toBe(false);
  expect(ref.current?.hidden).toBe(false);
  rerender(<DataList ref={ref} />);
  expect(ref.current?.tagName).toBe('DL');
});
