import type { RefObject } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Select } from '../../../dist/index.js';
import { createGalleryStore } from './gallery-store';
import type { GalleryStore } from './gallery-store';
import type { GallerySettings } from './gallery-settings';
import styles from './gallery.module.css';

// Mount this hook once in the persistent application shell.
export function useGallerySettings(providedStore?: GalleryStore) {
  const [store] = useState(() => providedStore ?? createGalleryStore());
  useEffect(() => store.connectBrowser(), [store]);
  return { settings: store.settings.value, update: store.update, store };
}

export function GalleryControls({
  settings,
  onChange,
  initialFocusRef,
}: {
  initialFocusRef?: RefObject<HTMLSelectElement>;
  settings: GallerySettings;
  onChange: (settings: GallerySettings) => void;
}) {
  const select = <K extends 'preset' | 'theme' | 'palette'>(
    key: K,
    label: string,
    options: [GallerySettings[K], string][],
  ) => (
    <label class={styles.label}>
      {label}
      <Select
        ref={key === 'preset' ? initialFocusRef : undefined}
        value={settings[key]}
        onChange={(event) => onChange({ ...settings, [key]: event.currentTarget.value })}
      >
        {options.map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </Select>
    </label>
  );
  return (
    <div class={styles.appearanceControls}>
      <div class={styles.settingsGrid}>
        {select('preset', 'CSS preset', [
          ['full', 'Full'],
          ['minimal', 'Minimal'],
        ])}
        {select('theme', 'Appearance', [
          ['system', 'System'],
          ['light', 'Light'],
          ['dark', 'Dark'],
        ])}
      </div>
      {select('palette', 'Palette', [
        ['standard', 'Standard'],
        ['green', 'Green'],
        ['custom', 'Custom'],
      ])}
      {settings.palette === 'custom' && (
        <div class={styles.settingsColors}>
          {(['accent', 'primary'] as const).map((key) => (
            <label class={styles.label} key={key}>
              {key === 'accent' ? 'Accent color' : 'Primary color'}
              <input
                type="color"
                value={settings[key]}
                onInput={(event) => onChange({ ...settings, [key]: event.currentTarget.value })}
              />
            </label>
          ))}
        </div>
      )}
      <p class={styles.settingsNote}>
        {settings.preset === 'full'
          ? 'Full includes theme and component styles, a document reset, and native form controls.'
          : 'Minimal includes theme and component styles. Native fields retain browser defaults.'}{' '}
        Settings are saved in the page URL.
      </p>
    </div>
  );
}
