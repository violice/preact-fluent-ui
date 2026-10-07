import { Checkbox } from '../../../../../dist/components.js';
import { galleryStyles } from '../../styles/gallery.styles.ts';

export function CheckboxExample() {
  return (
    <div class={galleryStyles.stack}>
      <Checkbox label="Remember connection" />
      <Checkbox label="Mixed selection" indeterminate />
      <Checkbox label="Unavailable selection" disabled defaultChecked />
      <Checkbox label="A long checkbox label wraps across lines inside a narrow window." />
    </div>
  );
}
