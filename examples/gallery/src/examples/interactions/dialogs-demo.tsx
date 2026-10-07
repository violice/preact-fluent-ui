import { css } from '../../../../../.artifacts/gallery-styled-system/css';
import { useRef } from 'preact/hooks';
import { useSignal, useSignalEffect } from '@preact/signals';
import {
  Button,
  ConfirmDialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  InfoBar,
  Modal,
  Select,
} from '../../../../../dist/components.js';
import { galleryStyles } from '../../styles/gallery.styles.ts';
import type { Scenario } from './dialog-scenarios';

export function DialogsDemo({ confirmation = false }: { confirmation?: boolean }) {
  const scenario = useSignal<Scenario>(confirmation ? 'confirmation' : 'standard');
  const open = useSignal(false);
  const removed = useSignal(false);
  const busy = useSignal(false);
  const startBusy = useSignal(false);
  const confirmDisabled = useSignal(false);
  const danger = useSignal(false);
  const message = useSignal('Choose a sample to try its controls.');
  const fallback = useRef<HTMLButtonElement>(null);
  const initial = useRef<HTMLButtonElement>(null);
  useSignalEffect(() => {
    if (!open.value || !busy.value) return;
    const timer = setTimeout(() => {
      busy.value = false;
      message.value = 'The demonstration finished.';
    }, 5000);
    return () => clearTimeout(timer);
  });
  const close = () => {
    open.value = false;
    busy.value = false;
  };
  return (
    <>
      <div data-gallery-preview class={galleryStyles.preview}>
        <Button
          ref={fallback}
          onClick={() => {
            removed.value = false;
            message.value = 'The samples have been restored.';
          }}
        >
          Reset samples
        </Button>{' '}
        <div>
          <div class={galleryStyles.form}>
            <label class={galleryStyles.label} for="dialog-scenario">
              Dialog sample
              <Select
                id="dialog-scenario"
                value={scenario.value}
                onChange={(event) => (scenario.value = event.currentTarget.value as Scenario)}
              >
                <option value="standard">Standard dialog</option>
                <option value="hidden">Hidden and unavailable controls</option>
                <option value="empty">No controls</option>
                <option value="removed">Removed opener</option>
                <option value="confirmation">Confirmation</option>
              </Select>
            </label>
            <label>
              <input
                type="checkbox"
                checked={startBusy.value}
                onChange={(event) => (startBusy.value = event.currentTarget.checked)}
              />{' '}
              Start confirmation busy for five seconds
            </label>
            <label>
              <input
                type="checkbox"
                checked={confirmDisabled.value}
                onChange={(event) => (confirmDisabled.value = event.currentTarget.checked)}
              />{' '}
              Disable confirmation
            </label>
            <label>
              <input
                type="checkbox"
                checked={danger.value}
                onChange={(event) => (danger.value = event.currentTarget.checked)}
              />{' '}
              Destructive confirmation
            </label>
            {!removed.value && (
              <Button
                onClick={() => {
                  busy.value = startBusy.value;
                  open.value = true;
                  if (scenario.value === 'removed') removed.value = true;
                }}
              >
                Open dialog
              </Button>
            )}
          </div>
        </div>
      </div>
      {removed.value && <InfoBar>The opener was removed. Reset samples restores it.</InfoBar>}
      <InfoBar title="Sample result">{message.value}</InfoBar>{' '}
      {open.value &&
        (scenario.value === 'confirmation' ? (
          <ConfirmDialog
            title="Apply sample changes?"
            cancelLabel="Cancel"
            confirmLabel="Apply changes"
            pendingLabel="Applying..."
            busy={busy.value}
            confirmDisabled={confirmDisabled.value}
            danger={danger.value}
            fallbackFocusRef={fallback}
            onClose={close}
            onConfirm={() => {
              busy.value = true;
              message.value = 'Applying sample changes...';
            }}
          >
            <p>This operation is a demonstration. Busy finishes after five seconds.</p>
          </ConfirmDialog>
        ) : (
          <Modal
            labelledBy="sample-dialog-title"
            initialFocusRef={initial}
            fallbackFocusRef={fallback}
            onClose={close}
          >
            <DialogHeader
              id="sample-dialog-title"
              title="Sample dialog"
              description="Try Tab, Shift+Tab and Escape."
            />
            <DialogBody>
              <p class={galleryStyles.longText}>
                Long descriptions wrap inside a narrow dialog.
                example-of-a-long-unbroken-value-that-should-fit-without-horizontal-scrolling.
              </p>
              {scenario.value === 'empty' && (
                <p>This dialog has no controls. Press Escape or select the backdrop to close.</p>
              )}
              {scenario.value === 'hidden' && (
                <>
                  <Button hidden>Hidden attribute</Button>
                  <Button class={css({ display: 'none' })}>Display none</Button>
                  <Button class={css({ visibility: 'hidden' })}>Visibility hidden</Button>
                  <Button disabled>Disabled control</Button>
                  <div inert>
                    <Button>Inert control</Button>
                  </div>
                  <input type="hidden" value="hidden" />
                </>
              )}
            </DialogBody>
            {scenario.value !== 'empty' && (
              <DialogFooter>
                <Button ref={initial} onClick={close}>
                  Close dialog
                </Button>
                <Button
                  variant="primary"
                  onClick={() => (message.value = 'A dialog action was selected.')}
                >
                  Try action
                </Button>
              </DialogFooter>
            )}
          </Modal>
        ))}
    </>
  );
}
