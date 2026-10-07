import { InfoBar } from '../../../../../dist/components.js';
import { galleryStyles } from '../../styles/gallery.styles.ts';

export function InfoBarExample() {
  return (
    <div class={galleryStyles.stack}>
      {(['info', 'success', 'warning', 'error'] as const).map((tone) => (
        <InfoBar tone={tone} title={tone} key={tone}>
          A long message remains readable in a narrow window.
          example-of-a-long-unbroken-message-that-needs-to-wrap-without-moving-the-page-sideways.
        </InfoBar>
      ))}
    </div>
  );
}
