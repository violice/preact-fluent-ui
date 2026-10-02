import { useEffect, useRef, useState } from 'preact/hooks';
import {
  Button,
  Card,
  ConfirmDialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  EmptyState,
  Icon,
  InfoBar,
  Modal,
  PageHeader,
  Select,
  StatusBadge,
} from '../../../dist/index.js';
import type { ButtonProps, IconName } from '../../../dist/index.js';
import styles from './gallery.module.css';

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

export function Gallery({ mode }: { mode: 'full' | 'minimal' | 'green' }) {
  const [choice, setChoice] = useState('automatic');
  const [scenario, setScenario] = useState<Scenario>('standard');
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
    <main class={styles.gallery}>
      <nav class={styles.navigation} aria-label="Gallery pages">
        <a href="/index.html" aria-current={mode === 'full' ? 'page' : undefined}>
          Full gallery
        </a>
        <a href="/minimal.html" aria-current={mode === 'minimal' ? 'page' : undefined}>
          Minimal gallery
        </a>
        <a href="/green.html" aria-current={mode === 'green' ? 'page' : undefined}>
          Green gallery
        </a>
      </nav>
      <PageHeader
        title="Preact Fluent UI"
        description="Buttons, forms, notices and dialogs for everyday desktop tasks."
        actions={
          <Button
            ref={fallback}
            onClick={() => {
              setRemoved(false);
              setMessage('The samples have been restored.');
            }}
          >
            Reset samples
          </Button>
        }
        notices={
          <InfoBar
            title={
              mode === 'minimal' ? 'Minimal setup' : mode === 'green' ? 'Green theme' : 'Full setup'
            }
          >
            {mode === 'minimal'
              ? 'Components with the required theme and styles.'
              : 'Components with document defaults and ordinary form fields.'}
          </InfoBar>
        }
      />
      <div class={styles.sections}>
        <Card aria-labelledby="buttons-heading">
          <h2 class={styles.heading} id="buttons-heading">
            Buttons
          </h2>
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
        </Card>
        <Card aria-labelledby="notices-heading">
          <h2 class={styles.heading} id="notices-heading">
            Notices and status
          </h2>
          <div class={styles.stack}>
            {(['info', 'success', 'warning', 'error'] as const).map((tone) => (
              <InfoBar key={tone} tone={tone} title={tone}>
                A long message remains readable when the window is narrow.
                example-of-a-long-unbroken-message-that-needs-to-wrap-without-moving-the-page-sideways.
              </InfoBar>
            ))}
          </div>
          <p class={styles.row}>
            {(['neutral', 'success', 'warning', 'error'] as const).map((tone) => (
              <StatusBadge key={tone} tone={tone}>
                {tone}
              </StatusBadge>
            ))}
          </p>
          <StatusBadge>
            Waiting for a very long status description to finish across several lines
          </StatusBadge>
        </Card>
        <Card aria-labelledby="forms-heading">
          <h2 class={styles.heading} id="forms-heading">
            Forms
          </h2>
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
                <option value="manual">Manual configuration with a long descriptive option</option>
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
        </Card>
        <Card aria-labelledby="icons-heading">
          <h2 class={styles.heading} id="icons-heading">
            Icons
          </h2>
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
        </Card>
        <EmptyState title="No connections yet">
          <p>
            Add a sample connection to start. Longer descriptions fit inside the available space.
          </p>
          <Button onClick={() => setMessage('A sample connection was added.')}>
            <Icon name="add" />
            Add connection
          </Button>
        </EmptyState>
        <Card aria-labelledby="dialogs-heading">
          <h2 class={styles.heading} id="dialogs-heading">
            Dialogs
          </h2>
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
            {removed && <p>The opener was removed. Reset samples restores it.</p>}
          </div>
        </Card>
        <InfoBar title="Sample result">{message}</InfoBar>
      </div>
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
    </main>
  );
}
