import { DocSection } from './gallery-doc-section';
import { useEffect, useRef, useState } from 'preact/hooks';
import {
  Button,
  ConfirmDialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Icon,
  InfoBar,
  Modal,
  Select,
} from '../../../dist/components.js';
import type { ButtonProps, IconName } from '../../../dist/components.js';
import styles from './gallery.module.css';
import { CodeExample } from './code-block';
import { samples } from './code-samples';
import { ConnectionForm, FormStates } from './forms-demo';

const iconNames: IconName[] = [
  'about',
  'adapter',
  'add',
  'chevron-down',
  'connected',
  'copy',
  'delete',
  'diagnostics',
  'disconnected',
  'edit',
  'eye',
  'info',
  'network',
  'open',
  'profile',
  'refresh',
  'restore',
  'routes',
  'settings',
  'shield',
  'vpn',
  'warning',
];
const variants: NonNullable<ButtonProps['variant']>[] = ['default', 'primary', 'subtle', 'danger'];
type Scenario = 'standard' | 'hidden' | 'empty' | 'removed' | 'confirmation';

export function ButtonsDemo() {
  const [message, setMessage] = useState('Choose a button.');
  return (
    <>
      {' '}
      <div class={styles.preview}>
        <div class={styles.stack}>
          {variants.map((variant) => (
            <div class={styles.row} key={variant}>
              <Button variant={variant} onClick={() => setMessage(`${variant} button selected.`)}>
                {variant}
              </Button>
              <Button variant={variant} size="compact">
                Compact {variant}
              </Button>
              <Button variant={variant} size="icon" aria-label={`Refresh ${variant}`}>
                <Icon name="refresh" size={16} />
              </Button>
              <Button variant={variant} disabled>
                Disabled {variant}
              </Button>
            </div>
          ))}
        </div>
      </div>
      <InfoBar title="Sample result">{message}</InfoBar>
    </>
  );
}
export function IconsDemo() {
  return (
    <>
      {' '}
      <div>
        <div class={styles.icons}>
          {iconNames.map((name) => (
            <div class={styles.iconSample} key={name}>
              <Icon name={name} size={16} />
              <Icon name={name} size={20} />
              <Icon name={name} size={24} />
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
export function FormsDemo() {
  const [choice, setChoice] = useState('automatic');
  const [message, setMessage] = useState('');
  return (
    <>
      {' '}
      <div class={styles.sections}>
        <DocSection title="Connection form">
          <ConnectionForm />
          <CodeExample code={samples.connectionForm} />
        </DocSection>
        <DocSection title="Control states">
          <div class={styles.preview}>
            <FormStates />
          </div>
          <CodeExample code={samples.formStates} />
        </DocSection>
        <DocSection title="Native fields and Select">
          <div class={styles.preview}>
            <form
              class={styles.form}
              onSubmit={(event) => {
                event.preventDefault();
                setMessage(`Saved ${choice}.`);
              }}
            >
              <label class={styles.label} for="connection-mode">
                Connection mode
                <Select
                  id="connection-mode"
                  name="mode"
                  value={choice}
                  onChange={(event) => setChoice(event.currentTarget.value)}
                >
                  <option value="automatic">Automatic</option>
                  <option value="manual">
                    Manual configuration with a long descriptive option
                  </option>
                </Select>
              </label>
              <label class={styles.label} for="disabled-mode">
                Unavailable mode
                <Select id="disabled-mode" disabled>
                  <option>Unavailable</option>
                </Select>
              </label>
              <label class={styles.label} for="native-name">
                Profile name
                <input
                  class={styles.nativeField}
                  id="native-name"
                  name="profile"
                  placeholder="Sample profile"
                />
              </label>
              <label class={styles.label} for="native-notes">
                Notes
                <textarea
                  class={styles.nativeField}
                  id="native-notes"
                  name="notes"
                  rows={2}
                  placeholder="Optional notes"
                />
              </label>
              <label class={styles.label} for="native-region">
                Region
                <select class={styles.nativeField} id="native-region" name="region">
                  <option>Local</option>
                  <option>Remote</option>
                </select>
              </label>
              <Button type="submit" variant="primary">
                Save sample
              </Button>
            </form>
          </div>
          <InfoBar title="Sample result">{message}</InfoBar>
          <CodeExample code={samples.forms} />
        </DocSection>
      </div>
    </>
  );
}
export function DialogsDemo({ confirmation = false }: { confirmation?: boolean }) {
  const [scenario, setScenario] = useState<Scenario>(confirmation ? 'confirmation' : 'standard');
  const [open, setOpen] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [startBusy, setStartBusy] = useState(false);
  const [confirmDisabled, setConfirmDisabled] = useState(false);
  const [danger, setDanger] = useState(false);
  const [message, setMessage] = useState('Choose a sample to try its controls.');
  const fallback = useRef<HTMLButtonElement>(null);
  const initial = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open || !busy) return;
    const timer = setTimeout(() => {
      setBusy(false);
      setMessage('The demonstration finished.');
    }, 5000);
    return () => clearTimeout(timer);
  }, [open, busy]);
  const close = () => {
    setOpen(false);
    setBusy(false);
  };
  return (
    <>
      <div class={styles.preview}>
        <Button
          ref={fallback}
          onClick={() => {
            setRemoved(false);
            setMessage('The samples have been restored.');
          }}
        >
          Reset samples
        </Button>{' '}
        <div>
          <div class={styles.form}>
            <label class={styles.label} for="dialog-scenario">
              Dialog sample
              <Select
                id="dialog-scenario"
                value={scenario}
                onChange={(event) => setScenario(event.currentTarget.value as Scenario)}
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
                checked={startBusy}
                onChange={(event) => setStartBusy(event.currentTarget.checked)}
              />{' '}
              Start confirmation busy for five seconds
            </label>
            <label>
              <input
                type="checkbox"
                checked={confirmDisabled}
                onChange={(event) => setConfirmDisabled(event.currentTarget.checked)}
              />{' '}
              Disable confirmation
            </label>
            <label>
              <input
                type="checkbox"
                checked={danger}
                onChange={(event) => setDanger(event.currentTarget.checked)}
              />{' '}
              Destructive confirmation
            </label>
            {!removed && (
              <Button
                onClick={() => {
                  setBusy(startBusy);
                  setOpen(true);
                  if (scenario === 'removed') setRemoved(true);
                }}
              >
                Open dialog
              </Button>
            )}
          </div>
        </div>
      </div>
      {removed && <InfoBar>The opener was removed. Reset samples restores it.</InfoBar>}
      <InfoBar title="Sample result">{message}</InfoBar>{' '}
      {open &&
        (scenario === 'confirmation' ? (
          <ConfirmDialog
            title="Apply sample changes?"
            cancelLabel="Cancel"
            confirmLabel="Apply changes"
            pendingLabel="Applying..."
            busy={busy}
            confirmDisabled={confirmDisabled}
            danger={danger}
            fallbackFocusRef={fallback}
            onClose={close}
            onConfirm={() => {
              setBusy(true);
              setMessage('Applying sample changes...');
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
              <p class={styles.longText}>
                Long descriptions wrap inside a narrow dialog.
                example-of-a-long-unbroken-value-that-should-fit-without-horizontal-scrolling.
              </p>
              {scenario === 'empty' && (
                <p>This dialog has no controls. Press Escape or select the backdrop to close.</p>
              )}
              {scenario === 'hidden' && (
                <>
                  <Button hidden>Hidden attribute</Button>
                  <Button style={{ display: 'none' }}>Display none</Button>
                  <Button style={{ visibility: 'hidden' }}>Visibility hidden</Button>
                  <Button disabled>Disabled control</Button>
                  <div inert>
                    <Button>Inert control</Button>
                  </div>
                  <input type="hidden" value="hidden" />
                </>
              )}
            </DialogBody>
            {scenario !== 'empty' && (
              <DialogFooter>
                <Button ref={initial} onClick={close}>
                  Close dialog
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setMessage('A dialog action was selected.')}
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
