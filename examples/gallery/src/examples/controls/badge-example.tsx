import { StatusBadge } from '../../../../../dist/components.js';
import { galleryStyles } from '../../styles/gallery.styles.ts';

export function BadgeExample() {
  return (
    <div class={galleryStyles.row}>
      {(['neutral', 'success', 'warning', 'error'] as const).map((tone) => (
        <StatusBadge tone={tone} key={tone}>
          {tone}
        </StatusBadge>
      ))}
      <StatusBadge>
        Waiting for a very long status description to finish across several lines
      </StatusBadge>
    </div>
  );
}
