import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor, within } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { Gallery } from './gallery';
import { FormsDemo } from '../examples/interactions';
import { ShellDocument } from '../examples/app-shell';

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
])('registers the %s canonical family page', async (slug, title) => {
  const { galleryPages } = await import('../routes/pages');
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
it('switches each style option and restores settings on browser navigation', async () => {
  history.replaceState(null, '', '/?reset=false&native=false');
  render(<Gallery />);
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'Appearance settings' }));
  const reset = screen.getByRole('switch', { name: 'Document reset (reset)' });
  const native = screen.getByRole('switch', { name: 'Native controls (native)' });
  expect(document.querySelectorAll('link[data-gallery-optional]')).toHaveLength(0);
  await user.click(reset);
  expect(document.querySelectorAll('link[data-gallery-optional]')).toHaveLength(1);
  expect((reset as HTMLInputElement).checked).toBe(true);
  expect((native as HTMLInputElement).checked).toBe(false);
  await user.click(native);
  expect(document.querySelectorAll('link[data-gallery-optional]')).toHaveLength(2);
  history.replaceState(null, '', '/?reset=false&native=true&theme=dark');
  window.dispatchEvent(new PopStateEvent('popstate'));
  await waitFor(() => expect((reset as HTMLInputElement).checked).toBe(false));
  expect((native as HTMLInputElement).checked).toBe(true);
  expect(document.querySelectorAll('link[data-gallery-optional]')).toHaveLength(1);
});

it('validates the required port inline and submits checkbox and switch selections', async () => {
  render(<FormsDemo />);
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
  expect(document.activeElement).toBe(screen.getByLabelText('Appearance'));
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
  history.replaceState(null, '', '/?theme=dark&reset=false&native=false');
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
  expect(location.pathname + location.search + location.hash).toBe(
    '/?theme=dark&reset=false&native=false',
  );
  expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Getting Started');
});

it('keeps form feedback immediately after its example and before its code', () => {
  render(<FormsDemo />);
  for (const buttonName of ['Save connection', 'Save sample']) {
    const preview = screen
      .getByRole('button', { name: buttonName })
      .closest('[data-gallery-preview]')!;
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
    expect(note.previousElementSibling!.hasAttribute('data-gallery-preview')).toBe(true);
    expect(note.closest('[data-gallery-preview]')).toBeNull();
    expect(note.closest('nav')).toBeNull();
  },
);

it.each(['button', 'dialog'])('keeps the %s sample result directly below its preview', (slug) => {
  history.replaceState(null, '', `/components/${slug}`);
  render(<Gallery base="/" />);
  const result = screen.getByText('Sample result').closest('[role="status"]')!;
  expect(result.closest('[data-gallery-preview]')).toBeNull();
  expect(result.previousElementSibling!.hasAttribute('data-gallery-preview')).toBe(true);
  expect(document.querySelector('[data-gallery-preview] [data-gallery-preview]')).toBeNull();
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
  expect(note.closest('[data-gallery-preview]')).toBeNull();
  expect(note.previousElementSibling!.hasAttribute('data-gallery-preview')).toBe(true);
  await user.keyboard('{Escape}');
  await user.click(screen.getByRole('button', { name: 'Reset samples' }));
  expect(screen.getByRole('button', { name: 'Open dialog' })).toBeTruthy();
});

it('keeps appearance reset with modal actions and resets custom palette without closing', async () => {
  history.replaceState(
    null,
    '',
    '/?reset=false&native=false&theme=dark&palette=custom&accent=%238b3366&primary=%23775533',
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
  expect((screen.getByLabelText('Appearance') as HTMLSelectElement).value).toBe('system');
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
  const { galleryPages } = await import('../routes/pages');
  history.replaceState(null, '', '/components/app-shell');
  render(<Gallery base="/" />);
  expect(screen.getByRole('heading', { name: 'AppShellToolbar', level: 3 })).toBeTruthy();
  expect(galleryPages.some((page) => /app-(shell-)?toolbar/.test(page.path))).toBe(false);
});
