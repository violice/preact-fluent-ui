import { CounterBadge } from '../../../../../dist/components.js';
import { galleryStyles } from '../../styles/gallery.styles.ts';

export function CounterExample() {
  return (
    <div class={galleryStyles.row}>
      {[0, 1, 12, 123, 123456].map((count) => (
        <CounterBadge key={count}>{count}</CounterBadge>
      ))}
    </div>
  );
}
