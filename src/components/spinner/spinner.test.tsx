import { createRef } from 'preact';
import { cleanup, render, screen } from '@testing-library/preact';
import { afterEach, expect, it } from 'vitest';
import { Spinner, type SpinnerProps } from '../../index';

afterEach(cleanup);

it('announces a localized label as one named status and updates it', () => {
  const label = 'Загрузка списка подключений и обновление информации об адаптерах сети';
  const props: SpinnerProps = { label, size: 'large' };
  const { rerender } = render(<Spinner {...props} />);
  const status = screen.getByRole('status', { name: label });
  expect(screen.getAllByRole('status')).toHaveLength(1);
  expect(status.textContent).toBe(label);
  expect(status.hasAttribute('aria-hidden')).toBe(false);
  rerender(<Spinner label="Обновление завершённых операций" size="small" />);
  expect(screen.getByRole('status', { name: 'Обновление завершённых операций' })).toBe(status);
  expect(screen.queryByText(label)).toBe(null);
});

it('becomes decorative without a label, including an empty label', () => {
  const ref = createRef<HTMLSpanElement>();
  const { rerender } = render(<Spinner ref={ref} label="Loading" />);
  rerender(<Spinner ref={ref} />);
  expect(screen.queryByRole('status')).toBe(null);
  expect(ref.current?.getAttribute('aria-hidden')).toBe('true');
  expect(ref.current?.hasAttribute('role')).toBe(false);
  expect(ref.current?.hasAttribute('aria-label')).toBe(false);
  rerender(<Spinner ref={ref} label="" />);
  expect(screen.queryByRole('status')).toBe(null);
  expect(ref.current?.getAttribute('aria-hidden')).toBe('true');
});

it('preserves native span props, ref and all class slots', () => {
  const ref = createRef<HTMLSpanElement>();
  const { unmount } = render(
    <Spinner
      ref={ref}
      label="Loading"
      hidden
      class="preferred"
      className="fallback"
      classes={{ root: 'root-slot', indicator: 'indicator-slot', label: 'label-slot' }}
      style={{ color: 'red' }}
      data-kind="spinner"
      id="pending"
    />,
  );
  expect(ref.current?.tagName).toBe('SPAN');
  expect(ref.current?.hidden).toBe(true);
  expect(ref.current?.id).toBe('pending');
  expect(ref.current?.dataset.kind).toBe('spinner');
  expect(ref.current?.style.color).toBe('red');
  expect(ref.current?.classList.contains('preferred')).toBe(true);
  expect(ref.current?.classList.contains('fallback')).toBe(false);
  expect(ref.current?.classList.contains('root-slot')).toBe(true);
  expect(ref.current?.querySelector('.indicator-slot')?.getAttribute('aria-hidden')).toBe('true');
  expect(ref.current?.querySelector('.label-slot')?.textContent).toBe('Loading');
  expect(ref.current?.hasAttribute('size')).toBe(false);
  expect(ref.current?.hasAttribute('label')).toBe(false);
  unmount();
  expect(ref.current).toBe(null);
});

it('uses className when class is absent', () => {
  const ref = createRef<HTMLSpanElement>();
  render(<Spinner ref={ref} className="fallback" />);
  expect(ref.current?.classList.contains('fallback')).toBe(true);
});
