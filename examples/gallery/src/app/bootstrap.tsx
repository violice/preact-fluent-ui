import { hydrate } from 'preact-iso';
import { Gallery } from './gallery';

export function initializeGallery() {
  const root = document.getElementById('gallery');
  if (!root) throw new Error('Gallery root element is missing');
  hydrate(<Gallery />, root);
}
