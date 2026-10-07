import { afterEach, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { Gallery } from '../../app/gallery';

afterEach(() => {
  cleanup();
  history.replaceState(null, '', '/');
});

it.each(['css', 'css-dynamic', 'cx', 'cva', 'sva', 'token'])(
  'provides a live example for %s',
  (slug) => {
    history.replaceState(null, '', '/styles/' + slug);
    render(<Gallery />);
    const example = screen.getByRole('region', { name: 'Live example' });
    expect(example.textContent).toBeTruthy();
  },
);

it('updates dynamic style variables when the width changes', async () => {
  history.replaceState(null, '', '/styles/css-dynamic');
  render(<Gallery />);
  const width = screen.getByRole('spinbutton', { name: 'Width in pixels' });
  const preview = screen.getByLabelText('Dynamic width preview');
  const user = userEvent.setup();
  await user.clear(width);
  await user.type(width, '160');
  expect(preview.getAttribute('style')).toContain('160px');
});

it('selects recipe defaults, explicit variants and null suppression', async () => {
  history.replaceState(null, '', '/styles/cva');
  render(<Gallery />);
  const preview = screen.getByRole('button', { name: 'Recipe action' });
  const initial = preview.className;
  const user = userEvent.setup();
  await user.selectOptions(screen.getByLabelText('Recipe size'), 'large');
  expect(preview.className).not.toBe(initial);
  await user.selectOptions(screen.getByLabelText('Recipe size'), 'default');
  expect(preview.className).toBe(initial);
  await user.selectOptions(screen.getByLabelText('Recipe size'), 'none');
  expect(preview.className).not.toBe(initial);
});
