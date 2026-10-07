import { useContext } from 'preact/hooks';
import { GalleryContext } from '../../state/gallery-context';
import { galleryHref } from '../../routes/routing';
import { galleryStyles } from '../../styles/gallery.styles.ts';

export function ShellPreview() {
  const { settings, base } = useContext(GalleryContext);
  return (
    <iframe
      class={galleryStyles.shellPreview}
      title="Application shell preview"
      src={galleryHref('/shell-preview.html', settings, base)}
    />
  );
}
