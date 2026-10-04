import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import { defaultSettings } from './gallery-settings';
import { galleryHref } from './gallery-routing';
export const GalleryContext = createContext({ settings: defaultSettings, base: '/' });
export function useGalleryHref() {
  const { settings, base } = useContext(GalleryContext);
  return (path: string) => galleryHref(path, settings, base);
}
