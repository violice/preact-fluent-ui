import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { Gallery } from './gallery';

afterEach(() => {
  cleanup();
  window.history.replaceState(null, '', '/');
  vi.unstubAllGlobals();
});
it('switches optional styles and restores settings on browser navigation', async () => {
  window.history.replaceState(null, '', '/?preset=minimal');
  render(<Gallery />);
  const preset = screen.getByLabelText('CSS preset');
  expect(document.querySelectorAll('link[data-gallery-optional]').length).toBe(0);
  await userEvent.setup().selectOptions(preset, 'full');
  await waitFor(() =>
    expect(document.querySelectorAll('link[data-gallery-optional]').length).toBe(2),
  );
  window.history.replaceState(null, '', '/?preset=minimal&theme=dark');
  window.dispatchEvent(new PopStateEvent('popstate'));
  await waitFor(() => expect((preset as HTMLSelectElement).value).toBe('minimal'));
  expect(document.querySelectorAll('link[data-gallery-optional]').length).toBe(0);
  expect((screen.getByLabelText('Appearance') as HTMLSelectElement).value).toBe('dark');
});

it('validates the required port inline and submits checkbox and switch selections', async () => {
  render(<Gallery />);
  const user = userEvent.setup();
  const port = screen.getByLabelText(/^Порт/);
  await user.click(screen.getByRole('button', { name: 'Сохранить подключение' }));
  expect(screen.getByText('Введите целый порт от 1 до 65535.')).toBeTruthy();
  expect(port.getAttribute('aria-invalid')).toBe('true');
  await user.type(port, '8080');
  await user.selectOptions(screen.getByLabelText('Адаптер'), 'ethernet');
  await user.click(screen.getByLabelText('Запомнить подключение'));
  await user.click(screen.getByRole('switch', { name: 'Автоматическое подключение' }));
  await user.click(screen.getByRole('button', { name: 'Сохранить подключение' }));
  expect(screen.queryByText('Введите целый порт от 1 до 65535.')).toBeNull();
  expect(port.hasAttribute('aria-invalid')).toBe(false);
  expect(
    screen.getByText('Сохранено: порт 8080, адаптер ethernet, запомнить да, автоматически да.'),
  ).toBeTruthy();
});
