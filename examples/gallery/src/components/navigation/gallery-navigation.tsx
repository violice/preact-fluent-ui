import type { RefObject } from 'preact';
import {
  Sidebar,
  SidebarHeader,
  SidebarBrand,
  SidebarNav,
  SidebarGroup,
  SidebarItem,
  SidebarFooter,
  Icon,
} from '../../../../../dist/components.js';
import { version } from '../../../../../package.json';
import type { GallerySettings } from '../../state/gallery-settings';
import { galleryBase, galleryHref } from '../../routes/routing';
import { galleryPages } from '../../routes/pages';
import { galleryStyles } from '../../styles/gallery.styles.ts';

export function GalleryNavigation({
  base,
  settings,
  navigationPath,
  expanded,
  onExpandedChange,
  onSettingsOpen,
  main,
  navigationToggle,
}: {
  base: string;
  settings: GallerySettings;
  navigationPath: string;
  expanded: boolean;
  onExpandedChange: (value: boolean) => void;
  onSettingsOpen: () => void;
  main: RefObject<HTMLElement>;
  navigationToggle: RefObject<HTMLButtonElement>;
}) {
  return (
    <Sidebar
      id="gallery-navigation"
      scrollable
      data-gallery-navigation-open={expanded || undefined}
      class={`${galleryStyles.navigation} ${expanded ? galleryStyles.navigationOpen : ''}`}
    >
      <SidebarHeader>
        <a
          class={galleryStyles.brandLink}
          aria-label="Preact Fluent UI"
          href={galleryHref('/', settings, base)}
        >
          <SidebarBrand
            title="Preact Fluent UI"
            description={`Documentation · ${version}`}
            logo={<img src={`${galleryBase(base)}favicon.png`} alt="" width={32} height={32} />}
          />
        </a>
      </SidebarHeader>
      <SidebarNav aria-label="Documentation">
        {(['Overview', 'Styling', 'Components', 'Styles', 'Utils'] as const).map((group) => (
          <SidebarGroup key={group} label={group}>
            {galleryPages
              .filter((page) => page.group === group)
              .sort((first, second) =>
                group === 'Components' || group === 'Utils'
                  ? first.title.localeCompare(second.title, 'en')
                  : 0,
              )
              .map((page) => (
                <SidebarItem
                  key={page.path}
                  href={galleryHref(page.path, settings, base)}
                  active={page.path === navigationPath}
                  onClick={(event) => {
                    if (
                      event.button === 0 &&
                      !event.ctrlKey &&
                      !event.metaKey &&
                      !event.shiftKey &&
                      !event.altKey
                    ) {
                      const closesCurrentMobilePage =
                        expanded &&
                        page.path === navigationPath &&
                        navigationToggle.current &&
                        getComputedStyle(navigationToggle.current).display !== 'none';
                      onExpandedChange(false);
                      if (closesCurrentMobilePage) {
                        queueMicrotask(() => {
                          const heading = main.current?.querySelector<HTMLElement>('h1');
                          (heading ?? main.current)?.focus();
                        });
                      }
                    }
                  }}
                >
                  {page.title}
                </SidebarItem>
              ))}
          </SidebarGroup>
        ))}
      </SidebarNav>
      <SidebarFooter>
        <SidebarItem
          as="button"
          icon={<Icon name="settings" size={20} />}
          onClick={() => {
            onExpandedChange(false);
            onSettingsOpen();
          }}
        >
          Appearance settings
        </SidebarItem>
        <SidebarItem
          href="https://github.com/violice/preact-fluent-ui"
          target="_blank"
          rel="noreferrer"
          icon={<Icon name="open" size={20} />}
        >
          Source on GitHub
        </SidebarItem>
      </SidebarFooter>
    </Sidebar>
  );
}
