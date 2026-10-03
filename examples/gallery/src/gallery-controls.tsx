import { useEffect, useLayoutEffect, useState } from 'preact/hooks';
import { Button, Card, Select } from '../../../dist/index.js';
import resetUrl from '../../../dist/reset.css?url';
import nativeControlsUrl from '../../../dist/native-controls.css?url';
import { defaultSettings, readSettings, settingsUrl, themeOverrides } from './gallery-settings';
import type { GallerySettings } from './gallery-settings';
import styles from './gallery.module.css';

export function useGallerySettings() {
  const [settings, setSettings] = useState(() => readSettings(new URL(window.location.href)));
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false,
  );
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-color-scheme: dark)');
    const change = () => setSystemDark(media?.matches ?? false);
    const navigate = () => setSettings(readSettings(new URL(window.location.href)));
    media?.addEventListener('change', change);
    window.addEventListener('popstate', navigate);
    return () => {
      media?.removeEventListener('change', change);
      window.removeEventListener('popstate', navigate);
    };
  }, []);
  useLayoutEffect(() => {
    const style = document.createElement('style');
    style.dataset.galleryTheme = '';
    style.textContent = themeOverrides(settings, systemDark);
    document.head.append(style);
    return () => style.remove();
  }, [settings, systemDark]);
  useLayoutEffect(() => {
    if (settings.preset !== 'full') return;
    const links = [resetUrl, nativeControlsUrl].map((href) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.dataset.galleryOptional = '';
      document.head.append(link);
      return link;
    });
    return () => links.forEach((link) => link.remove());
  }, [settings.preset]);
  const update = (next: GallerySettings) => {
    window.history.replaceState(null, '', settingsUrl(new URL(window.location.href), next));
    setSettings(next);
  };
  return { settings, update };
}

export function GalleryControls({
  settings,
  onChange,
}: {
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
    <Card aria-labelledby="settings-heading">
      <h2 id="settings-heading" class={styles.heading}>
        Gallery settings
      </h2>
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
        {select('palette', 'Palette', [
          ['standard', 'Standard'],
          ['green', 'Green'],
          ['custom', 'Custom'],
        ])}
        {settings.palette === 'custom' &&
          (['accent', 'primary'] as const).map((key) => (
            <label class={styles.label} key={key}>
              {key === 'accent' ? 'Accent color' : 'Primary color'}
              <input
                type="color"
                value={settings[key]}
                onInput={(event) => onChange({ ...settings, [key]: event.currentTarget.value })}
              />
            </label>
          ))}
        <Button onClick={() => onChange({ ...defaultSettings })}>Reset appearance</Button>
      </div>
      <p class={styles.settingsNote}>
        {settings.preset === 'full'
          ? 'Theme and component styles, document reset and native form controls.'
          : 'Theme and component styles only. Native fields retain browser defaults.'}{' '}
        Settings are saved in the page URL.
      </p>
    </Card>
  );
}
