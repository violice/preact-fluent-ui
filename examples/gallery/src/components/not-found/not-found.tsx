import { useGalleryHref } from '../../state/gallery-context';
import { galleryStyles } from '../../styles/gallery.styles.ts';

export function NotFound() {
  const href = useGalleryHref();
  return (
    <>
      <p>The requested documentation page does not exist.</p>
      <a class={galleryStyles.documentationLink} href={href('/')}>
        Return to Getting Started
      </a>
    </>
  );
}
