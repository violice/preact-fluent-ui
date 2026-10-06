import type { ComponentChildren, JSX, RefObject } from 'preact';
import { useId, useRef } from 'preact/hooks';
import { Button } from '../button/button';
import { DialogBody, DialogFooter, DialogHeader } from './index';
import { Modal } from './modal';

export type ConfirmDialogProps = {
  class?: JSX.Signalish<string | undefined>;
  className?: JSX.Signalish<string | undefined>;
  classes?: {
    root?: JSX.Signalish<string | undefined>;
    backdrop?: JSX.Signalish<string | undefined>;
    header?: JSX.Signalish<string | undefined>;
    title?: JSX.Signalish<string | undefined>;
    body?: JSX.Signalish<string | undefined>;
    footer?: JSX.Signalish<string | undefined>;
    cancelButton?: JSX.Signalish<string | undefined>;
    confirmButton?: JSX.Signalish<string | undefined>;
  };
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
  class: classProp,
  className,
  classes,
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
      class={classProp}
      className={className}
      classes={{ root: classes?.root, backdrop: classes?.backdrop }}
      labelledBy={titleId}
      initialFocusRef={cancel}
      fallbackFocusRef={fallbackFocusRef}
      onClose={close}
    >
      <DialogHeader
        id={titleId}
        title={title}
        classes={{ root: classes?.header, title: classes?.title }}
      />
      <DialogBody class={classes?.body}>{children}</DialogBody>
      <DialogFooter class={classes?.footer}>
        <Button class={classes?.cancelButton} ref={cancel} disabled={busy} onClick={close}>
          {cancelLabel}
        </Button>
        <Button
          class={classes?.confirmButton}
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
