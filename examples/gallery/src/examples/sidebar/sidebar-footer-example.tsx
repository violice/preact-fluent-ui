import {
  Button,
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  StatusBadge,
} from '../../../../../dist/components.js';
import { galleryStyles } from '../../styles/gallery.styles.ts';

export function SidebarFooterExample() {
  return (
    <Sidebar class={galleryStyles.sidebarExample}>
      <SidebarHeader>Connection manager</SidebarHeader>
      <p>Workspace content</p>
      <SidebarFooter>
        <StatusBadge tone="success">Connected</StatusBadge>
        <Button size="compact">Workspace settings</Button>
      </SidebarFooter>
    </Sidebar>
  );
}
