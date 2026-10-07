import { Switch } from '../../../../../dist/components.js';
import { galleryStyles } from '../../styles/gallery.styles.ts';

export function SwitchExample() {
  return (
    <div class={galleryStyles.stack}>
      <Switch label="Automatic connection" />
      <Switch label="Enabled connection" defaultChecked />
      <Switch label="Unavailable connection" disabled />
    </div>
  );
}
