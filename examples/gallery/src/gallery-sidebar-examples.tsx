import type { JSX } from 'preact';
import { useSignal } from '@preact/signals';
import {
  Button,
  Checkbox,
  Icon,
  Sidebar,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarNav,
  StatusBadge,
} from '../../../dist/index.js';
import styles from './gallery.module.css';

function LocalSidebarItems({
  first = 'Connections',
  second = 'Appearance',
  icon = false,
  selectableActive = false,
}: {
  first?: string;
  second?: string;
  icon?: boolean;
  selectableActive?: boolean;
}) {
  const selected = useSignal(0);
  const active = useSignal(true);
  const choose = (index: number) => (event: JSX.TargetedMouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    selected.value = index;
    if (index === 0) active.value = true;
  };
  return (
    <>
      {selectableActive && (
        <Checkbox
          label="Mark the example link active"
          checked={active}
          onChange={(event) => {
            active.value = event.currentTarget.checked;
          }}
        />
      )}
      <SidebarItem
        href="#demo-connections"
        active={selected.value === 0 && active.value}
        icon={icon ? <Icon name="network" /> : undefined}
        onClick={choose(0)}
        onAuxClick={choose(0)}
      >
        {first}
      </SidebarItem>
      <SidebarItem
        href="#demo-settings"
        active={selected.value === 1}
        onClick={choose(1)}
        onAuxClick={choose(1)}
      >
        {second}
      </SidebarItem>
    </>
  );
}

function SidebarExample() {
  return (
    <Sidebar class={styles.sidebarExample}>
      <SidebarHeader>
        <strong>Connection manager</strong>
      </SidebarHeader>
      <SidebarNav aria-label="Sidebar example">
        <SidebarGroup label="Workspace">
          <LocalSidebarItems icon />
        </SidebarGroup>
      </SidebarNav>
      <SidebarFooter>Local workspace</SidebarFooter>
    </Sidebar>
  );
}
const sidebarCode = `import { Sidebar, SidebarHeader, SidebarNav, SidebarGroup, SidebarItem, SidebarFooter } from '@violice/preact-fluent-ui';

<Sidebar>
  <SidebarHeader>Connection manager</SidebarHeader>
  <SidebarNav aria-label="Workspace">
    <SidebarGroup label="Connections">
      <SidebarItem href="/connections" active>Connections</SidebarItem>
      <SidebarItem href="/settings">Settings</SidebarItem>
    </SidebarGroup>
  </SidebarNav>
  <SidebarFooter>Local workspace</SidebarFooter>
</Sidebar>`;

function SidebarHeaderExample() {
  return (
    <SidebarHeader>
      <strong>Connection manager</strong>
      <p>Local workspace</p>
    </SidebarHeader>
  );
}
function SidebarNavExample() {
  return (
    <SidebarNav aria-label="Workspace example">
      <LocalSidebarItems first="Workspace" />
    </SidebarNav>
  );
}
function SidebarGroupExample() {
  return (
    <SidebarGroup label="Connection tools">
      <LocalSidebarItems second="Icons" />
    </SidebarGroup>
  );
}
function SidebarItemExample() {
  return (
    <div class={styles.stack}>
      <LocalSidebarItems
        icon
        selectableActive
        second="A long descriptive navigation label that wraps in a narrow window"
      />
    </div>
  );
}
function SidebarFooterExample() {
  return (
    <Sidebar class={styles.sidebarExample}>
      <SidebarHeader>Connection manager</SidebarHeader>
      <p>Workspace content</p>
      <SidebarFooter>
        <StatusBadge tone="success">Connected</StatusBadge>
        <Button size="compact">Workspace settings</Button>
      </SidebarFooter>
    </Sidebar>
  );
}
export const sidebarExamples = {
  Sidebar: SidebarExample,
  SidebarHeader: SidebarHeaderExample,
  SidebarNav: SidebarNavExample,
  SidebarGroup: SidebarGroupExample,
  SidebarItem: SidebarItemExample,
  SidebarFooter: SidebarFooterExample,
};
export const sidebarCodes = {
  Sidebar: sidebarCode,
  SidebarHeader:
    '<SidebarHeader><strong>Connection manager</strong><p>Local workspace</p></SidebarHeader>',
  SidebarNav:
    '<SidebarNav aria-label="Workspace">\n  <SidebarItem href="/connections">Connections</SidebarItem>\n</SidebarNav>',
  SidebarGroup:
    '<SidebarGroup label="Connection tools">\n  <SidebarItem href="/connections">Connections</SidebarItem>\n</SidebarGroup>',
  SidebarItem:
    '<SidebarItem href="/connections" active={activeSignal} icon={<Icon name="network" />}>Connections</SidebarItem>',
  SidebarFooter:
    '<Sidebar>\n  <SidebarHeader>Connection manager</SidebarHeader>\n  <SidebarFooter><StatusBadge tone="success">Connected</StatusBadge></SidebarFooter>\n</Sidebar>',
};
