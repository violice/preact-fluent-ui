import { batch, effect, signal } from '@preact/signals';
import resetUrl from '../../../../.artifacts/gallery-defaults/reset.css?url';
import nativeControlsUrl from '../../../../.artifacts/gallery-defaults/native-controls.css?url';
import { defaultSettings, readSettings, settingsUrl, themeOverrides } from './gallery-settings';
import type { GallerySettings } from './gallery-settings';

export function createGalleryStore(initial: GallerySettings = defaultSettings) {
  const settings = signal({ ...initial });
  const systemDark = signal(false);
  let browser: Window | undefined;
  let disconnect: (() => void) | undefined;

  function update(next: GallerySettings) {
    if (browser) {
      browser.history.replaceState(
        browser.history.state,
        '',
        settingsUrl(new URL(browser.location.href), next),
      );
    }
    settings.value = { ...next };
  }

  function connectBrowser(): () => void {
    if (typeof window === 'undefined') return () => {};
    if (disconnect) return disconnect;
    browser = window;
    const target = browser;
    const media = target.matchMedia?.('(prefers-color-scheme: dark)');
    const navigate = () => {
      settings.value = readSettings(new URL(target.location.href));
    };
    const change = () => {
      systemDark.value = media?.matches ?? false;
    };
    batch(() => {
      navigate();
      change();
    });
    target.addEventListener('popstate', navigate);
    media?.addEventListener('change', change);
    const style = target.document.createElement('style');
    style.dataset.galleryTheme = '';
    target.document.head.append(style);
    const root = target.document.documentElement;
    const previousDirection = root.getAttribute('dir');
    const disposeDirection = effect(() => {
      root.dir = settings.value.direction;
    });
    const links = new Map<string, HTMLLinkElement>();
    const disposeTheme = effect(() => {
      style.textContent = themeOverrides(settings.value, systemDark.value);
    });
    const disposeStyles = effect(() => {
      for (const [key, href] of [
        ['reset', resetUrl],
        ['native', nativeControlsUrl],
      ] as const) {
        if (settings.value[key] && !links.has(key)) {
          const link = target.document.createElement('link');
          link.rel = 'stylesheet';
          link.href = href;
          link.dataset.galleryOptional = key;
          target.document.head.append(link);
          links.set(key, link);
        } else if (!settings.value[key]) {
          links.get(key)?.remove();
          links.delete(key);
        }
      }
    });
    disconnect = () => {
      target.removeEventListener('popstate', navigate);
      media?.removeEventListener('change', change);
      disposeDirection();
      if (previousDirection === null) root.removeAttribute('dir');
      else root.setAttribute('dir', previousDirection);
      disposeTheme();
      disposeStyles();
      style.remove();
      links.forEach((link) => link.remove());
      browser = undefined;
      disconnect = undefined;
    };
    return disconnect;
  }

  return { settings, systemDark, update, connectBrowser };
}

export type GalleryStore = ReturnType<typeof createGalleryStore>;
