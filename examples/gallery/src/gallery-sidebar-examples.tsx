import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { useSignal } from '@preact/signals';
import {
  Button,
  Checkbox,
  Icon,
  Sidebar,
  SidebarBrand,
  Select,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarNav,
  StatusBadge,
} from '../../../dist/index.js';
import type { SidebarLayout } from '../../../dist/index.js';
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
      <SidebarItem
        as="button"
        icon={<Icon name="settings" />}
        label="Local settings"
        onClick={() => {
          selected.value = 1;
        }}
      >
        Settings
      </SidebarItem>
    </>
  );
}

function SidebarExample() {
  const layout = useSignal<SidebarLayout>('expanded');
  return (
    <div class={styles.stack}>
      <label class={styles.label}>
        Sidebar layout
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
      <Sidebar layout={layout} scrollable class={styles.sidebarExample} style={{ height: '320px' }}>
        <SidebarHeader>
          <SidebarBrand
            title="Connection manager"
            description="Local workspace"
            logo={<Icon name="network" />}
          />
        </SidebarHeader>
        <SidebarNav aria-label="Sidebar example">
          <SidebarGroup label="Workspace">
            <LocalSidebarItems icon />
            {Array.from({ length: 12 }, (_, index) => (
              <SidebarItem
                key={index}
                href="#local-long-menu"
                icon={<Icon name="network" />}
                onClick={(e) => e.preventDefault()}
                onAuxClick={(e) => e.preventDefault()}
              >
                Saved connection {index + 1}
              </SidebarItem>
            ))}
          </SidebarGroup>
        </SidebarNav>
        <SidebarFooter>Local workspace</SidebarFooter>
      </Sidebar>
    </div>
  );
}
const sidebarCode = `import { Sidebar, SidebarHeader, SidebarNav, SidebarGroup, SidebarItem, SidebarFooter } from '@violice/preact-fluent-ui';

<Sidebar layout={layout} scrollable>
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
const DemoLink = forwardRef<HTMLAnchorElement, JSX.IntrinsicElements['a']>((props, ref) => (
  <a {...props} ref={ref} />
));
function SidebarItemExample() {
  return (
    <div class={styles.stack}>
      <LocalSidebarItems
        icon
        selectableActive
        second="A long descriptive navigation label that wraps in a narrow window"
      />
      <SidebarItem
        href="#local-custom-link"
        description="One forwarded anchor root"
        render={(props) => <DemoLink {...props} />}
        onClick={(e) => e.preventDefault()}
        onAuxClick={(e) => e.preventDefault()}
      >
        Custom Link
      </SidebarItem>
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
  SidebarBrand: () => (
    <SidebarBrand
      title="Connection manager"
      description="Local workspace"
      logo={<Icon name="network" />}
    />
  ),
  SidebarHeader: SidebarHeaderExample,
  SidebarNav: SidebarNavExample,
  SidebarGroup: SidebarGroupExample,
  SidebarItem: SidebarItemExample,
  SidebarFooter: SidebarFooterExample,
};
export const sidebarCodes = {
  Sidebar: sidebarCode,
  SidebarBrand:
    '<SidebarBrand title="Connection manager" description="Local workspace" logo={<Icon name="network" />} />',
  SidebarHeader:
    '<SidebarHeader><strong>Connection manager</strong><p>Local workspace</p></SidebarHeader>',
  SidebarNav:
    '<SidebarNav aria-label="Workspace">\n  <SidebarItem href="/connections">Connections</SidebarItem>\n</SidebarNav>',
  SidebarGroup:
    '<SidebarGroup label="Connection tools">\n  <SidebarItem href="/connections">Connections</SidebarItem>\n</SidebarGroup>',
  SidebarItem: `<SidebarItem href="/connections" active={activeSignal} description="Saved networks" icon={<Icon name="network" />}>Connections</SidebarItem>
<SidebarItem as="button" onClick={openSettings}>Settings</SidebarItem>
<SidebarItem href="/connections" render={props => <CustomLink {...props} />}>Connections</SidebarItem>
// CustomLink must forward every prop, composed children and ref to its anchor.`,
  SidebarFooter:
    '<Sidebar>\n  <SidebarHeader>Connection manager</SidebarHeader>\n  <SidebarFooter><StatusBadge tone="success">Connected</StatusBadge></SidebarFooter>\n</Sidebar>',
};
