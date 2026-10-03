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
