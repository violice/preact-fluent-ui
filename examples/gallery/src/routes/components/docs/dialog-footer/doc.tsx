import type { ComponentDoc } from '../../types';
import { DocDialogFooterExample } from './dialog-footer-example';

export const dialogFooterDoc: ComponentDoc = {
  title: 'DialogFooter',
  slug: 'dialog-footer',
  purpose: 'Arrange the actions at the end of a dialog.',
  example: DocDialogFooterExample,
  code: '<DialogFooter><Button onClick={close}>Cancel</Button><Button variant="primary" onClick={save}>Save</Button></DialogFooter>',
  props: [],
  accessibility:
    'Use native buttons with specific action labels. Set initial focus through Modal rather than through the footer.',
};
