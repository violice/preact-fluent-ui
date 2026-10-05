import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { h } from 'preact';
import { render, cleanup } from '@testing-library/preact';
import { useGallerySettings } from './gallery-controls';
import { createGalleryStore } from './gallery-store';
import { defaultSettings } from './gallery-settings';

const cleanups: (() => void)[] = [];
let media: EventTarget & { matches: boolean };
beforeEach(() => {
  history.replaceState(null, '', '/gallery/');
  media = Object.assign(new EventTarget(), { matches: false });
  vi.stubGlobal('matchMedia', () => media);
});
afterEach(() => {
  cleanup();
  cleanups.splice(0).forEach((cleanup) => cleanup());
  vi.unstubAllGlobals();
});
const connect = () => {
  const store = createGalleryStore();
  cleanups.push(store.connectBrowser());
  return store;
};
const optional = () => document.querySelectorAll('link[data-gallery-optional]');
const theme = () => document.querySelectorAll('style[data-gallery-theme]');

describe('gallery store', () => {
  it('creates isolated deterministic settings without browser globals', () => {
    vi.stubGlobal('window', undefined);
    const first = createGalleryStore();
    const second = createGalleryStore();
    first.update({ ...defaultSettings, theme: 'dark' });
    expect(second.settings.value).toEqual(defaultSettings);
    expect(second.systemDark.value).toBe(false);
    expect(first.settings.value.theme).toBe('dark');
  });
  it('reads query and system appearance only on browser connection', () => {
    history.replaceState(null, '', '/gallery/?preset=minimal&theme=dark');
    media.matches = true;
    const store = createGalleryStore();
    expect(store.settings.value.theme).toBe('system');
    cleanups.push(store.connectBrowser());
    expect(store.settings.value.preset).toBe('minimal');
    expect(store.settings.value.theme).toBe('dark');
    expect(store.systemDark.value).toBe(true);
    expect(optional()).toHaveLength(0);
    expect(theme()).toHaveLength(1);
    expect(theme()[0].textContent).toContain('color-scheme: dark');
  });
  it('falls back for invalid query values', () => {
    history.replaceState(
      null,
      '',
      '/gallery/?preset=no&theme=no&palette=no&accent=red&primary=bad',
    );
    expect(connect().settings.value).toEqual(defaultSettings);
  });
  it('updates URL without losing route, hash, unrelated params or history state', () => {
    history.replaceState({ route: 'keep' }, '', '/gallery/components/button?other=keep#example');
    const store = connect();
    store.update({ ...defaultSettings, preset: 'minimal', theme: 'dark' });
    expect(location.pathname).toBe('/gallery/components/button');
    expect(location.hash).toBe('#example');
    expect(new URL(location.href).searchParams.get('other')).toBe('keep');
    expect(new URL(location.href).searchParams.get('theme')).toBe('dark');
    expect(history.state).toEqual({ route: 'keep' });
  });
  it('synchronizes repeated history transitions without duplicating CSS nodes', () => {
    const store = connect();
    const style = theme()[0];
    expect(optional()).toHaveLength(2);
    for (let count = 0; count < 3; count++) {
      history.replaceState(null, '', '/gallery/?preset=minimal&theme=dark');
      window.dispatchEvent(new PopStateEvent('popstate'));
      expect(store.settings.value.preset).toBe('minimal');
      expect(optional()).toHaveLength(0);
      history.replaceState(null, '', '/gallery/?theme=light');
      window.dispatchEvent(new PopStateEvent('popstate'));
      expect(store.settings.value.theme).toBe('light');
      expect(optional()).toHaveLength(2);
      expect(theme()).toHaveLength(1);
      expect(theme()[0]).toBe(style);
    }
    store.update({ ...defaultSettings, preset: 'minimal' });
    expect(optional()).toHaveLength(0);
    store.update({ ...defaultSettings });
    expect(optional()).toHaveLength(2);
  });
  it('reacts to system changes then releases styles and listeners on disconnect', () => {
    const store = createGalleryStore();
    const disconnect = store.connectBrowser();
    media.matches = true;
    media.dispatchEvent(new Event('change'));
    expect(store.systemDark.value).toBe(true);
    expect(theme()[0].textContent).toContain('color-scheme: dark');
    disconnect();
    expect(theme()).toHaveLength(0);
    expect(optional()).toHaveLength(0);
    media.matches = false;
    media.dispatchEvent(new Event('change'));
    history.replaceState(null, '', '/gallery/?preset=minimal');
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(store.settings.value.preset).toBe('full');
    expect(store.systemDark.value).toBe(true);
  });
});

it('mounts one browser owner in the shell and removes CSS on unmount', () => {
  function Shell() {
    const { settings, update } = useGallerySettings();
    return h(
      'button',
      {
        onClick: () =>
          update({ ...settings, preset: settings.preset === 'full' ? 'minimal' : 'full' }),
      },
      settings.preset,
    );
  }
  const view = render(h(Shell, {}));
  expect(theme()).toHaveLength(1);
  expect(optional()).toHaveLength(2);
  view.unmount();
  expect(theme()).toHaveLength(0);
  expect(optional()).toHaveLength(0);
});

it('follows real Back and Forward entries and preserves route changes', async () => {
  history.replaceState(null, '', '/gallery/components/button?theme=dark');
  const store = connect();
  history.pushState(null, '', '/gallery/guides/theming?preset=minimal&theme=light');
  window.dispatchEvent(new PopStateEvent('popstate'));
  const moved = () =>
    new Promise<void>((resolve) =>
      window.addEventListener('popstate', () => resolve(), { once: true }),
    );
  const back = moved();
  history.back();
  await back;
  expect(location.pathname).toBe('/gallery/components/button');
  expect(store.settings.value.theme).toBe('dark');
  expect(optional()).toHaveLength(2);
  const forward = moved();
  history.forward();
  await forward;
  expect(location.pathname).toBe('/gallery/guides/theming');
  expect(store.settings.value.theme).toBe('light');
  expect(optional()).toHaveLength(0);
});

it('applies direction to the whole document, follows history and resets, then restores its owner', () => {
  document.documentElement.setAttribute('dir', 'auto');
  history.replaceState(null, '', '/gallery/?direction=rtl');
  const store = createGalleryStore();
  const disconnect = store.connectBrowser();
  try {
    expect(document.documentElement.dir).toBe('rtl');
    store.update({ ...defaultSettings });
    expect(document.documentElement.dir).toBe('ltr');
    expect(new URL(location.href).searchParams.has('direction')).toBe(false);
    history.replaceState(null, '', '/gallery/?direction=rtl');
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(document.documentElement.dir).toBe('rtl');
  } finally {
    disconnect();
  }
  expect(document.documentElement.dir).toBe('auto');
  document.documentElement.removeAttribute('dir');
});
