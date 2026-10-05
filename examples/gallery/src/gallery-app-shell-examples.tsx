import { useContext } from 'preact/hooks';
import {
  AppShell,
  AppShellWorkspace,
  AppShellHeader,
  AppShellContent,
  AppShellFooter,
  Sidebar,
  SidebarBrand,
  SidebarHeader,
  SidebarNav,
  SidebarItem,
  SidebarFooter,
  Icon,
  Select,
} from '../../../dist/index.js';
import { useSignal } from '@preact/signals';
import type { SidebarLayout } from '../../../dist/index.js';
import { GalleryContext } from './gallery-context';
import { galleryHref } from './gallery-routing';
import styles from './gallery.module.css';

export function ShellDocument() {
  const layout = useSignal<SidebarLayout>(
    typeof window !== 'undefined' && window.innerWidth <= 640 ? 'rail' : 'expanded',
  );
  const selected = useSignal(0);
  return (
    <AppShell navigationLayout={layout} style={{ minHeight: '520px' }}>
      <Sidebar appearance="app" layout={layout} scrollable>
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
          <h1>Local workspace</h1>
          <label>
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
        <AppShellContent>
          <p>
            Selected connection {selected.value + 1}. Navigation and actions remain inside this
            preview.
          </p>
        </AppShellContent>
        <AppShellFooter>Local workspace status</AppShellFooter>
      </AppShellWorkspace>
    </AppShell>
  );
}
function ShellPreview() {
  const { settings, base } = useContext(GalleryContext);
  return (
    <iframe
      class={styles.shellPreview}
      title="Application shell preview"
      src={galleryHref('/shell-preview.html', settings, base)}
    />
  );
}
const shellCode = `<AppShell navigationLayout={layout}>\n  <Sidebar appearance="app" layout={layout} scrollable>\n    <SidebarHeader><SidebarBrand title="Connection manager" logo={<Icon name="network" />} /></SidebarHeader>\n    <SidebarNav aria-label="Workspace"><SidebarItem href="/connections">Connections</SidebarItem></SidebarNav>\n    <SidebarFooter><SidebarItem as="button" onClick={openSettings}>Settings</SidebarItem></SidebarFooter>\n  </Sidebar>\n  <AppShellWorkspace>\n    <AppShellHeader>Workspace heading and actions</AppShellHeader>\n    <AppShellContent>Page content</AppShellContent>\n    <AppShellFooter>Workspace status</AppShellFooter>\n  </AppShellWorkspace>\n</AppShell>`;
export const appShellDocs = [
  'AppShell',
  'AppShellWorkspace',
  'AppShellHeader',
  'AppShellContent',
  'AppShellFooter',
].map((title) => ({
  title,
  slug: title.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
  purpose: {
    AppShell: 'Arrange navigation and a workspace using a shared navigation layout.',
    AppShellWorkspace: 'Provide the single main landmark of an application.',
    AppShellHeader: 'Place workspace headings and actions above content.',
    AppShellContent: 'Center page content within the workspace.',
    AppShellFooter: 'Place status or secondary actions below content.',
  }[title]!,
  example: ShellPreview,
  code: shellCode,
  note: 'The preview is a separate document with its own main landmark. Appearance follows the gallery; all preview actions are local.',
  props:
    title === 'AppShell'
      ? [
          [
            'navigationLayout',
            'Signalish<SidebarLayout>',
            'expanded by default. Match Sidebar layout.',
          ] as [string, string, string],
        ]
      : [],
  accessibility:
    'AppShellWorkspace renders main. Use it once per document and provide a page heading. Other shell parts render div and add no focus or navigation behavior. Responsive layout remains application-owned.',
}));
