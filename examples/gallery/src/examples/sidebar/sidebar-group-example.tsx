import { SidebarGroup } from '../../../../../dist/components.js';
import { LocalSidebarItems } from './local-sidebar-items';

export function SidebarGroupExample() {
  return (
    <SidebarGroup label="Connection tools">
      <LocalSidebarItems second="Icons" />
    </SidebarGroup>
  );
}
