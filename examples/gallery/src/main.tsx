import '../../../dist/theme.css';
import '../../../dist/styles.css';
import '../../../dist/reset.css';
import '../../../dist/native-controls.css';
import { render } from 'preact';
import { Gallery } from './gallery';

render(<Gallery mode="full" />, document.getElementById('gallery')!);
