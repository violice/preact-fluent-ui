import '../styled-system/styles.css';
import { render } from 'preact';
import { Button } from '@violice/preact-fluent-ui/components';

render(<Button variant="primary">Installed Button</Button>, document.getElementById('app')!);
