import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor, within } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { Gallery } from './gallery';
import { galleryHref, normalizeGalleryPath } from './gallery-routing';
import { defaultSettings } from './gallery-settings';
import libraryCss from '../../../dist/styles.css?raw';
import galleryCss from './gallery.module.css?raw';
import galleryClasses from './gallery.module.css';
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
      expect(screen.getAllByRole('table')[0]).toBeTruthy();
      for (const table of screen.getAllByRole('table')) {
        expect(table.querySelector('caption')).toBeNull();
        expect(
          document.getElementById(table.getAttribute('aria-labelledby')!)?.matches('h2, h3'),
        ).toBe(true);
      }
      expect(screen.getByRole('heading', { name: 'Accessibility', level: 2 })).toBeTruthy();
      expect(screen.getAllByRole('button', { name: 'Copy code' }).length).toBeGreaterThan(0);
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
  await waitFor(() =>
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Getting Started'),
  );
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
  history.replaceState(null, '', '/components/dialog');
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
  ).toEqual(['Overview', 'Guides', 'Components', 'Utils']);
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

for (const [path, title] of [['/components/sidebar', 'Sidebar']]) {
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

it('lists every component once in alphabetical order in the sidebar', async () => {
  render(<Gallery base="/" />);
  const navigation = screen.getByRole('navigation', { name: 'Documentation' });
  const components = navigation.children[2] as HTMLElement;
  const { galleryPages } = await import('./gallery-pages');
  expect(
    within(components)
      .getAllByRole('link')
      .map((link) => link.textContent),
  ).toEqual(
    galleryPages
      .filter((page) => page.group === 'Components')
      .map((page) => page.title)
      .sort((a, b) => a.localeCompare(b, 'en')),
  );
});

it('exposes all new utility and shell pages in base-aware navigation', async () => {
  history.replaceState(null, '', '/repo/?theme=dark');
  render(<Gallery base="/repo/" />);
  const nav = screen.getByRole('navigation', { name: 'Documentation' });
  expect(
    within(nav.lastElementChild as HTMLElement)
      .getAllByRole('link')
      .map((link) => link.textContent),
  ).toEqual(['mergeClasses', 'mergeProps', 'resolveClass', 'useRender']);
  for (const [slug, title] of [
    ['app-shell', 'AppShell'],
    ['sidebar', 'Sidebar'],
    ['dialog', 'Dialog'],
  ]) {
    expect(screen.getByRole('link', { name: title, exact: true }).getAttribute('href')).toBe(
      `/repo/components/${slug}?theme=dark`,
    );
  }
  await userEvent.setup().click(screen.getByRole('link', { name: 'useRender', exact: true }));
  await waitFor(() =>
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('useRender'),
  );
});

it('keeps rendered roots local and cancels earlier composed handlers', async () => {
  history.replaceState(null, '', '/utils/use-render?theme=dark');
  const view = render(<Gallery base="/" />);
  const user = userEvent.setup();
  await user.click(screen.getByRole('link', { name: 'Custom Link root' }));
  expect(location.pathname + location.search + location.hash).toBe('/utils/use-render?theme=dark');
  view.unmount();
  history.replaceState(null, '', '/utils/merge-props');
  render(<Gallery base="/" />);
  await user.click(screen.getByRole('button', { name: 'Run composed handlers' }));
  expect(screen.getByText('consumer → internal')).toBeTruthy();
  await user.click(screen.getByLabelText('Cancel the internal handler'));
  await user.click(screen.getByRole('button', { name: 'Run composed handlers' }));
  expect(screen.getByText('consumer (cancelled)')).toBeTruthy();
});

it('passes appearance and base to an isolated shell document with one gallery main', () => {
  history.replaceState(null, '', '/repo/components/app-shell?theme=dark&preset=minimal');
  render(<Gallery base="/repo/" />);
  expect(screen.getAllByRole('main')).toHaveLength(1);
  const preview = screen.getByTitle('Application shell preview');
  expect(preview.tagName).toBe('IFRAME');
  expect(preview.getAttribute('src')).toBe('/repo/shell-preview.html?preset=minimal&theme=dark');
});

it.each(['/', '/repo/'])(
  'uses the Getting Started homepage and canonical navigation for %s',
  (path) => {
    history.replaceState(null, '', path + '?theme=dark&preset=minimal');
    const base = path.startsWith('/repo') ? '/repo/' : '/';
    render(<Gallery base={base} />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Getting Started');
    const nav = screen.getByRole('navigation', { name: 'Documentation' });
    const start = within(nav).getByRole('link', { name: 'Getting Started', exact: true });
    expect(start.getAttribute('href')).toBe(base + '?preset=minimal&theme=dark');
    expect(start.getAttribute('aria-current')).toBe('page');
    expect(within(nav).getAllByRole('link', { name: 'Getting Started', exact: true })).toHaveLength(
      1,
    );
    expect(within(nav).getByRole('link', { name: 'About', exact: true }).getAttribute('href')).toBe(
      base + 'about?preset=minimal&theme=dark',
    );
  },
);

it('uses the public application shell workspace as its sole main landmark', () => {
  render(<Gallery base="/" />);
  const main = screen.getByRole('main');
  expect(main.hasAttribute('data-app-shell-workspace')).toBe(true);
  expect(main.parentElement?.getAttribute('data-navigation-layout')).toBe('expanded');
  expect(main.querySelector('[class*="content"]')).toBeTruthy();
});

it('uses app navigation with a library brand and fixed header and footer around the scrollable nav', async () => {
  render(<Gallery base="/" />);
  const aside = document.getElementById('gallery-navigation')!;
  const nav = screen.getByRole('navigation', { name: 'Documentation' });
  const brandLink = screen.getByRole('link', { name: 'Preact Fluent UI', exact: true });
  const brand = brandLink.querySelector('[data-has-logo]');
  expect(aside.hasAttribute('data-appearance')).toBe(false);
  expect(aside.getAttribute('data-scrollable')).toBe('true');
  expect(aside.getAttribute('data-layout')).toBe('expanded');
  expect(brand).toBeTruthy();
  expect(brand?.querySelector('[aria-hidden="true"] img')?.getAttribute('alt')).toBe('');
  expect(brand?.textContent).toContain('Documentation ·');
  expect(brandLink.querySelector('a, button')).toBeNull();
  expect(nav.parentElement).toBe(aside);
  expect(aside.firstElementChild?.contains(brandLink)).toBe(true);
  const footer = aside.lastElementChild!;
  expect(footer.contains(screen.getByRole('button', { name: 'Appearance settings' }))).toBe(true);
  expect(footer.contains(screen.getByRole('link', { name: 'Source on GitHub' }))).toBe(true);
  expect(nav.contains(footer)).toBe(false);
});

it('scrolls documentation links without scrolling the sidebar brand and actions', () => {
  const style = document.createElement('style');
  style.textContent =
    libraryCss +
    galleryCss.replace(/\.([a-zA-Z]+)\b/g, (selector, name: string) =>
      galleryClasses[name] ? `.${galleryClasses[name]}` : selector,
    );
  document.head.append(style);
  try {
    render(<Gallery base="/" />);
    const aside = document.getElementById('gallery-navigation')!;
    const nav = screen.getByRole('navigation', { name: 'Documentation' });
    expect(getComputedStyle(aside).overflow).toBe('hidden');
    expect(getComputedStyle(aside).overflowY).not.toBe('auto');
    expect(getComputedStyle(nav).overflowY).toBe('auto');
    expect(getComputedStyle(nav).minHeight).toBe('0px');
    expect(getComputedStyle(aside.firstElementChild!).flexShrink).toBe('0');
    expect(getComputedStyle(aside.lastElementChild!).flexShrink).toBe('0');
  } finally {
    style.remove();
  }
});

it('documents composite families on one canonical page with an API table for each export', async () => {
  const { galleryPages } = await import('./gallery-pages');
  for (const [slug, title, members] of [
    [
      'app-shell',
      'AppShell',
      ['AppShell', 'AppShellWorkspace', 'AppShellHeader', 'AppShellContent', 'AppShellFooter'],
    ],
    [
      'sidebar',
      'Sidebar',
      [
        'Sidebar',
        'SidebarHeader',
        'SidebarNav',
        'SidebarGroup',
        'SidebarItem',
        'SidebarFooter',
        'SidebarBrand',
      ],
    ],
    ['dialog', 'Dialog', ['Modal', 'DialogHeader', 'DialogBody', 'DialogFooter', 'ConfirmDialog']],
  ] as const) {
    history.replaceState(null, '', `/components/${slug}`);
    const view = render(<Gallery base="/" />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(title);
    expect(screen.getByRole('heading', { name: 'API reference', level: 2 })).toBeTruthy();
    const nav = screen.getByRole('navigation', { name: 'Documentation' });
    expect(within(nav).getByRole('link', { name: title, exact: true })).toBeTruthy();
    for (const member of members) {
      expect(screen.getByRole('heading', { name: member, level: 3 })).toBeTruthy();
      expect(screen.getByRole('table', { name: member })).toBeTruthy();
      if (member !== title)
        expect(within(nav).queryByRole('link', { name: member, exact: true })).toBeNull();
    }
    expect(screen.queryByRole('heading', { name: 'Props', level: 2 })).toBeNull();
    view.unmount();
  }
  expect(galleryPages.some((page) => page.path === '/getting-started')).toBe(false);
  for (const path of [
    '/getting-started',
    '/components/modal',
    '/components/confirm-dialog',
    '/components/sidebar-nav',
    '/components/app-shell-workspace',
  ]) {
    expect(galleryPages.some((page) => page.path === path)).toBe(false);
    history.replaceState(null, '', path);
    const view = render(<Gallery base="/" />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Page not found');
    view.unmount();
  }
});

it.each(['use-render', 'merge-props', 'merge-classes', 'resolve-class'])(
  'documents parameters and returns alongside the %s signature',
  (slug) => {
    history.replaceState(null, '', `/utils/${slug}`);
    render(<Gallery base="/" />);
    const heading = screen.getByRole('heading', { name: 'API reference', level: 2 });
    const api = within(heading.parentElement!);
    expect(api.getByRole('columnheader', { name: 'Parameter' })).toBeTruthy();
    expect(api.getByRole('columnheader', { name: 'Type' })).toBeTruthy();
    expect(api.getByRole('columnheader', { name: 'Description' })).toBeTruthy();
    expect(api.getByRole('rowheader', { name: 'Return value' })).toBeTruthy();
    expect(api.getByRole('table', { name: 'API reference' }).querySelector('caption')).toBeNull();
    expect(heading.parentElement!.querySelector('pre code')?.textContent).toContain('(');
    expect(screen.queryByRole('heading', { name: 'Signature', level: 2 })).toBeNull();
  },
);
