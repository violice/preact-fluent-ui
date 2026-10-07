import { css } from '../../../../../.artifacts/gallery-styled-system/css';
import {
  AppShell,
  AppShellWorkspace,
  AppShellHeader,
  AppShellContent,
  AppShellFooter,
  AppShellToolbar,
  ToolbarGroup,
  Button,
  Text,
  Sidebar,
  SidebarBrand,
  SidebarHeader,
  SidebarNav,
  SidebarItem,
  SidebarFooter,
  Icon,
  Select,
} from '../../../../../dist/components.js';
import { useSignal } from '@preact/signals';
import type { SidebarLayout } from '../../../../../dist/components.js';
import { galleryStyles } from '../../styles/gallery.styles.ts';

export function ShellDocument() {
  const layout = useSignal<SidebarLayout>(
    typeof window !== 'undefined' && window.innerWidth <= 640 ? 'rail' : 'expanded',
  );
  const selected = useSignal(0);
  const context = useSignal('office');
  const refreshed = useSignal(false);
  return (
    <AppShell
      navigationLayout={layout}
      class={css({
        minHeight: '520px',
        '--app-shell-content-max-width': '800px',
        '--app-shell-content-padding': '20px',
      })}
    >
      <Sidebar layout={layout} scrollable>
        <SidebarHeader hidden={layout.value === 'horizontal'}>
          <SidebarBrand
            logo={<Icon name="network" />}
            title="Connection manager"
            description="Local preview"
          />
        </SidebarHeader>
        <SidebarNav aria-label="Preview navigation">
          {Array.from({ length: 18 }, (_, index) => (
            <SidebarItem
              key={index}
              href={`#connection-${index}`}
              icon={<Icon name="network" />}
              active={selected.value === index}
              label={`Connection ${index + 1}`}
              onClick={(e) => {
                e.preventDefault();
                selected.value = index;
              }}
              onAuxClick={(e) => e.preventDefault()}
            >
              Connection {index + 1}
            </SidebarItem>
          ))}
        </SidebarNav>
        <SidebarFooter>
          <SidebarItem
            as="button"
            label="Preview settings"
            icon={<Icon name="settings" />}
            onClick={() => {
              selected.value = 0;
            }}
          >
            Settings
          </SidebarItem>
        </SidebarFooter>
      </Sidebar>
      <AppShellWorkspace>
        <AppShellHeader>
          <Text preset="title3" render={<h1 />}>
            Local workspace
          </Text>
          <label class={galleryStyles.label}>
            Navigation layout
            <Select
              value={layout}
              onChange={(e) => {
                layout.value = e.currentTarget.value as SidebarLayout;
              }}
            >
              <option value="expanded">Expanded</option>
              <option value="rail">Rail</option>
              <option value="horizontal">Horizontal</option>
            </Select>
          </label>
        </AppShellHeader>
        <AppShellToolbar>
          <ToolbarGroup>
            <Select
              aria-label="Workspace context"
              value={context}
              onChange={(event) => {
                context.value = event.currentTarget.value;
                refreshed.value = false;
              }}
            >
              <option value="office">Office</option>
              <option value="lab">Lab</option>
            </Select>
            <span role="status">
              {context.value === 'lab' ? 'Lab' : 'Office'} workspace.{' '}
              {refreshed.value ? 'Refreshed' : 'Ready'}
            </span>
          </ToolbarGroup>
          <ToolbarGroup align="end">
            <Button
              onClick={() => {
                refreshed.value = true;
              }}
            >
              Refresh workspace
            </Button>
          </ToolbarGroup>
        </AppShellToolbar>
        <AppShellContent>
          <p>
            Toolbar and content share an 800px maximum width and 20px inline padding. Selected
            connection {selected.value + 1}. Navigation and actions remain inside this preview.
          </p>
        </AppShellContent>
        <AppShellFooter>Local workspace status</AppShellFooter>
      </AppShellWorkspace>
    </AppShell>
  );
}
