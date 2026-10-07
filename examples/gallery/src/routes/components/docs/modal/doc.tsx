import type { ComponentDoc } from '../../types';
import { DocModalExample } from './modal-example';

export const modalDoc: ComponentDoc = {
  title: 'Modal',
  slug: 'modal',
  purpose: 'Show a controlled dialog with focus containment and restoration.',
  example: DocModalExample,
  code: `<Modal labelledBy="dialog-title" initialFocusRef={closeButton} fallbackFocusRef={opener} onClose={close}>
  <DialogHeader id="dialog-title" title="Connection details" />
  <DialogBody>Connection settings</DialogBody>
  <DialogFooter><Button ref={closeButton} onClick={close}>Close</Button></DialogFooter>
</Modal>`,
  props: [
    ['labelledBy', 'string, required', 'ID of the dialog heading.'],
    ['initialFocusRef', 'RefObject<HTMLElement>, required', 'First preferred focus target.'],
    ['fallbackFocusRef', 'RefObject<HTMLElement>', 'Focus target if the opener is removed.'],
    ['onClose', '() => void, required', 'Called by Escape or backdrop selection.'],
    ['children', 'ComponentChildren, required', 'Dialog contents.'],
    ['classes', 'root, backdrop', 'Add classes to modal parts.'],
  ],
  accessibility:
    'Mount only while open. The modal marks the background inert, traps focus, supports Escape and restores focus. Always supply a heading and a visible close action.',
};
