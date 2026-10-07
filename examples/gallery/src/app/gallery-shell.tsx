import { useLayoutEffect, useRef } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import {
  AppShell,
  AppShellWorkspace,
  AppShellContent,
  Button,
  Text,
} from '../../../../dist/components.js';
import { useGallerySettings } from '../state/use-gallery-settings';
import { useSignal } from '@preact/signals';
import { GalleryNavigation } from '../components/navigation/gallery-navigation';
import { AppearanceDialog } from '../components/appearance/appearance-dialog';
import { GalleryRouter } from '../routes/gallery-router';
import type { GalleryStore } from '../state/gallery-store';
import { GalleryContext } from '../state/gallery-context';
import { normalizeGalleryPath } from '../routes/routing';
import { galleryPages } from '../routes/pages';
import { galleryStyles } from '../styles/gallery.styles.ts';
export function GalleryShell({ base, store }: { base: string; store?: GalleryStore }) {
  const { settings, update } = useGallerySettings(store);
  const location = useLocation();
  const path = normalizeGalleryPath(location.path, base);
  const navigationPath = path;
  const page = galleryPages.find((page) => page.path === path);
  const expanded = useSignal(false);
  const settingsOpen = useSignal(false);
  const initialSettingsFocus = useRef<HTMLSelectElement>(null);
  const main = useRef<HTMLElement>(null);
  const navigationToggle = useRef<HTMLButtonElement>(null);
  const previous = useRef(path);
  useLayoutEffect(() => {
    document.title = `${page?.title ?? 'Page not found'} | Preact Fluent UI`;
    if (previous.current !== path) {
      expanded.value = false;
      settingsOpen.value = false;
      // Modal cleanup restores focus in a microtask. Transfer focus after that cleanup.
      queueMicrotask(() =>
        queueMicrotask(() => main.current?.querySelector<HTMLElement>('h1')?.focus()),
      );
      previous.current = path;
    }
  }, [path, page, expanded, settingsOpen]);
  return (
    <GalleryContext.Provider value={{ settings, base }}>
      <a class={galleryStyles.skipLink} href="#main-content" onClick={() => main.current?.focus()}>
        Skip to content
      </a>
      <AppShell class={galleryStyles.shell}>
        <Button
          ref={navigationToggle}
          class={galleryStyles.navigationToggle}
          aria-expanded={expanded.value}
          aria-controls="gallery-navigation"
          onClick={() => {
            expanded.value = !expanded.value;
          }}
        >
          Navigation
        </Button>
        <GalleryNavigation
          base={base}
          settings={settings}
          navigationPath={navigationPath}
          expanded={expanded.value}
          onExpandedChange={(value) => {
            expanded.value = value;
          }}
          onSettingsOpen={() => {
            settingsOpen.value = true;
          }}
          main={main}
          navigationToggle={navigationToggle}
        />
        <AppShellWorkspace
          id="main-content"
          tabIndex={-1}
          ref={main}
          class={galleryStyles.workspace}
        >
          <AppShellContent class={galleryStyles.gallery}>
            {!page?.demoOwnsHeading && (
              <Text preset="title1" render={<h1 />} tabIndex={-1}>
                {page?.title ?? 'Page not found'}
              </Text>
            )}
            <GalleryRouter base={base} />
          </AppShellContent>
        </AppShellWorkspace>
      </AppShell>
      {settingsOpen.value && (
        <AppearanceDialog
          settings={settings}
          update={update}
          onClose={() => {
            settingsOpen.value = false;
          }}
          initialSettingsFocus={initialSettingsFocus}
          navigationToggle={navigationToggle}
        />
      )}
    </GalleryContext.Provider>
  );
}
