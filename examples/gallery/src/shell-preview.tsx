import '../../../.artifacts/gallery-styled-system/styles.css';
import { render } from 'preact';
import { createGalleryStore } from './gallery-store';
import { ShellDocument } from './gallery-app-shell-examples';
const store = createGalleryStore();
store.connectBrowser();
render(<ShellDocument />, document.getElementById('shell-preview')!);
