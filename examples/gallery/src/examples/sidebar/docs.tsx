import { SidebarBrandExample } from './sidebar-brand-example';
import { SidebarExample } from './sidebar-example';
import { SidebarHeaderExample } from './sidebar-header-example';
import { SidebarNavExample } from './sidebar-nav-example';
import { SidebarGroupExample } from './sidebar-group-example';
import { SidebarItemExample } from './sidebar-item-example';
import { SidebarFooterExample } from './sidebar-footer-example';

export const sidebarCode = `import { Sidebar, SidebarHeader, SidebarNav, SidebarGroup, SidebarItem, SidebarFooter } from '@violice/preact-fluent-ui/components';

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

export const sidebarExamples = {
  Sidebar: SidebarExample,
  SidebarBrand: SidebarBrandExample,
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
