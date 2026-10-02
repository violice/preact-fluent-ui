import { render } from 'preact';
import { Button } from '@violice/preact-fluent-ui';
import '@violice/preact-fluent-ui/theme.css';
import '@violice/preact-fluent-ui/styles.css';

render(<Button variant="primary">Installed Button</Button>, document.getElementById('app')!);
