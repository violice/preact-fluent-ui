import { Spinner } from '../../../../../dist/components.js';
import { galleryStyles } from '../../styles/gallery.styles.ts';

export function SpinnerExample() {
  return (
    <div class={galleryStyles.row}>
      <Spinner size="small" label="Checking connection" />
      <Spinner size="medium" label="Reading profiles" />
      <Spinner size="large" label="Loading backups" />
    </div>
  );
}
