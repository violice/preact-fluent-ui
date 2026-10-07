import '../../../../.artifacts/gallery-styled-system/styles.css';
import { render } from 'preact';
import { createGalleryStore } from '../state/gallery-store';
import { ShellDocument } from '../examples/app-shell';
const store = createGalleryStore();
store.connectBrowser();
render(<ShellDocument />, document.getElementById('shell-preview')!);
