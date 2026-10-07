import { Icon, SidebarBrand } from '../../../../../dist/components.js';

export function SidebarBrandExample() {
  return (
    <SidebarBrand
      title="Connection manager"
      description="Local workspace"
      logo={<Icon name="network" />}
    />
  );
}
