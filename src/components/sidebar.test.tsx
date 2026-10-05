import { createRef } from 'preact';
import { signal as reactiveSignal } from '@preact/signals';
import sidebarCss from './sidebar.module.css?raw';
import sidebarClasses from './sidebar.module.css';
import type { JSX } from 'preact';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/preact';
import { afterEach, expect, it, vi } from 'vitest';
import {
  Sidebar,
  SidebarHeader,
  SidebarNav,
  SidebarGroup,
  SidebarItem,
  SidebarFooter,
  SidebarBrand,
} from './sidebar';

afterEach(cleanup);
const signal = <T,>(value: T): JSX.SignalLike<T> => ({
  value,
  peek: () => value,
  subscribe: () => () => {},
});

it('composes native landmarks and uniquely labelled groups without structural wrappers', () => {
  const aside = createRef<HTMLElement>();
  const header = createRef<HTMLDivElement>();
  const nav = createRef<HTMLElement>();
  const group = createRef<HTMLDivElement>();
  const footer = createRef<HTMLDivElement>();
  const { container } = render(
    <Sidebar ref={aside} id="sidebar" className="fallback">
      <SidebarHeader ref={header}>Brand</SidebarHeader>
      <SidebarNav ref={nav} aria-label="Documentation">
        <SidebarGroup ref={group} label="Start">
          <SidebarItem href="/">Overview</SidebarItem>
        </SidebarGroup>
        <SidebarGroup label="Components">
          <SidebarItem href="/button">Button</SidebarItem>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarItem href="/guide">Guide</SidebarItem>
        </SidebarGroup>
      </SidebarNav>
      <SidebarFooter ref={footer}>Settings</SidebarFooter>
    </Sidebar>,
  );
  expect(aside.current).toBe(screen.getByRole('complementary'));
  expect(aside.current?.parentElement).toBe(container);
  expect(aside.current?.classList.contains('fallback')).toBe(true);
  expect(header.current?.parentElement).toBe(aside.current);
  expect(footer.current?.parentElement).toBe(aside.current);
  expect(nav.current).toBe(screen.getByRole('navigation', { name: 'Documentation' }));
  const start = screen.getByRole('group', { name: 'Start' });
  const components = screen.getByRole('group', { name: 'Components' });
  expect(group.current).toBe(start);
  expect(start.getAttribute('aria-labelledby')).not.toBe(
    components.getAttribute('aria-labelledby'),
  );
  expect(start.contains(document.getElementById(start.getAttribute('aria-labelledby')!))).toBe(
    true,
  );
  expect(screen.getByRole('link', { name: 'Guide' }).closest('[aria-labelledby]')).toBeNull();
});

it('preserves anchor attributes, modifiers and ref while deriving current-page state', () => {
  const ref = createRef<HTMLAnchorElement>();
  let clicked: MouseEvent | undefined;
  const { rerender } = render(
    <SidebarItem
      href="/button"
      active
      ref={ref}
      target="_blank"
      rel="noopener"
      download="example"
      onClick={(event) => {
        clicked = event;
      }}
    >
      Button
    </SidebarItem>,
  );
  const link = screen.getByRole('link', { name: 'Button' });
  expect(ref.current).toBe(link);
  expect(link.getAttribute('href')).toBe('/button');
  expect(link.getAttribute('target')).toBe('_blank');
  expect(link.getAttribute('rel')).toBe('noopener');
  expect(link.getAttribute('download')).toBe('example');
  expect(link.getAttribute('aria-current')).toBe('page');
  fireEvent.click(link, { ctrlKey: true, metaKey: true, shiftKey: true, button: 1 });
  expect(clicked?.ctrlKey).toBe(true);
  expect(clicked?.metaKey).toBe(true);
  expect(clicked?.shiftKey).toBe(true);
  expect(clicked?.button).toBe(1);
  expect(clicked?.defaultPrevented).toBe(false);
  rerender(
    <SidebarItem href="/button" active={false}>
      Button
    </SidebarItem>,
  );
  expect(link.hasAttribute('aria-current')).toBe(false);
});

it('reads signal-like values on rerender, adds slots and consumes component props', () => {
  const active = signal(false);
  const classValue = signal<string | undefined>(undefined);
  const slot = signal('root-one');
  const view = () => (
    <SidebarGroup
      label="Start"
      class={classValue}
      className="fallback"
      classes={{ root: slot, label: 'label-slot', content: 'group-content' }}
    >
      <SidebarItem
        href="/"
        active={active}
        icon={<span>Icon</span>}
        class={classValue}
        className="fallback"
        classes={{ root: slot, icon: 'icon-slot', content: 'item-content' }}
      >
        Overview
      </SidebarItem>
    </SidebarGroup>
  );
  const { container, rerender } = render(view());
  const link = screen.getByRole('link', { name: 'Overview' });
  const root = screen.getByRole('group');
  expect(link.classList.contains('fallback')).toBe(true);
  expect(root.classList.contains('root-one')).toBe(true);
  expect(screen.getByText('Start').classList.contains('label-slot')).toBe(true);
  expect(link.parentElement?.classList.contains('group-content')).toBe(true);
  expect(screen.getByText('Icon').parentElement?.classList.contains('icon-slot')).toBe(true);
  expect(screen.getByText('Overview').classList.contains('item-content')).toBe(true);
  expect(container.querySelector('[classes], [active], [icon], [label]')).toBeNull();
  active.value = true;
  classValue.value = '';
  slot.value = 'root-two';
  rerender(view());
  expect(link.getAttribute('aria-current')).toBe('page');
  expect(link.classList.contains('fallback')).toBe(false);
  expect(root.classList.contains('fallback')).toBe(false);
  expect(link.classList.contains('root-two')).toBe(true);
  expect(link.classList.contains('root-one')).toBe(false);
  classValue.value = 'primary';
  rerender(view());
  expect(link.classList.contains('primary')).toBe(true);
  expect(link.classList.contains('item-content')).toBe(false);
});

it('preserves native hidden without the optional document reset on every sidebar part', () => {
  for (const part of ['sidebar', 'header', 'nav', 'group', 'item', 'footer']) {
    expect(sidebarCss).toMatch(new RegExp(`\\.${part}\\[hidden\\]`));
  }
  const style = document.createElement('style');
  style.textContent = sidebarCss.replace(/\.([a-zA-Z]+)\b/g, (selector, name: string) =>
    sidebarClasses[name] ? `.${sidebarClasses[name]}` : selector,
  );
  document.head.append(style);
  try {
    for (const part of ['sidebar', 'header', 'nav', 'group', 'item', 'footer']) {
      const hiddenRule = Array.from(style.sheet!.cssRules).find(
        (rule) =>
          rule instanceof CSSStyleRule &&
          rule.selectorText.includes(`.${sidebarClasses[part]}[hidden]`),
      ) as CSSStyleRule | undefined;
      expect(hiddenRule?.style.display).toBe('none');
    }
    const { container, rerender } = render(
      <>
        <Sidebar hidden data-part="sidebar" />
        <SidebarHeader hidden data-part="header" />
        <SidebarNav hidden data-part="nav" aria-label="Hidden navigation" />
        <SidebarGroup hidden data-part="group" label="Hidden group" />
        <SidebarItem hidden data-part="item" href="/hidden">
          Hidden item
        </SidebarItem>
        <SidebarFooter hidden data-part="footer" />
      </>,
    );
    for (const part of container.querySelectorAll('[data-part]')) {
      expect(part.hasAttribute('hidden')).toBe(true);
      expect(getComputedStyle(part).display).toBe('none');
    }
    rerender(
      <SidebarItem data-part="item" href="/visible">
        Visible item
      </SidebarItem>,
    );
    expect(getComputedStyle(screen.getByRole('link', { name: 'Visible item' })).display).toBe(
      'flex',
    );
  } finally {
    style.remove();
  }
});

it('renders a native action with button defaults, disabled state and button ref', () => {
  const ref = createRef<HTMLButtonElement>();
  let count = 0;
  const { rerender } = render(
    <SidebarItem as="button" ref={ref} onClick={() => count++}>
      Settings
    </SidebarItem>,
  );
  const button = screen.getByRole('button', { name: 'Settings' });
  expect(ref.current).toBe(button);
  expect(button.getAttribute('type')).toBe('button');
  expect(button.hasAttribute('aria-current')).toBe(false);
  fireEvent.click(button);
  expect(count).toBe(1);
  rerender(
    <SidebarItem as="button" disabled type="submit">
      Settings
    </SidebarItem>,
  );
  expect((button as HTMLButtonElement).disabled).toBe(true);
  expect(button.getAttribute('type')).toBe('submit');
});

it('provides app layouts, descriptions, brand slots and unclipped rail hints', async () => {
  const layout = signal<'expanded' | 'rail' | 'horizontal'>('rail');
  const scrollable = signal(true);
  const view = () => (
    <Sidebar layout={layout} scrollable={scrollable}>
      <SidebarBrand
        title="VPN"
        description="Private routes"
        classes={{ root: 'brand', title: 'brand-title' }}
      />
      <SidebarNav aria-label="App">
        <SidebarGroup label="Pages">
          <SidebarItem href="/" icon={<span>icon</span>} description="Current routes">
            Routes
          </SidebarItem>
        </SidebarGroup>
      </SidebarNav>
    </Sidebar>
  );
  const { container, rerender } = render(view());
  const root = screen.getByRole('complementary');
  expect(root.getAttribute('data-layout')).toBe('rail');
  expect(root.getAttribute('data-scrollable')).toBe('true');
  expect(screen.getByText('VPN').classList.contains('brand-title')).toBe(true);
  const link = screen.getByRole('link', { name: 'Routes' });
  expect(screen.getByText('Current routes').getAttribute('aria-hidden')).toBe('true');
  fireEvent.mouseEnter(link);
  const hint = document.body.querySelector('[data-sidebar-hint]');
  expect(hint?.textContent).toBe('Routes');
  expect(hint?.getAttribute('aria-hidden')).toBe('true');
  expect(container.contains(hint)).toBe(false);
  fireEvent.keyDown(link, { key: 'Escape' });
  expect(document.body.querySelector('[data-sidebar-hint]')).toBeNull();
  fireEvent.mouseLeave(link);
  act(() => (screen.getByRole('link', { name: 'Routes' }) as HTMLElement).focus());
  await waitFor(() => expect(document.body.querySelector('[data-sidebar-hint]')).not.toBeNull());
  fireEvent.mouseLeave(link);
  act(() => (screen.getByRole('link', { name: 'Routes' }) as HTMLElement).blur());
  expect(document.body.querySelector('[data-sidebar-hint]')).toBeNull();
  layout.value = 'horizontal';
  scrollable.value = false;
  rerender(view());
  expect(root.getAttribute('data-layout')).toBe('horizontal');
  expect(root.getAttribute('data-scrollable')).toBe('false');
  expect(screen.getByText('Current routes').hasAttribute('aria-hidden')).toBe(false);
});

it('composes a custom link root and children without nested interactive elements', () => {
  const ref = createRef<HTMLAnchorElement>();
  render(
    <SidebarItem
      render={<a href="/custom" data-custom="yes" />}
      ref={ref}
      label="Custom"
      description="Details"
      classes={{ description: 'details' }}
    >
      Content
    </SidebarItem>,
  );
  const link = screen.getByRole('link', { name: 'Custom' });
  expect(ref.current).toBe(link);
  expect(link.getAttribute('href')).toBe('/custom');
  expect(link.querySelector('a,button')).toBeNull();
  expect(screen.getByText('Details').classList.contains('details')).toBe(true);
});

it('updates a rail hint on scrolling and removes it and its listeners on unmount', async () => {
  const { unmount } = render(
    <Sidebar layout="rail">
      <SidebarItem href="/">Home</SidebarItem>
    </Sidebar>,
  );
  const link = screen.getByRole('link', { name: 'Home' });
  let top = 40;
  link.getBoundingClientRect = () => ({
    x: 0,
    y: top,
    top,
    bottom: top + 44,
    left: 0,
    right: 64,
    width: 64,
    height: 44,
    toJSON: () => ({}),
  });
  fireEvent.mouseEnter(link);
  await waitFor(() =>
    expect((document.body.querySelector('[data-sidebar-hint]') as HTMLElement).style.top).toBe(
      '62px',
    ),
  );
  top = 80;
  fireEvent.scroll(window);
  expect((document.body.querySelector('[data-sidebar-hint]') as HTMLElement).style.top).toBe(
    '102px',
  );
  unmount();
  expect(document.body.querySelector('[data-sidebar-hint]')).toBeNull();
  fireEvent.scroll(window);
  fireEvent.resize(window);
  expect(document.body.querySelector('[data-sidebar-hint]')).toBeNull();
});

it('keeps rail fallback labels and brand roots visible or natively hidden', () => {
  const ref = createRef<HTMLDivElement>();
  const { rerender } = render(
    <Sidebar layout="rail">
      <SidebarBrand ref={ref} title="VPN" hidden />
      <SidebarItem href="/">Home</SidebarItem>
    </Sidebar>,
  );
  expect(ref.current?.hidden).toBe(true);
  expect(sidebarCss).toMatch(/\.brand\[hidden\]/);
  expect(screen.getByRole('link', { name: 'Home' }).getAttribute('data-has-icon')).toBe('false');
  rerender(
    <SidebarBrand
      title="VPN"
      logo={<span>Logo</span>}
      description="Routes"
      class=""
      className="ignored"
      classes={{ logo: 'logo-slot', content: 'brand-content', description: 'brand-description' }}
    />,
  );
  expect(screen.getByText('Logo').parentElement?.getAttribute('aria-hidden')).toBe('true');
  expect(screen.getByText('Logo').parentElement?.classList.contains('logo-slot')).toBe(true);
  expect(screen.getByText('Routes').classList.contains('brand-description')).toBe(true);
  expect(screen.getByText('VPN').parentElement?.classList.contains('brand-content')).toBe(true);
  expect(screen.getByText('VPN').closest('[data-has-logo]')?.classList.contains('ignored')).toBe(
    false,
  );
});

it('keeps portal hints inside a narrow viewport', async () => {
  const previousWidth = window.innerWidth;
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 200 });
  try {
    render(
      <Sidebar layout="rail">
        <SidebarItem href="/">Home</SidebarItem>
      </Sidebar>,
    );
    const link = screen.getByRole('link', { name: 'Home' });
    link.getBoundingClientRect = () => ({
      x: 0,
      y: 40,
      top: 40,
      bottom: 84,
      left: 0,
      right: 64,
      width: 64,
      height: 44,
      toJSON: () => ({}),
    });
    fireEvent.mouseEnter(link);
    await waitFor(() =>
      expect((document.body.querySelector('[data-sidebar-hint]') as HTMLElement).style.left).toBe(
        '8px',
      ),
    );
  } finally {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: previousWidth });
  }
});

it.each(['mouseleave', 'blur'] as const)(
  'keeps an escaped rail hint dismissed after %s until hover and focus both end',
  (firstExit) => {
    render(
      <Sidebar layout="rail">
        <SidebarItem href="/">Home</SidebarItem>
      </Sidebar>,
    );
    const link = screen.getByRole('link', { name: 'Home' }) as HTMLElement;
    // jsdom does not consistently track the browser's keyboard focus modality.
    const matches = link.matches.bind(link);
    vi.spyOn(link, 'matches').mockImplementation(
      (selector) => selector === ':focus-visible' || matches(selector),
    );
    act(() => link.focus());
    fireEvent.mouseEnter(link);
    expect(document.body.querySelector('[data-sidebar-hint]')).not.toBeNull();
    fireEvent.keyDown(link, { key: 'Escape' });
    expect(document.body.querySelector('[data-sidebar-hint]')).toBeNull();
    if (firstExit === 'mouseleave') {
      fireEvent.mouseLeave(link);
      expect(document.body.querySelector('[data-sidebar-hint]')).toBeNull();
      fireEvent.mouseEnter(link);
      expect(document.body.querySelector('[data-sidebar-hint]')).toBeNull();
      fireEvent.mouseLeave(link);
      act(() => link.blur());
      expect(document.body.querySelector('[data-sidebar-hint]')).toBeNull();
      act(() => link.focus());
    } else {
      act(() => link.blur());
      expect(document.body.querySelector('[data-sidebar-hint]')).toBeNull();
      act(() => link.focus());
      expect(document.body.querySelector('[data-sidebar-hint]')).toBeNull();
      act(() => link.blur());
      fireEvent.mouseLeave(link);
      expect(document.body.querySelector('[data-sidebar-hint]')).toBeNull();
      fireEvent.mouseEnter(link);
    }
    expect(document.body.querySelector('[data-sidebar-hint]')).not.toBeNull();
  },
);

it.each(['workspace', 'body'] as const)(
  'dismisses hover-only hints on Escape from %s without swallowing the application event',
  (target) => {
    render(
      <>
        <button>Workspace</button>
        <Sidebar layout="rail">
          <SidebarItem href="/">Home</SidebarItem>
        </Sidebar>
      </>,
    );
    const focused =
      target === 'workspace' ? screen.getByRole('button', { name: 'Workspace' }) : document.body;
    act(() => focused.focus());
    expect(document.activeElement).toBe(focused);
    const link = screen.getByRole('link', { name: 'Home' });
    fireEvent.mouseEnter(link);
    expect(document.body.querySelector('[data-sidebar-hint]')).not.toBeNull();
    let received = 0;
    const applicationListener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        received++;
        expect(event.defaultPrevented).toBe(false);
      }
    };
    window.addEventListener('keydown', applicationListener);
    try {
      fireEvent.keyDown(focused, { key: 'Escape' });
      expect(document.body.querySelector('[data-sidebar-hint]')).toBeNull();
      expect(received).toBe(1);
      fireEvent.mouseEnter(link);
      expect(document.body.querySelector('[data-sidebar-hint]')).toBeNull();
      fireEvent.mouseLeave(link);
      fireEvent.mouseEnter(link);
      expect(document.body.querySelector('[data-sidebar-hint]')).not.toBeNull();
    } finally {
      window.removeEventListener('keydown', applicationListener);
    }
  },
);

it('subscribes to global Escape only while a hint is visible and cleans up on unmount', () => {
  const add = vi.spyOn(document, 'addEventListener');
  const remove = vi.spyOn(document, 'removeEventListener');
  try {
    const { unmount } = render(
      <Sidebar layout="rail">
        <SidebarItem href="/">Home</SidebarItem>
      </Sidebar>,
    );
    expect(add.mock.calls.filter(([type]) => type === 'keydown')).toHaveLength(0);
    fireEvent.mouseEnter(screen.getByRole('link', { name: 'Home' }));
    const subscription = add.mock.calls.find(([type]) => type === 'keydown');
    expect(subscription).toBeDefined();
    unmount();
    expect(
      remove.mock.calls.some(
        ([type, listener]) => type === 'keydown' && listener === subscription?.[1],
      ),
    ).toBe(true);
    expect(document.body.querySelector('[data-sidebar-hint]')).toBeNull();
  } finally {
    add.mockRestore();
    remove.mockRestore();
  }
});

it('allows native Signalish hidden false hints and updates false to true to false', () => {
  const hidden = reactiveSignal(false);
  render(
    <Sidebar layout="rail">
      <SidebarItem href="/" hidden={hidden}>
        Home
      </SidebarItem>
    </Sidebar>,
  );
  const link = screen.getByRole('link', { name: 'Home' });
  expect((link as HTMLAnchorElement).hidden).toBe(false);
  fireEvent.mouseEnter(link);
  expect(document.body.querySelector('[data-sidebar-hint]')).not.toBeNull();
  act(() => {
    hidden.value = true;
  });
  expect((link as HTMLAnchorElement).hidden).toBe(true);
  expect(document.body.querySelector('[data-sidebar-hint]')).toBeNull();
  act(() => {
    hidden.value = false;
  });
  expect((link as HTMLAnchorElement).hidden).toBe(false);
  expect(document.body.querySelector('[data-sidebar-hint]')).not.toBeNull();
});

it('respects application cancellation of Escape while a hovered hint is open', () => {
  render(
    <>
      <button onKeyDown={(event) => event.preventDefault()}>Workspace</button>
      <Sidebar layout="rail">
        <SidebarItem href="/">Home</SidebarItem>
      </Sidebar>
    </>,
  );
  const button = screen.getByRole('button', { name: 'Workspace' });
  act(() => button.focus());
  fireEvent.mouseEnter(screen.getByRole('link', { name: 'Home' }));
  fireEvent.keyDown(button, { key: 'Escape' });
  expect(document.body.querySelector('[data-sidebar-hint]')).not.toBeNull();
});

it('uses application styling without an appearance attribute and preserves native aside props', () => {
  const ref = createRef<HTMLElement>();
  render(<Sidebar ref={ref} aria-label="Workspace" title="Navigation" tabIndex={-1} />);
  const aside = screen.getByRole('complementary', { name: 'Workspace' });
  expect(ref.current).toBe(aside);
  expect(aside.getAttribute('title')).toBe('Navigation');
  expect(aside.getAttribute('tabindex')).toBe('-1');
  expect(aside.hasAttribute('data-appearance')).toBe(false);
});

it('fills vertical item rows including footer buttons and keeps horizontal items intrinsic', () => {
  const style = document.createElement('style');
  style.textContent = sidebarCss.replace(/\.([a-zA-Z]+)\b/g, (selector, name: string) =>
    sidebarClasses[name] ? `.${sidebarClasses[name]}` : selector,
  );
  document.head.append(style);
  try {
    const view = (layout: 'expanded' | 'rail' | 'horizontal') => (
      <Sidebar layout={layout}>
        <SidebarNav aria-label="Workspace">
          <SidebarItem href="/">Routes</SidebarItem>
        </SidebarNav>
        <SidebarFooter>
          <SidebarItem as="button">Settings</SidebarItem>
        </SidebarFooter>
      </Sidebar>
    );
    const { rerender } = render(view('expanded'));
    for (const layout of ['expanded', 'rail', 'horizontal'] as const) {
      rerender(view(layout));
      for (const item of [screen.getByRole('link'), screen.getByRole('button')]) {
        const css = getComputedStyle(item);
        expect(css.width).toBe(layout === 'horizontal' ? 'auto' : '100%');
        expect(css.boxSizing).toBe('border-box');
        expect(css.minHeight).toBe('44px');
      }
    }
  } finally {
    style.remove();
  }
});

// @ts-expect-error Sidebar has no appearance variant
<Sidebar appearance="app" />;

it.each(['expanded', 'rail', 'horizontal'] as const)(
  'groups title and description beside the icon in %s layout without changing slots',
  (layout) => {
    const ref = createRef<HTMLButtonElement>();
    const clicked = vi.fn();
    render(
      <Sidebar layout={layout}>
        <SidebarItem
          as="button"
          ref={ref}
          onClick={clicked}
          label="Settings"
          icon={<span>Settings icon</span>}
          description="Open VPN settings"
          classes={{ content: 'settings-title', description: 'settings-description' }}
          render={<button data-custom="yes" />}
        >
          Settings
        </SidebarItem>
        <SidebarItem href="/help" description="More information">
          Help
        </SidebarItem>
      </Sidebar>,
    );
    const root = screen.getByRole('button', { name: 'Settings' });
    const title = screen.getByText('Settings');
    const description = screen.getByText('Open VPN settings');
    const column = title.parentElement!;
    expect(description.parentElement).toBe(column);
    expect(column.parentElement).toBe(root);
    expect(screen.getByText('Settings icon').parentElement?.parentElement).toBe(root);
    expect(column.contains(screen.getByText('Settings icon'))).toBe(false);
    expect(title.classList.contains('settings-title')).toBe(true);
    expect(description.classList.contains('settings-description')).toBe(true);
    expect(description.getAttribute('aria-hidden')).toBe(layout === 'rail' ? 'true' : null);
    expect(screen.getByText('Help').parentElement).toBe(
      screen.getByText('More information').parentElement,
    );
    expect(ref.current).toBe(root);
    expect(root.getAttribute('data-custom')).toBe('yes');
    fireEvent.click(root);
    expect(clicked).toHaveBeenCalledTimes(1);
  },
);

it('stacks item text beside centered icons and hides the whole column only for rail icons', () => {
  const style = document.createElement('style');
  style.textContent = sidebarCss.replace(/\.([a-zA-Z]+)\b/g, (selector, name: string) =>
    sidebarClasses[name] ? `.${sidebarClasses[name]}` : selector,
  );
  document.head.append(style);
  try {
    const view = (layout: 'expanded' | 'rail' | 'horizontal') => (
      <Sidebar layout={layout}>
        <SidebarItem href="/" icon="Icon" description="Description">
          Title
        </SidebarItem>
        <SidebarItem href="/text" description="Text description">
          Text title
        </SidebarItem>
      </Sidebar>
    );
    const { rerender } = render(view('expanded'));
    for (const layout of ['expanded', 'rail', 'horizontal'] as const) {
      rerender(view(layout));
      const title = screen.getByText('Title');
      const column = title.parentElement!;
      const row = column.parentElement!;
      expect(getComputedStyle(row).alignItems).toBe('center');
      expect(getComputedStyle(row).flexWrap).not.toBe('wrap');
      expect(getComputedStyle(column).display).toBe('flex');
      expect(getComputedStyle(column).flexDirection).toBe('column');
      expect(getComputedStyle(column).position).toBe(layout === 'rail' ? 'absolute' : 'static');
      expect(getComputedStyle(screen.getByText('Description')).display).toBe(
        layout === 'rail' ? 'none' : 'inline',
      );
      expect(getComputedStyle(screen.getByText('Text title').parentElement!).position).toBe(
        'static',
      );
    }
  } finally {
    style.remove();
  }
});
