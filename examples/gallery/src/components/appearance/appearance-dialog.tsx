import type { RefObject } from 'preact';
import {
  Modal,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from '../../../../../dist/components.js';
import { GalleryControls } from './gallery-controls';
import { defaultSettings } from '../../state/gallery-settings';
import type { GallerySettings } from '../../state/gallery-settings';
import { galleryStyles } from '../../styles/gallery.styles.ts';
export function AppearanceDialog({
  settings,
  update,
  onClose,
  initialSettingsFocus,
  navigationToggle,
}: {
  settings: GallerySettings;
  update: (settings: GallerySettings) => void;
  onClose: () => void;
  initialSettingsFocus: RefObject<HTMLSelectElement>;
  navigationToggle: RefObject<HTMLButtonElement>;
}) {
  return (
    <Modal
      labelledBy="appearance-settings-title"
      initialFocusRef={initialSettingsFocus}
      fallbackFocusRef={navigationToggle}
      onClose={onClose}
    >
      <DialogHeader id="appearance-settings-title" title="Appearance settings" />
      <DialogBody>
        <GalleryControls
          settings={settings}
          onChange={update}
          initialFocusRef={initialSettingsFocus}
        />
      </DialogBody>
      <DialogFooter class={galleryStyles.settingsFooter}>
        <Button onClick={() => update({ ...defaultSettings })}>Reset appearance</Button>
        <Button onClick={onClose}>Close settings</Button>
      </DialogFooter>
    </Modal>
  );
}
