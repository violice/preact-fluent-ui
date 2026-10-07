import { LocationProvider } from 'preact-iso';
import type { GalleryStore } from '../state/gallery-store';
import { galleryBase } from '../routes/routing';
import { GalleryShell } from './gallery-shell';
export type GalleryProps = { base?: string; url?: string; store?: GalleryStore };
export function Gallery({ base = import.meta.env.BASE_URL, url, store }: GalleryProps) {
  // preact-iso accepts url for prerender, though its public types no longer expose it.
  const locationProps = { scope: galleryBase(base), ...(url ? { url } : {}) };
  return (
    <LocationProvider {...locationProps}>
      <GalleryShell base={base} store={store} />
    </LocationProvider>
  );
}
