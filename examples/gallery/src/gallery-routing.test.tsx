import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor, within } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { Gallery } from './gallery';
import { galleryHref, normalizeGalleryPath } from './gallery-routing';
import { defaultSettings } from './gallery-settings';
afterEach(() => {
  cleanup();
  history.replaceState(null, '', '/');
});
it('normalizes only its base and carries settings in base-aware links', () => {
  expect(normalizeGalleryPath('/repo/components/button/', '/repo/')).toBe('/components/button');
  expect(normalizeGalleryPath('/other/button/', '/repo/')).toBe('/other/button');
  expect(galleryHref('/components/button', { ...defaultSettings, theme: 'dark' }, '/repo/')).toBe(
    '/repo/components/button?theme=dark',
  );
});
it('provides persistent controls, page landmarks, active links and transition focus', async () => {
  vi.stubGlobal('scrollTo', () => {});
  history.replaceState(null, '', '/?theme=dark');
  render(<Gallery base="/" />);
  expect(screen.getAllByRole('main')).toHaveLength(1);
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  expect(screen.getByText('Skip to content').getAttribute('href')).toBe('#main-content');
  const controls = screen.getByRole('button', { name: 'Appearance settings' });
  await userEvent.setup().click(screen.getByRole('link', { name: 'Button', exact: true }));
  await waitFor(() => expect(document.title).toBe('Button | Preact Fluent UI'));
  expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'Button', level: 1 }));
  expect(
    screen.getByRole('link', { name: 'Button', exact: true }).getAttribute('aria-current'),
  ).toBe('page');
  expect(screen.getByRole('button', { name: 'Appearance settings' })).toBe(controls);
  expect(location.search).toBe('?theme=dark');
});
it('renders 404 and closes the narrow navigation after choosing a page', async () => {
  history.replaceState(null, '', '/missing');
  render(<Gallery base="/" />);
  expect(screen.getByRole('heading', { name: 'Page not found', level: 1 })).toBeTruthy();
  const toggle = screen.getByText('Navigation');
  toggle.style.display = 'inline-flex';
  await userEvent.setup().click(toggle);
  expect(toggle.getAttribute('aria-expanded')).toBe('true');
  expect(document.getElementById(toggle.getAttribute('aria-controls')!)).toBeTruthy();
  await userEvent.setup().click(screen.getByRole('link', { name: 'Getting Started', exact: true }));
  await waitFor(() => expect(toggle.getAttribute('aria-expanded')).toBe('false'));
});
it('renders every component page with one heading and focused documentation', async () => {
  const { galleryPages } = await import('./gallery-pages');
  for (const page of galleryPages) {
    history.replaceState(null, '', page.path === '/' ? '/' : page.path + '/');
    const view = render(<Gallery base="/" />);
    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(page.title);
    if (page.group === 'Components') {
      expect(screen.getByRole('table')).toBeTruthy();
      expect(screen.getByRole('heading', { name: 'Accessibility', level: 2 })).toBeTruthy();
      expect(screen.getAllByRole('button', { name: 'Copy code' }).length).toBe(1);
    }
    view.unmount();
  }
});
it('supports a repository base and keyboard anchor navigation', async () => {
  history.replaceState(null, '', '/repo/components/button/?preset=minimal');
  render(<Gallery base="/repo/" />);
  const link = screen.getByRole('link', { name: 'Card', exact: true });
  expect(link.getAttribute('href')).toBe('/repo/components/card?preset=minimal');
  link.focus();
  await userEvent.setup().keyboard('{Enter}');
  await waitFor(() => expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Card'));
  await waitFor(() =>
    expect(document.activeElement).toBe(screen.getByRole('heading', { level: 1 })),
  );
});
it('synchronizes route and appearance through real Back and Forward', async () => {
  history.replaceState(null, '', '/?theme=dark');
  render(<Gallery base="/" />);
  const user = userEvent.setup();
  await user.click(screen.getByRole('link', { name: 'Button', exact: true }));
  await user.click(screen.getByRole('button', { name: 'Appearance settings' }));
  await user.selectOptions(screen.getByLabelText('Appearance'), 'light');
  await user.click(screen.getByRole('button', { name: 'Close settings' }));
  await user.click(screen.getByRole('link', { name: 'Card', exact: true }));
  history.back();
  await waitFor(() => expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Button'));
  await user.click(screen.getByRole('button', { name: 'Appearance settings' }));
  await screen.findByLabelText('Appearance');
  expect((screen.getByLabelText('Appearance') as HTMLSelectElement).value).toBe('light');
  await user.click(screen.getByRole('button', { name: 'Close settings' }));
  history.back();
  await waitFor(() => expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('About'));
  await user.click(screen.getByRole('button', { name: 'Appearance settings' }));
  await screen.findByLabelText('Appearance');
  expect((screen.getByLabelText('Appearance') as HTMLSelectElement).value).toBe('dark');
  await user.click(screen.getByRole('button', { name: 'Close settings' }));
  history.forward();
  await waitFor(() => expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Button'));
  await user.click(screen.getByRole('button', { name: 'Appearance settings' }));
  await screen.findByLabelText('Appearance');
  expect((screen.getByLabelText('Appearance') as HTMLSelectElement).value).toBe('light');
  await user.click(screen.getByRole('button', { name: 'Close settings' }));
});
it('leaves external and modified anchor clicks to the browser', () => {
  render(<Gallery base="/" />);
  const link = screen.getByRole('link', { name: 'Button', exact: true });
  for (const modifiers of [
    { ctrlKey: true },
    { metaKey: true },
    { shiftKey: true },
    { altKey: true },
    { button: 1 },
  ]) {
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, ...modifiers });
    let prevented: boolean | undefined;
    const observe = (event: Event) => {
      prevented = event.defaultPrevented;
      event.preventDefault();
    };
    window.addEventListener('click', observe, { once: true });
    link.dispatchEvent(event);
    expect(prevented).toBe(false);
  }
  const external = screen.getByRole('link', { name: 'Source on GitHub' });
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  let prevented: boolean | undefined;
  window.addEventListener(
    'click',
    (event) => {
      prevented = event.defaultPrevented;
      event.preventDefault();
    },
    { once: true },
  );
  external.dispatchEvent(event);
  expect(prevented).toBe(false);
  expect(location.pathname).toBe('/');
});
it('uses real signals for value, disabled and class demonstrations', async () => {
  history.replaceState(null, '', '/guides/signals');
  render(<Gallery base="/" />);
  const user = userEvent.setup();
  const field = screen.getByLabelText('Signal value');
  await user.clear(field);
  await user.type(field, 'Remote');
  expect(screen.getByText('Remote')).toBeTruthy();
  const button = screen.getByRole('button', { name: 'Signal button' });
  const original = button.className;
  await user.click(screen.getByLabelText('Disable the signal button'));
  expect((button as HTMLButtonElement).disabled).toBe(true);
  await user.click(screen.getByLabelText('Apply the signal class'));
  expect(button.className).not.toBe(original);
});
it('restores dialog focus and cleans up an open dialog during history navigation', async () => {
  history.replaceState(null, '', '/components/modal');
  render(<Gallery base="/" />);
  const user = userEvent.setup();
  const opener = screen.getByRole('button', { name: 'Open dialog' });
  await user.click(opener);
  expect(screen.getByRole('dialog')).toBeTruthy();
  await user.keyboard('{Escape}');
  await waitFor(() => expect(document.activeElement).toBe(opener));
  await user.click(opener);
  history.pushState(null, '', '/components/button');
  window.dispatchEvent(new PopStateEvent('popstate'));
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  await waitFor(() =>
    expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'Button', level: 1 })),
  );
  expect(document.body.style.overflow).not.toBe('hidden');
  expect(document.querySelector('[inert]')).toBeNull();
});
it('closes narrow navigation even when the selected link is already active', async () => {
  history.replaceState(null, '', '/components/button');
  render(<Gallery base="/" />);
  const toggle = screen.getByText('Navigation');
  toggle.style.display = 'inline-flex';
  const user = userEvent.setup();
  await user.click(toggle);
  const activeLink = screen.getByRole('link', { name: 'Button', exact: true });
  activeLink.focus();
  await user.keyboard('{Enter}');
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  await waitFor(() =>
    expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'Button', level: 1 })),
  );
});

it('keeps active desktop link focus and leaves modified mobile clicks expanded', async () => {
  history.replaceState(null, '', '/components/button');
  render(<Gallery base="/" />);
  const toggle = screen.getByText('Navigation');
  const activeLink = screen.getByRole('link', { name: 'Button', exact: true });
  const user = userEvent.setup();
  activeLink.focus();
  await user.keyboard('{Enter}');
  expect(document.activeElement).toBe(activeLink);
  toggle.style.display = 'inline-flex';
  await user.click(toggle);
  let prevented: boolean | undefined;
  window.addEventListener(
    'click',
    (event) => {
      prevented = event.defaultPrevented;
      event.preventDefault();
    },
    { once: true },
  );
  activeLink.dispatchEvent(
    new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true }),
  );
  expect(prevented).toBe(false);
  expect(toggle.getAttribute('aria-expanded')).toBe('true');
});
it('focuses the PageHeader demonstration heading after a client transition', async () => {
  render(<Gallery base="/" />);
  await userEvent.setup().click(screen.getByRole('link', { name: 'PageHeader', exact: true }));
  const heading = await screen.findByRole('heading', { name: 'PageHeader', level: 1 });
  expect(heading.getAttribute('tabindex')).toBe('-1');
  await waitFor(() => expect(document.activeElement).toBe(heading));
});

it('groups setup before guides and keeps styling separate from theming', async () => {
  render(<Gallery base="/" />);
  const nav = screen.getByRole('navigation', { name: 'Documentation' });
  expect(
    Array.from(nav.children)
      .map((group) => group.getAttribute('aria-labelledby'))
      .map((id) => document.getElementById(id!)?.textContent),
  ).toEqual(['Overview', 'Guides', 'Components']);
  await userEvent.setup().click(screen.getByRole('link', { name: 'Styling', exact: true }));
  expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Styling');
});

it('starts PageHeader documentation with its sole demonstration heading', () => {
  history.replaceState(null, '', '/components/page-header');
  render(<Gallery base="/" />);
  const main = screen.getByRole('main');
  const heading = screen.getByRole('heading', { level: 1, name: 'PageHeader' });
  const example = screen.getByRole('region', { name: 'PageHeader example' });
  expect(main.querySelector('h1, h2, p')).toBe(heading);
  expect(example.contains(heading)).toBe(true);
  expect(screen.queryByRole('heading', { name: 'Live example' })).toBeNull();
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
});

it('loads the decorative brand icon inside the configured repository base', () => {
  history.replaceState(null, '', '/repo/');
  render(<Gallery base="/repo/" />);
  const brand = screen.getByRole('link', { name: 'Preact Fluent UI', exact: true });
  const icon = brand.querySelector('img');
  expect(icon?.getAttribute('src')).toBe('/repo/favicon.png');
  expect(icon?.getAttribute('alt')).toBe('');
});

for (const [path, title] of [
  ['/components/sidebar', 'Sidebar'],
  ['/components/sidebar-nav', 'SidebarNav'],
  ['/components/sidebar-group', 'SidebarGroup'],
  ['/components/sidebar-item', 'SidebarItem'],
]) {
  it(`keeps ${title} demonstration selection local for pointer and keyboard activation`, async () => {
    history.replaceState(null, '', path + '?theme=dark');
    render(<Gallery base="/" />);
    const demo = screen.getByRole('region', { name: `${title} example` });
    const [first, second] = within(demo).getAllByRole('link');
    const user = userEvent.setup();
    await user.click(second);
    expect(location.pathname + location.search + location.hash).toBe(path + '?theme=dark');
    expect(second.getAttribute('aria-current')).toBe('page');
    first.focus();
    await user.keyboard('{Enter}');
    expect(first.getAttribute('aria-current')).toBe('page');
    for (const event of [
      new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true }),
      new MouseEvent('auxclick', { bubbles: true, cancelable: true, button: 1 }),
    ]) {
      second.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    }
    expect(location.pathname + location.search + location.hash).toBe(path + '?theme=dark');
    expect(document.title).toBe(`${title} | Preact Fluent UI`);
    const nav = screen.getByRole('navigation', { name: 'Documentation' });
    expect(
      within(nav).getByRole('link', { name: title, exact: true }).getAttribute('aria-current'),
    ).toBe('page');
  });
}

it('lists every component once in alphabetical order in the sidebar', () => {
  render(<Gallery base="/" />);
  const navigation = screen.getByRole('navigation', { name: 'Documentation' });
  const components = navigation.lastElementChild as HTMLElement;
  expect(
    within(components)
      .getAllByRole('link')
      .map((link) => link.textContent),
  ).toEqual([
    'Button',
    'Card',
    'Checkbox',
    'ConfirmDialog',
    'DialogBody',
    'DialogFooter',
    'DialogHeader',
    'EmptyState',
    'Field',
    'Icon',
    'InfoBar',
    'Input',
    'Modal',
    'PageHeader',
    'Select',
    'Sidebar',
    'SidebarFooter',
    'SidebarGroup',
    'SidebarHeader',
    'SidebarItem',
    'SidebarNav',
    'StatusBadge',
    'Switch',
    'Textarea',
  ]);
});
