import '../../../dist/theme.css';
import '../../../dist/styles.css';
import { render } from 'preact';
import { Gallery } from './gallery';

// Preserve previously shared gallery links while using one set of controls.
const url = new URL(window.location.href);
if (/\/(minimal|green)\.html$/.test(url.pathname)) {
  if (url.pathname.endsWith('/minimal.html') && !url.searchParams.has('preset'))
    url.searchParams.set('preset', 'minimal');
  if (url.pathname.endsWith('/green.html') && !url.searchParams.has('palette'))
    url.searchParams.set('palette', 'green');
  url.pathname = url.pathname.replace(/[^/]+$/, 'index.html');
  window.history.replaceState(null, '', url);
}
render(<Gallery />, document.getElementById('gallery')!);
