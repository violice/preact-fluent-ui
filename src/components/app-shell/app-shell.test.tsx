import { createRef } from 'preact';
import { signal } from '@preact/signals';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { afterEach, expect, it } from 'vitest';
import {
  AppShell,
  AppShellWorkspace,
  AppShellHeader,
  AppShellContent,
  AppShellFooter,
} from './index';
import { Sidebar } from '../sidebar/index';
import type { SidebarLayout } from '../sidebar/index';
import { readFileSync } from 'node:fs';
const source = readFileSync('src/components/app-shell/app-shell.styles.ts', 'utf8');
import { recipeCss } from '../../../tests/component-styles';
const css = recipeCss(source);
import classes from './app-shell.styles';

afterEach(cleanup);

it('renders one main and direct native parts with attributes and refs', () => {
  const shell = createRef<HTMLDivElement>();
  const workspace = createRef<HTMLElement>();
  const header = createRef<HTMLDivElement>();
  const content = createRef<HTMLDivElement>();
  const footer = createRef<HTMLDivElement>();
  let clicks = 0;
  const { container, unmount } = render(
    <AppShell ref={shell} id="shell" dir="rtl">
      <Sidebar aria-label="App" />
      <AppShellWorkspace ref={workspace} tabIndex={-1} aria-label="Workspace">
        <AppShellHeader ref={header} title="Header" />
        <AppShellContent ref={content} onClick={() => clicks++}>
          Content
        </AppShellContent>
        <AppShellFooter ref={footer} data-test="footer" />
      </AppShellWorkspace>
    </AppShell>,
  );
  expect(shell.current?.tagName).toBe('DIV');
  expect(shell.current?.parentElement).toBe(container);
  expect(shell.current?.getAttribute('dir')).toBe('rtl');
  expect(container.querySelectorAll('main')).toHaveLength(1);
  expect(workspace.current).toBe(screen.getByRole('main', { name: 'Workspace' }));
  expect(workspace.current?.tabIndex).toBe(-1);
  expect(workspace.current?.parentElement).toBe(shell.current);
  for (const ref of [header, content, footer]) {
    expect(ref.current?.tagName).toBe('DIV');
    expect(ref.current?.parentElement).toBe(workspace.current);
  }
  expect(header.current?.title).toBe('Header');
  expect(footer.current?.getAttribute('data-test')).toBe('footer');
  fireEvent.click(content.current!);
  expect(clicks).toBe(1);
  expect(container.querySelector('aside')?.getAttribute('data-sidebar')).toBe('');
  expect(workspace.current?.getAttribute('data-app-shell-workspace')).toBe('');
  unmount();
  for (const ref of [shell, workspace, header, content, footer]) expect(ref.current).toBeNull();
});

it('preserves class precedence and scoped native hidden behavior on every part', () => {
  const parts = [AppShell, AppShellWorkspace, AppShellHeader, AppShellContent, AppShellFooter];
  for (const Part of parts) {
    const { container, unmount } = render(<Part class="chosen" className="fallback" hidden />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.hidden).toBe(true);
    expect(root.classList.contains('chosen')).toBe(true);
    expect(root.classList.contains('fallback')).toBe(false);
    expect(root.classList.length).toBeGreaterThan(2);
    unmount();
    const fallback = render(<Part className="fallback" />);
    expect(fallback.container.firstElementChild?.classList.contains('fallback')).toBe(true);
    fallback.unmount();
  }
  for (const name of ['shell', 'workspace', 'header', 'content', 'footer'] as const) {
    expect(classes[name].split(' ').some((name) => css.includes(`.${name}[hidden]`))).toBe(true);
  }
  expect(css).toMatch(/display:\s*none\s*!important/);
  const style = document.createElement('style');
  style.textContent = css;
  document.head.append(style);
  try {
    for (const Part of parts) {
      const view = render(<Part hidden />);
      expect(getComputedStyle(view.container.firstElementChild!).display).toBe('none');
      view.unmount();
    }
  } finally {
    style.remove();
  }
});

it('updates all navigation layouts from a signal without adding landmarks', async () => {
  const layout = signal<SidebarLayout>('expanded');
  const { container } = render(
    <AppShell navigationLayout={layout}>
      <AppShellWorkspace />
    </AppShell>,
  );
  const root = container.firstElementChild!;
  expect(root.getAttribute('data-navigation-layout')).toBe('expanded');
  for (const value of ['rail', 'horizontal'] as const) {
    await act(() => {
      layout.value = value;
    });
    expect(root.getAttribute('data-navigation-layout')).toBe(value);
    expect(container.querySelectorAll('main')).toHaveLength(1);
  }
});

it('declares reset-independent geometry with direct component selectors and theme colors', () => {
  expect(css).toContain('--app-shell-navigation-width, 248px');
  expect(css).toContain('--app-shell-rail-width, 64px');
  expect(css).toContain('--app-shell-content-max-width, 1240px');
  expect(css).toContain('--app-shell-content-padding, 24px');
  expect(css).toMatch(/min-height:\s*100dvh/);
  expect(css).toMatch(/>\s*\[data-sidebar\]/);
  expect(css).toMatch(/>\s*\[data-app-shell-workspace\]/);
  expect(css).toContain('box-sizing:border-box');
  expect(css).toContain('margin-inline-start:auto');
  expect(css).toContain('var(--color-surface)');
  expect(css).not.toContain('@media');
});
