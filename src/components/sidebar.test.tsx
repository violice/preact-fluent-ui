import { createRef } from 'preact';
import sidebarCss from './sidebar.module.css?raw';
import sidebarClasses from './sidebar.module.css';
import type { JSX } from 'preact';
import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { afterEach, expect, it } from 'vitest';
import {
  Sidebar,
  SidebarHeader,
  SidebarNav,
  SidebarGroup,
  SidebarItem,
  SidebarFooter,
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
