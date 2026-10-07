import { settingsUrl, type GallerySettings } from '../state/gallery-settings';
export function galleryBase(base: string): string {
  return `/${base.split('/').filter(Boolean).join('/')}${base.split('/').filter(Boolean).length ? '/' : ''}`;
}
export function galleryHref(path: string, settings: GallerySettings, base: string): string {
  const pathname = galleryBase(base) + path.replace(/^\//, '');
  const url = settingsUrl(new URL(pathname, 'https://gallery.invalid'), settings);
  return url.pathname + url.search + url.hash;
}
export function normalizeGalleryPath(pathname: string, base: string): string {
  const prefix = galleryBase(base).replace(/\/$/, '');
  const path =
    prefix && (pathname === prefix || pathname.startsWith(prefix + '/'))
      ? pathname.slice(prefix.length)
      : pathname;
  return path.replace(/\/+$/, '') || '/';
}
