import { createRef } from 'preact';
import { cleanup, render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it } from 'vitest';
import { Pagination } from '../../index';

afterEach(cleanup);
const labels = { previousLabel: 'Назад', nextLabel: 'Далее', 'aria-label': 'Страницы' };

it('navigates using one-based pages and disables boundary actions', async () => {
  const changes: number[] = [];
  const onPageChange = (page: number) => {
    changes.push(page);
  };
  const { rerender } = render(
    <Pagination {...labels} page={1} pageCount={3} onPageChange={onPageChange} />,
  );
  const previous = screen.getByRole('button', { name: 'Назад' }) as HTMLButtonElement;
  const next = screen.getByRole('button', { name: 'Далее' }) as HTMLButtonElement;
  expect(previous.disabled).toBe(true);
  expect(next.disabled).toBe(false);
  expect(screen.getByText('1 / 3')).toBeTruthy();
  const user = userEvent.setup();
  await user.click(previous);
  await user.click(next);
  expect(changes).toEqual([2]);
  rerender(<Pagination {...labels} page={3} pageCount={3} onPageChange={onPageChange} />);
  expect(next.disabled).toBe(true);
  expect(previous.disabled).toBe(false);
  await user.click(next);
  await user.click(previous);
  expect(changes).toEqual([2, 2]);
});

it('disables empty and explicitly disabled navigation', async () => {
  const changes: number[] = [];
  const onPageChange = (page: number) => {
    changes.push(page);
  };
  const { rerender } = render(
    <Pagination {...labels} page={1} pageCount={0} onPageChange={onPageChange} />,
  );
  expect(screen.getByText('0 / 0')).toBeTruthy();
  const user = userEvent.setup();
  for (const button of screen.getAllByRole('button')) {
    expect((button as HTMLButtonElement).disabled).toBe(true);
    await user.click(button);
  }
  rerender(<Pagination {...labels} page={2} pageCount={3} disabled onPageChange={onPageChange} />);
  for (const button of screen.getAllByRole('button')) {
    expect((button as HTMLButtonElement).disabled).toBe(true);
    await user.click(button);
  }
  expect(changes).toEqual([]);
});

it('clamps stale pages without emitting changes during rendering', async () => {
  const changes: number[] = [];
  const onPageChange = (page: number) => {
    changes.push(page);
  };
  const { rerender } = render(
    <Pagination {...labels} page={8} pageCount={10} onPageChange={onPageChange} />,
  );
  rerender(<Pagination {...labels} page={8} pageCount={3} onPageChange={onPageChange} />);
  expect(screen.getByText('3 / 3')).toBeTruthy();
  expect(changes).toEqual([]);
  await userEvent.setup().click(screen.getByRole('button', { name: 'Назад' }));
  expect(changes).toEqual([2]);
  rerender(<Pagination {...labels} page={0} pageCount={3} onPageChange={onPageChange} />);
  expect(screen.getByText('1 / 3')).toBeTruthy();
  await userEvent.setup().click(screen.getByRole('button', { name: 'Далее' }));
  expect(changes).toEqual([2, 2]);
});

it('preserves keyboard focus on controlled updates and formats localized labels', async () => {
  const ref = createRef<HTMLElement>();
  const changes: number[] = [];
  const onPageChange = (page: number) => {
    changes.push(page);
  };
  const formatPageLabel = (page: number, count: number) => (
    <strong>
      Страница {page} из {count}
    </strong>
  );
  const view = (page: number) => (
    <Pagination
      {...labels}
      ref={ref}
      page={page}
      pageCount={4}
      onPageChange={onPageChange}
      formatPageLabel={formatPageLabel}
      class="primary"
      className="fallback"
      data-kind="pages"
    />
  );
  const { rerender, unmount } = render(view(2));
  const nav = screen.getByRole('navigation', { name: 'Страницы' });
  expect(ref.current).toBe(nav);
  expect(nav.classList.contains('primary')).toBe(true);
  expect(nav.classList.contains('fallback')).toBe(false);
  expect(nav.dataset.kind).toBe('pages');
  const user = userEvent.setup();
  await user.tab();
  await user.tab();
  const next = screen.getByRole('button', { name: 'Далее' });
  expect(document.activeElement).toBe(next);
  await user.keyboard('{Enter}');
  expect(changes).toEqual([3]);
  rerender(view(3));
  expect(document.activeElement).toBe(next);
  expect(screen.getByText('Страница 3 из 4')).toBeTruthy();
  rerender(
    <Pagination {...labels} ref={ref} page={3} pageCount={4} onPageChange={onPageChange} hidden />,
  );
  expect(nav.hidden).toBe(true);
  expect(nav.hasAttribute('pageCount')).toBe(false);
  unmount();
  expect(ref.current).toBe(null);
});
