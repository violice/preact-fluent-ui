import { createRef } from 'preact';
import { cleanup, render, screen } from '@testing-library/preact';
import { afterEach, expect, it } from 'vitest';
import { LoadingState, type LoadingStateProps } from '../../index';

afterEach(cleanup);

it('has one named status with a decorative spinner and optional description', () => {
  const props: LoadingStateProps = {
    label: 'Загрузка сохранённых резервных копий и настроек подключения к локальной сети',
  };
  const { rerender } = render(
    <LoadingState {...props}>Это может занять несколько секунд.</LoadingState>,
  );
  const status = screen.getByRole('status', { name: props.label });
  expect(screen.getAllByRole('status')).toHaveLength(1);
  expect(status.querySelector('[aria-hidden="true"]')).not.toBe(null);
  expect(screen.getByText('Это может занять несколько секунд.')).not.toBe(null);
  expect(screen.queryByRole('heading')).toBe(null);
  rerender(<LoadingState label="Обновление списка">Подключение установлено.</LoadingState>);
  expect(screen.getByRole('status', { name: 'Обновление списка' })).toBe(status);
  expect(screen.getByText('Подключение установлено.')).not.toBe(null);
  expect(screen.queryByText('Это может занять несколько секунд.')).toBe(null);
  rerender(<LoadingState label="Загрузка" appearance="inline" />);
  expect(screen.getAllByRole('status')).toHaveLength(1);
  expect(status.textContent).toBe('Загрузка');
  expect(status.hasAttribute('appearance')).toBe(false);
});

it('preserves native div props, refs, hidden and class slots', () => {
  const ref = createRef<HTMLDivElement>();
  const { unmount } = render(
    <LoadingState
      ref={ref}
      label="Loading"
      hidden
      id="loading-results"
      data-kind="pending"
      style={{ color: 'red' }}
      class="preferred"
      className="fallback"
      classes={{
        root: 'root-slot',
        spinner: 'spinner-slot',
        label: 'label-slot',
        content: 'content-slot',
      }}
    >
      Please wait
    </LoadingState>,
  );
  expect(ref.current?.tagName).toBe('DIV');
  expect(ref.current?.hidden).toBe(true);
  expect(ref.current?.id).toBe('loading-results');
  expect(ref.current?.dataset.kind).toBe('pending');
  expect(ref.current?.style.color).toBe('red');
  expect(ref.current?.classList.contains('preferred')).toBe(true);
  expect(ref.current?.classList.contains('fallback')).toBe(false);
  expect(ref.current?.classList.contains('root-slot')).toBe(true);
  expect(ref.current?.querySelector('.spinner-slot')?.getAttribute('aria-hidden')).toBe('true');
  expect(ref.current?.querySelector('.label-slot')?.textContent).toBe('Loading');
  expect(ref.current?.querySelector('.content-slot')?.textContent).toBe('Please wait');
  expect(ref.current?.hasAttribute('label')).toBe(false);
  unmount();
  expect(ref.current).toBe(null);
});

it('uses className when class is absent', () => {
  const ref = createRef<HTMLDivElement>();
  render(<LoadingState ref={ref} label="Loading" className="fallback" />);
  expect(ref.current?.classList.contains('fallback')).toBe(true);
});
