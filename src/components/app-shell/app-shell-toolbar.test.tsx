import { createRef } from 'preact';
import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { afterEach, expect, it } from 'vitest';
import * as library from '../../index';
import {
  AppShellToolbar,
  AppShell,
  AppShellWorkspace,
  AppShellHeader,
  AppShellContent,
  ToolbarGroup,
  Button,
} from '../../index';

afterEach(cleanup);

it('forwards native root props and ref while composing groups inside the shared layout', () => {
  const root = createRef<HTMLDivElement>();
  const group = createRef<HTMLDivElement>();
  let clicks = 0;
  const view = render(
    <AppShellToolbar
      ref={root}
      id="app-actions"
      dir="rtl"
      data-context="office"
      class="chosen"
      className="ignored"
      onClick={() => clicks++}
    >
      <ToolbarGroup ref={group}>
        <Button>Refresh</Button>
      </ToolbarGroup>
    </AppShellToolbar>,
  );
  expect(root.current?.tagName).toBe('DIV');
  expect(root.current?.id).toBe('app-actions');
  expect(root.current?.dir).toBe('rtl');
  expect(root.current?.dataset.context).toBe('office');
  expect(root.current?.classList.contains('chosen')).toBe(true);
  expect(root.current?.classList.contains('ignored')).toBe(false);
  expect(root.current?.hasAttribute('role')).toBe(false);
  expect(group.current?.parentElement?.parentElement).toBe(root.current);
  fireEvent.click(screen.getByRole('button', { name: 'Refresh' }));
  expect(clicks).toBe(1);
  view.rerender(
    <AppShellToolbar ref={root} hidden className="fallback">
      Hidden
    </AppShellToolbar>,
  );
  expect(root.current?.hidden).toBe(true);
  expect(root.current?.classList.contains('fallback')).toBe(true);
  view.unmount();
  expect(root.current).toBe(null);
  expect(group.current).toBe(null);
});

it('removes the superseded exports from the package API', () => {
  expect('DataToolbar' in library).toBe(false);
  expect('DataToolbarGroup' in library).toBe(false);
  expect('AppToolbar' in library).toBe(false);
});

it('composes directly in the shell workspace with shared content variables and no extra landmark', () => {
  const toolbar = createRef<HTMLDivElement>();
  const content = createRef<HTMLDivElement>();
  const workspace = createRef<HTMLElement>();
  const view = render(
    <AppShell
      navigationLayout="horizontal"
      style={{ '--app-shell-content-max-width': '800px', '--app-shell-content-padding': '20px' }}
    >
      <AppShellWorkspace ref={workspace}>
        <AppShellHeader>Heading</AppShellHeader>
        <AppShellToolbar ref={toolbar} aria-label="Workspace actions">
          <ToolbarGroup>
            <Button>Refresh</Button>
          </ToolbarGroup>
        </AppShellToolbar>
        <AppShellContent ref={content}>Content</AppShellContent>
      </AppShellWorkspace>
    </AppShell>,
  );
  expect(toolbar.current?.parentElement).toBe(workspace.current);
  expect(content.current?.parentElement).toBe(workspace.current);
  expect(toolbar.current?.nextElementSibling).toBe(content.current);
  expect(toolbar.current?.getAttribute('aria-label')).toBe('Workspace actions');
  expect(
    workspace.current?.parentElement?.style.getPropertyValue('--app-shell-content-max-width'),
  ).toBe('800px');
  expect(
    workspace.current?.parentElement?.style.getPropertyValue('--app-shell-content-padding'),
  ).toBe('20px');
  expect(view.container.querySelectorAll('main')).toHaveLength(1);
  expect(view.container.querySelector('[role="toolbar"]')).toBeNull();
});
