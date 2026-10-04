import { batch, effect, signal } from '@preact/signals';
import resetUrl from '../../../dist/reset.css?url';
import nativeControlsUrl from '../../../dist/native-controls.css?url';
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
    let links: HTMLLinkElement[] = [];
    const disposeTheme = effect(() => {
      style.textContent = themeOverrides(settings.value, systemDark.value);
    });
    const disposePreset = effect(() => {
      const full = settings.value.preset === 'full';
      if (full && links.length === 0) {
        links = [resetUrl, nativeControlsUrl].map((href) => {
          const link = target.document.createElement('link');
          link.rel = 'stylesheet';
          link.href = href;
          link.dataset.galleryOptional = '';
          target.document.head.append(link);
          return link;
        });
      } else if (!full) {
        links.forEach((link) => link.remove());
        links = [];
      }
    });
    disconnect = () => {
      target.removeEventListener('popstate', navigate);
      media?.removeEventListener('change', change);
      disposeTheme();
      disposePreset();
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
