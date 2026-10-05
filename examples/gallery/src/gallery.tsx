import { useLayoutEffect, useRef, useState } from 'preact/hooks';
import { ErrorBoundary, LocationProvider, Route, Router, useLocation } from 'preact-iso';
import {
  AppShell,
  AppShellWorkspace,
  AppShellContent,
  Button,
  Icon,
  Modal,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Sidebar,
  SidebarHeader,
  SidebarBrand,
  SidebarNav,
  SidebarGroup,
  SidebarItem,
  SidebarFooter,
} from '../../../dist/index.js';
import { version } from '../../../package.json';
import { GalleryControls, useGallerySettings } from './gallery-controls';
import type { GalleryStore } from './gallery-store';
import { defaultSettings } from './gallery-settings';
import { GalleryContext } from './gallery-context';
import { galleryBase, galleryHref, normalizeGalleryPath } from './gallery-routing';
import { galleryPages, NotFound } from './gallery-pages';
import styles from './gallery.module.css';
export type GalleryProps = { base?: string; url?: string; store?: GalleryStore };
function Shell({ base, store }: { base: string; store?: GalleryStore }) {
  const { settings, update } = useGallerySettings(store);
  const location = useLocation();
  const path = normalizeGalleryPath(location.path, base);
  const navigationPath = path === '/getting-started' ? '/' : path;
  const page = galleryPages.find((page) => page.path === path);
  const [expanded, setExpanded] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const initialSettingsFocus = useRef<HTMLSelectElement>(null);
  const main = useRef<HTMLElement>(null);
  const navigationToggle = useRef<HTMLButtonElement>(null);
  const previous = useRef(path);
  useLayoutEffect(() => {
    document.title = `${page?.title ?? 'Page not found'} | Preact Fluent UI`;
    if (previous.current !== path) {
      setExpanded(false);
      setSettingsOpen(false);
      // Modal cleanup restores focus in a microtask. Transfer focus after that cleanup.
      queueMicrotask(() =>
        queueMicrotask(() => main.current?.querySelector<HTMLElement>('h1')?.focus()),
      );
      previous.current = path;
    }
  }, [path, page]);
  return (
    <GalleryContext.Provider value={{ settings, base }}>
      <a class={styles.skipLink} href="#main-content" onClick={() => main.current?.focus()}>
        Skip to content
      </a>
      <AppShell class={styles.shell}>
        <Button
          ref={navigationToggle}
          class={styles.navigationToggle}
          aria-expanded={expanded}
          aria-controls="gallery-navigation"
          onClick={() => setExpanded(!expanded)}
        >
          Navigation
        </Button>
        <Sidebar
          id="gallery-navigation"
          scrollable
          class={`${styles.navigation} ${expanded ? styles.navigationOpen : ''}`}
        >
          <SidebarHeader>
            <a
              class={styles.brandLink}
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
            {(['Overview', 'Guides', 'Components', 'Utils'] as const).map((group) => (
              <SidebarGroup key={group} label={group}>
                {galleryPages
                  .filter((page) => page.group === group && !page.navigationHidden)
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
                          setExpanded(false);
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
                setExpanded(false);
                setSettingsOpen(true);
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
        <AppShellWorkspace id="main-content" tabIndex={-1} ref={main} class={styles.workspace}>
          <AppShellContent class={styles.gallery}>
            {!page?.demoOwnsHeading && <h1 tabIndex={-1}>{page?.title ?? 'Page not found'}</h1>}
            <ErrorBoundary>
              <Router>
                {galleryPages.map((page) => (
                  <Route
                    key={page.path}
                    path={galleryBase(base) + page.path.replace(/^\//, '')}
                    component={page.component}
                  />
                ))}
                <Route default component={NotFound} />
              </Router>
            </ErrorBoundary>
          </AppShellContent>
        </AppShellWorkspace>
      </AppShell>
      {settingsOpen && (
        <Modal
          labelledBy="appearance-settings-title"
          initialFocusRef={initialSettingsFocus}
          fallbackFocusRef={navigationToggle}
          onClose={() => setSettingsOpen(false)}
        >
          <DialogHeader id="appearance-settings-title" title="Appearance settings" />
          <DialogBody>
            <GalleryControls
              settings={settings}
              onChange={update}
              initialFocusRef={initialSettingsFocus}
            />
          </DialogBody>
          <DialogFooter class={styles.settingsFooter}>
            <Button onClick={() => update({ ...defaultSettings })}>Reset appearance</Button>
            <Button onClick={() => setSettingsOpen(false)}>Close settings</Button>
          </DialogFooter>
        </Modal>
      )}
    </GalleryContext.Provider>
  );
}
export function Gallery({ base = import.meta.env.BASE_URL, url, store }: GalleryProps) {
  // preact-iso accepts url for prerender, though its public types no longer expose it.
  const locationProps = { scope: galleryBase(base), ...(url ? { url } : {}) };
  return (
    <LocationProvider {...locationProps}>
      <Shell base={base} store={store} />
    </LocationProvider>
  );
}
