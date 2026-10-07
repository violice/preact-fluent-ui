import { css, cx } from '../../../../../.artifacts/gallery-styled-system/css';
import { useSignal } from '@preact/signals';
import {
  Icon,
  Sidebar,
  SidebarBrand,
  Select,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarNav,
} from '../../../../../dist/components.js';
import type { SidebarLayout } from '../../../../../dist/components.js';
import { galleryStyles } from '../../styles/gallery.styles.ts';
import { LocalSidebarItems } from './local-sidebar-items';

export function SidebarExample() {
  const layout = useSignal<SidebarLayout>('expanded');
  return (
    <div class={galleryStyles.stack}>
      <label class={galleryStyles.label}>
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
      <Sidebar
        layout={layout}
        scrollable
        class={cx(galleryStyles.sidebarExample, css({ height: '320px' }))}
      >
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
