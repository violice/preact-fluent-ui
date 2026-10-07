import { useSignal } from '@preact/signals';
import { Select } from '../../../../../dist/components.js';
import { galleryStyles } from '../../styles/gallery.styles.ts';

export function SelectExample() {
  const mode = useSignal('automatic');
  return (
    <label class={galleryStyles.label}>
      Connection mode
      <Select value={mode.value} onChange={(e) => (mode.value = e.currentTarget.value)}>
        <option value="automatic">Automatic</option>
        <option value="manual">Manual configuration with a long descriptive option</option>
      </Select>
    </label>
  );
}
