import { galleryStyles } from '../../styles/gallery.styles.ts';
import { RenderRoot } from './render-root';

export function RenderDemo() {
  return (
    <div class={galleryStyles.row}>
      <RenderRoot custom={false} />
      <RenderRoot custom />
    </div>
  );
}
