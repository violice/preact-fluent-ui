import type { ComponentDoc } from '../../types';
import { DocDialogBodyExample } from './dialog-body-example';

export const dialogBodyDoc: ComponentDoc = {
  title: 'DialogBody',
  slug: 'dialog-body',
  purpose: 'Contain the scrollable content of a dialog.',
  example: DocDialogBodyExample,
  code: '<DialogBody><p>Review the connection configuration.</p></DialogBody>',
  props: [],
  accessibility:
    'Keep the content in a logical reading order. Place the dialog name in DialogHeader and actions in DialogFooter.',
};
