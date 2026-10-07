import { useEffect, useRef } from 'preact/hooks';
import { createGalleryStore } from './gallery-store';
import type { GalleryStore } from './gallery-store';

export function useGallerySettings(providedStore?: GalleryStore) {
  const instance = useRef<GalleryStore | undefined>(providedStore);
  if (!instance.current) instance.current = createGalleryStore();
  const store = instance.current;
  useEffect(() => store.connectBrowser(), [store]);
  return { settings: store.settings.value, update: store.update, store };
}
