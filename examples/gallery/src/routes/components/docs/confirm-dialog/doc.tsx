import { samples } from '../../../../examples/code-samples';
import type { ComponentDoc } from '../../types';
import { DocConfirmDialogExample } from './confirm-dialog-example';

export const confirmDialogDoc: ComponentDoc = {
  title: 'ConfirmDialog',
  slug: 'confirm-dialog',
  purpose: 'Confirm a pending or destructive action with safe initial focus.',
  example: DocConfirmDialogExample,
  code: samples.dialogs,
  props: [
    [
      'title / cancelLabel / confirmLabel / pendingLabel',
      'string, required',
      'Dialog title and explicit action labels.',
    ],
    [
      'busy / confirmDisabled / danger',
      'boolean',
      'Default false. Busy disables both actions and close requests.',
    ],
    [
      'onClose / onConfirm',
      '() => void, required',
      'Controlled cancellation and confirmation handlers.',
    ],
    ['fallbackFocusRef', 'RefObject<HTMLElement>', 'Alternative restoration target.'],
    ['children', 'ComponentChildren, required', 'Explanation of the operation.'],
    [
      'classes',
      'root, backdrop, header, title, body, footer, cancelButton, confirmButton',
      'Add classes to dialog parts.',
    ],
  ],
  accessibility:
    'Initial focus goes to Cancel. Explain destructive results and provide a pending label while busy. Finish or report asynchronous operations in the controlling component.',
};
