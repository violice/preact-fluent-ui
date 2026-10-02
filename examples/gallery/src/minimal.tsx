import '../../../dist/theme.css';
import '../../../dist/styles.css';
import { render } from 'preact';
import { Gallery } from './gallery';

render(<Gallery mode="minimal" />, document.getElementById('gallery')!);
