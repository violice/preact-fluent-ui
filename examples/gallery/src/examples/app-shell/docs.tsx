import { ShellPreview } from './shell-preview';

export const shellCode = `import { css } from './styled-system/css';

<AppShell navigationLayout={layout} class={css({ "--app-shell-content-max-width": "800px", "--app-shell-content-padding": "20px" })}>\n  <Sidebar layout={layout} scrollable>\n    <SidebarHeader><SidebarBrand title="Connection manager" logo={<Icon name="network" />} /></SidebarHeader>\n    <SidebarNav aria-label="Workspace"><SidebarItem href="/connections">Connections</SidebarItem></SidebarNav>\n    <SidebarFooter><SidebarItem as="button" onClick={openSettings}>Settings</SidebarItem></SidebarFooter>\n  </Sidebar>\n  <AppShellWorkspace>\n    <AppShellHeader>Workspace heading and actions</AppShellHeader>\n    <AppShellToolbar>\n      <ToolbarGroup>Context picker and status</ToolbarGroup>\n      <ToolbarGroup align="end"><Button onClick={refresh}>Refresh workspace</Button></ToolbarGroup>\n    </AppShellToolbar>\n    <AppShellContent>Page content</AppShellContent>\n    <AppShellFooter>Workspace status</AppShellFooter>\n  </AppShellWorkspace>\n</AppShell>`;

export const appShellDocs = [
  'AppShell',
  'AppShellWorkspace',
  'AppShellHeader',
  'AppShellToolbar',
  'AppShellContent',
  'AppShellFooter',
].map((title) => ({
  title,
  slug: title.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
  purpose: {
    AppShell: 'Arrange navigation and a workspace using a shared navigation layout.',
    AppShellWorkspace: 'Provide the single main landmark of an application.',
    AppShellHeader: 'Place workspace headings and actions above content.',
    AppShellToolbar:
      'Place caller-owned controls in workspace chrome. Shares content maximum width and padding with AppShellContent; direct child of AppShellWorkspace. Desktop minimum height 76px, block padding 18px; up to 640px block padding 12px and inline padding remains aligned at 24px. Explicit content padding wins.',
    AppShellContent: 'Center page content within the workspace.',
    AppShellFooter:
      'Place status or secondary actions below content, sharing its maximum width and padding.',
  }[title]!,
  example: ShellPreview,
  code: shellCode,
  note: 'The preview is a separate document with its own main landmark. Appearance follows the gallery; all preview actions are local.',
  props:
    title === 'AppShell'
      ? [
          [
            'navigationLayout',
            'Signalish<SidebarLayout>',
            'expanded by default. Match Sidebar layout.',
          ] as [string, string, string],
        ]
      : [],
  accessibility:
    'AppShellWorkspace renders main. Use it once per document and provide a page heading. Other shell parts render div and add no focus or navigation behavior. Responsive layout remains application-owned.',
}));
