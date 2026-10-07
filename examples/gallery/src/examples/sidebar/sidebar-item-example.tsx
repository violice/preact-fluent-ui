import { SidebarItem } from '../../../../../dist/components.js';
import { galleryStyles } from '../../styles/gallery.styles.ts';
import { LocalSidebarItems } from './local-sidebar-items';
import { DemoLink } from './demo-link';

export function SidebarItemExample() {
  return (
    <div class={galleryStyles.stack}>
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
