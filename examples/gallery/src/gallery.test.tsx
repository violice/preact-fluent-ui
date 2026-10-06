import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor, within } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { Gallery } from './gallery';
import { ShellDocument } from './gallery-app-shell-examples';

afterEach(() => {
  cleanup();
  window.history.replaceState(null, '', '/');
  vi.unstubAllGlobals();
});
it.each([
  ['table', 'Table'],
  ['pagination', 'Pagination'],
  ['toolbar', 'Toolbar'],
  ['data-list', 'DataList'],
  ['separator', 'Separator'],
  ['counter-badge', 'CounterBadge'],
  ['text', 'Text'],
  ['styling-engine', 'Styling engine'],
])('registers the %s canonical family page', async (slug, title) => {
  const { galleryPages } = await import('./gallery-pages');
  expect(galleryPages.find((page) => page.path === `/components/${slug}`)?.title).toBe(title);
  history.replaceState(null, '', `/components/${slug}`);
  render(<Gallery base="/" />);
  expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(title);
});

it('filters and pages the data table example through controlled components', async () => {
  history.replaceState(null, '', '/components/table');
  render(<Gallery base="/" />);
  const user = userEvent.setup();
  const table = screen.getByRole('table', { name: 'Connection profiles' });
  expect(table.textContent).toContain('Office');
  expect(table.textContent).not.toContain('Travel');
  await user.click(screen.getByRole('button', { name: 'Next' }));
  expect(table.textContent).toContain('Travel');
  await user.type(screen.getByRole('searchbox', { name: 'Search profiles' }), 'office');
  expect(table.textContent).toContain('Office');
  expect(table.textContent).not.toContain('Travel');
  expect(screen.getByRole('button', { name: 'Next' }).hasAttribute('disabled')).toBe(true);
});
it('switches optional styles and restores settings on browser navigation', async () => {
  window.history.replaceState(null, '', '/?preset=minimal');
  render(<Gallery />);
  await userEvent.setup().click(screen.getByRole('button', { name: 'Appearance settings' }));
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
  window.history.replaceState(null, '', '/guides/forms');
  render(<Gallery />);
  const user = userEvent.setup();
  const port = screen.getByLabelText(/^Port/);
  await user.click(screen.getByRole('button', { name: 'Save connection' }));
  expect(screen.getByText('Enter a whole port number from 1 to 65535.')).toBeTruthy();
  expect(port.getAttribute('aria-invalid')).toBe('true');
  await user.type(port, '8080');
  await user.selectOptions(screen.getByLabelText('Adapter'), 'ethernet');
  await user.click(screen.getByLabelText('Remember connection'));
  await user.click(screen.getByRole('switch', { name: 'Automatic connection' }));
  await user.click(screen.getByRole('button', { name: 'Save connection' }));
  expect(screen.queryByText('Enter a whole port number from 1 to 65535.')).toBeNull();
  expect(port.hasAttribute('aria-invalid')).toBe(false);
  expect(
    screen.getByText('Saved: port 8080, adapter ethernet, remember yes, automatic yes.'),
  ).toBeTruthy();
});

it('opens sidebar settings with initial focus and restores the opener', async () => {
  render(<Gallery base="/" />);
  const user = userEvent.setup();
  const opener = screen.getByRole('button', { name: 'Appearance settings' });
  expect(screen.queryByRole('dialog')).toBeNull();
  await user.click(opener);
  expect(screen.getByRole('dialog', { name: 'Appearance settings' })).toBeTruthy();
  expect(document.activeElement).toBe(screen.getByLabelText('CSS preset'));
  await user.selectOptions(screen.getByLabelText('Appearance'), 'dark');
  await user.keyboard('{Escape}');
  await waitFor(() => expect(document.activeElement).toBe(opener));
  await user.click(opener);
  expect((screen.getByLabelText('Appearance') as HTMLSelectElement).value).toBe('dark');
  history.pushState(null, '', '/components/button?theme=dark');
  window.dispatchEvent(new PopStateEvent('popstate'));
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  await waitFor(() =>
    expect(document.activeElement).toBe(screen.getByRole('heading', { level: 1 })),
  );
});

it('closes mobile navigation before settings and restores the visible toggle', async () => {
  render(<Gallery base="/" />);
  const toggle = screen.getByText('Navigation');
  toggle.style.display = 'inline-flex';
  const user = userEvent.setup();
  await user.click(toggle);
  await user.click(screen.getByRole('button', { name: 'Appearance settings' }));
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  document.getElementById('gallery-navigation')!.style.display = 'none';
  await user.click(screen.getByRole('button', { name: 'Close settings' }));
  await waitFor(() => expect(document.activeElement).toBe(toggle));
});

it('submits the getting started profile example without changing gallery navigation or settings', async () => {
  history.replaceState(null, '', '/?theme=dark&preset=minimal');
  render(<Gallery base="/" />);
  const user = userEvent.setup();
  const name = screen.getByRole('textbox', { name: 'Profile name' });
  await user.clear(name);
  await user.type(name, 'Remote office');
  await user.selectOptions(screen.getByLabelText('Connection type'), 'manual');
  await user.click(screen.getByRole('switch', { name: 'Connect automatically' }));
  await user.click(screen.getByRole('button', { name: 'Save profile' }));
  expect(
    screen.getByText('Saved Remote office with manual connection, automatic no.'),
  ).toBeTruthy();
  expect(location.pathname + location.search + location.hash).toBe('/?theme=dark&preset=minimal');
  expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Getting Started');
});

it('keeps form feedback immediately after its example and before its code', () => {
  history.replaceState(null, '', '/guides/forms');
  render(<Gallery base="/" />);
  for (const buttonName of ['Save connection', 'Save sample']) {
    const preview = screen.getByRole('button', { name: buttonName }).closest('[class*="preview"]')!;
    const feedback = preview.nextElementSibling!;
    expect(feedback.textContent).toContain('Sample result');
    expect(feedback.getAttribute('role')).toBe('status');
    expect(feedback.nextElementSibling!.querySelector('pre')).toBeTruthy();
  }
});

it.each(['sidebar'])(
  'keeps the %s local selection note outside the live example as feedback',
  (slug) => {
    history.replaceState(null, '', `/components/${slug}`);
    render(<Gallery base="/" />);
    const note = screen.getByText(/^Demo selection is local\./).closest('[role="status"]')!;
    expect(note).toBeTruthy();
    expect(note.previousElementSibling!.className).toContain('preview');
    expect(note.closest('[class*="preview"]')).toBeNull();
    expect(note.closest('nav')).toBeNull();
  },
);

it.each(['button', 'dialog'])('keeps the %s sample result directly below its preview', (slug) => {
  history.replaceState(null, '', `/components/${slug}`);
  render(<Gallery base="/" />);
  const result = screen.getByText('Sample result').closest('[role="status"]')!;
  expect(result.closest('[class*="preview"]')).toBeNull();
  expect(result.previousElementSibling!.className).toContain('preview');
  expect(document.querySelector('[class*="preview"] [class*="preview"]')).toBeNull();
});

it('places the removed dialog opener note below the preview', async () => {
  history.replaceState(null, '', '/components/dialog');
  render(<Gallery base="/" />);
  const user = userEvent.setup();
  await user.selectOptions(screen.getByLabelText('Dialog sample'), 'removed');
  await user.click(screen.getByRole('button', { name: 'Open dialog' }));
  const note = screen
    .getByText('The opener was removed. Reset samples restores it.')
    .closest('[role="status"]')!;
  expect(note.closest('[class*="preview"]')).toBeNull();
  expect(note.previousElementSibling!.className).toContain('preview');
  await user.keyboard('{Escape}');
  await user.click(screen.getByRole('button', { name: 'Reset samples' }));
  expect(screen.getByRole('button', { name: 'Open dialog' })).toBeTruthy();
});

it('keeps appearance reset with modal actions and resets custom palette without closing', async () => {
  history.replaceState(
    null,
    '',
    '/?preset=minimal&theme=dark&palette=custom&accent=%238b3366&primary=%23775533',
  );
  render(<Gallery base="/" />);
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'Appearance settings' }));
  const reset = screen.getByRole('button', { name: 'Reset appearance' });
  const close = screen.getByRole('button', { name: 'Close settings' });
  expect(reset.parentElement).toBe(close.parentElement);
  expect(screen.getByLabelText('Accent color')).toBeTruthy();
  expect(screen.getByLabelText('Primary color')).toBeTruthy();
  await user.click(reset);
  expect(screen.getByRole('dialog', { name: 'Appearance settings' })).toBeTruthy();
  expect((screen.getByLabelText('CSS preset') as HTMLSelectElement).value).toBe('full');
  expect((screen.getByLabelText('Appearance') as HTMLSelectElement).value).toBe('system');
  expect((screen.getByLabelText('Palette') as HTMLSelectElement).value).toBe('standard');
  expect(screen.queryByLabelText('Accent color')).toBeNull();
  expect(location.search).toBe('');
});

it('lets the application toolbar example change context and refresh status', async () => {
  render(<ShellDocument />);
  const user = userEvent.setup();
  await user.selectOptions(screen.getByRole('combobox', { name: 'Workspace context' }), 'lab');
  const toolbar = screen.getByRole('combobox', { name: 'Workspace context' }).parentElement!
    .parentElement!.parentElement!;
  expect(within(toolbar).getByRole('status').textContent).toContain('Lab');
  await user.click(screen.getByRole('button', { name: 'Refresh workspace' }));
  expect(within(toolbar).getByRole('status').textContent).toContain('Refreshed');
});

it('documents AppShellToolbar inside the shell family without constituent routes', async () => {
  const { galleryPages } = await import('./gallery-pages');
  history.replaceState(null, '', '/components/app-shell');
  render(<Gallery base="/" />);
  expect(screen.getByRole('heading', { name: 'AppShellToolbar', level: 3 })).toBeTruthy();
  expect(galleryPages.some((page) => /app-(shell-)?toolbar/.test(page.path))).toBe(false);
});
