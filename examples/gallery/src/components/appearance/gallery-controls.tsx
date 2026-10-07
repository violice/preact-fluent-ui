import type { RefObject } from 'preact';
import { Select, Switch, Text } from '../../../../../dist/components.js';
import type { GallerySettings } from '../../state/gallery-settings';
import { galleryStyles } from '../../styles/gallery.styles.ts';

export function GalleryControls({
  settings,
  onChange,
  initialFocusRef,
}: {
  initialFocusRef?: RefObject<HTMLSelectElement>;
  settings: GallerySettings;
  onChange: (settings: GallerySettings) => void;
}) {
  const select = <K extends 'theme' | 'palette' | 'direction'>(
    key: K,
    label: string,
    options: [GallerySettings[K], string][],
  ) => (
    <label class={galleryStyles.label}>
      {label}
      <Select
        ref={key === 'theme' ? initialFocusRef : undefined}
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
    <div class={galleryStyles.appearanceControls}>
      <div class={galleryStyles.settingsGrid}>
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
      {select('direction', 'Text direction', [
        ['ltr', 'Left to right (LTR)'],
        ['rtl', 'Right to left (RTL)'],
      ])}
      {settings.palette === 'custom' && (
        <div class={galleryStyles.settingsColors}>
          {(['accent', 'primary'] as const).map((key) => (
            <label class={galleryStyles.label} key={key}>
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
      <section
        class={galleryStyles.settingsConfiguration}
        aria-labelledby="style-configuration-title"
      >
        <Text preset="subtitle2" render={<h3 />} id="style-configuration-title">
          Style configuration
        </Text>
        <div class={galleryStyles.settingsOption}>
          <Switch
            label="Document reset (reset)"
            aria-describedby="appearance-reset-description"
            checked={settings.reset}
            onChange={(event) => onChange({ ...settings, reset: event.currentTarget.checked })}
          />
          <Text
            preset="caption1"
            color="muted"
            render={<p />}
            id="appearance-reset-description"
            class={galleryStyles.settingsDescription}
          >
            Document sizing, margins, typography and theme background.
          </Text>
        </div>
        <div class={galleryStyles.settingsOption}>
          <Switch
            label="Native controls (native)"
            aria-describedby="appearance-native-description"
            checked={settings.native}
            onChange={(event) => onChange({ ...settings, native: event.currentTarget.checked })}
          />
          <Text
            preset="caption1"
            color="muted"
            render={<p />}
            id="appearance-native-description"
            class={galleryStyles.settingsDescription}
          >
            Fluent styles for plain HTML text inputs, select and textarea.
          </Text>
        </div>
      </section>
      <p class={galleryStyles.settingsNote}>
        Theme tokens and component styles stay enabled. Changes apply immediately and are saved in
        the page URL.
      </p>
    </div>
  );
}
