import '../../../.artifacts/gallery-styled-system/styles.css';
import { initializeGallery } from './app/bootstrap';
export { prerender } from './app/prerender';

if (typeof window !== 'undefined') initializeGallery();
