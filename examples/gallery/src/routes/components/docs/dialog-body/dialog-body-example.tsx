import { DialogBody } from '../../../../../../../dist/components.js';
import { galleryStyles } from '../../../../styles/gallery.styles.ts';

export function DocDialogBodyExample() {
  return (
    <DialogBody>
      <p class={galleryStyles.longText}>
        Long descriptions wrap inside a narrow dialog.
        example-of-a-long-unbroken-value-that-should-fit-without-horizontal-scrolling.
      </p>
    </DialogBody>
  );
}
