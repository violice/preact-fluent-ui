import { SidebarNav } from '../../../../../dist/components.js';
import { LocalSidebarItems } from './local-sidebar-items';

export function SidebarNavExample() {
  return (
    <SidebarNav aria-label="Workspace example">
      <LocalSidebarItems first="Workspace" />
    </SidebarNav>
  );
}
