import type { ComponentChildren, RefObject } from 'preact';
import { useId, useRef } from 'preact/hooks';
import { Button } from './button';
import { DialogBody, DialogFooter, DialogHeader } from './dialog-content';
import { Modal } from './modal';

export type ConfirmDialogProps = {
  title: string;
  children: ComponentChildren;
  cancelLabel: string;
  confirmLabel: string;
  pendingLabel: string;
  busy?: boolean;
  confirmDisabled?: boolean;
  danger?: boolean;
  fallbackFocusRef?: RefObject<HTMLElement>;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  title,
  children,
  cancelLabel,
  confirmLabel,
  pendingLabel,
  busy = false,
  confirmDisabled = false,
  danger = false,
  fallbackFocusRef,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  const titleId = useId();
  const cancel = useRef<HTMLButtonElement>(null);
  const close = () => {
    if (!busy) onClose();
  };
  const confirm = () => {
    if (!busy && !confirmDisabled) onConfirm();
  };
  return (
    <Modal
      labelledBy={titleId}
      initialFocusRef={cancel}
      fallbackFocusRef={fallbackFocusRef}
      onClose={close}
    >
      <DialogHeader id={titleId} title={title} />
      <DialogBody>{children}</DialogBody>
      <DialogFooter>
        <Button ref={cancel} disabled={busy} onClick={close}>
          {cancelLabel}
        </Button>
        <Button
          variant={danger ? 'danger' : 'primary'}
          disabled={busy || confirmDisabled}
          onClick={confirm}
        >
          {busy ? pendingLabel : confirmLabel}
        </Button>
      </DialogFooter>
    </Modal>
  );
}
