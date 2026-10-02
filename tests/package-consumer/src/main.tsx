import { render } from 'preact';
import { useRef, useState } from 'preact/hooks';
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
} from '@violice/preact-fluent-ui';
import '@violice/preact-fluent-ui/theme.css';
import '@violice/preact-fluent-ui/styles.css';
import '@violice/preact-fluent-ui/reset.css';
import '@violice/preact-fluent-ui/native-controls.css';

function App() {
  const [dialog, setDialog] = useState<'modal' | 'confirm' | null>(null);
  const close = () => setDialog(null);
  const initialFocus = useRef<HTMLButtonElement>(null);
  const fallbackFocus = useRef<HTMLButtonElement>(null);
  return (
    <>
      <PageHeader title="Installed package" description="Controls and localized dialogs" />
      <Card>
        <InfoBar title="Ready" tone="success">
          Installed from an npm archive.
        </InfoBar>
        <StatusBadge tone="success">Connected</StatusBadge>
        <Icon name="network" />
        <Select aria-label="Connection">
          <option>Local network</option>
        </Select>
        <Button ref={fallbackFocus} onClick={() => setDialog('modal')}>
          Open modal
        </Button>
        <Button onClick={() => setDialog('confirm')}>Confirm action</Button>
        <EmptyState title="No saved profiles">Create a profile to start.</EmptyState>
      </Card>
      {dialog === 'modal' && (
        <Modal
          labelledBy="installed-dialog"
          initialFocusRef={initialFocus}
          fallbackFocusRef={fallbackFocus}
          onClose={close}
        >
          <DialogHeader id="installed-dialog" title="Installed modal" />
          <DialogBody>All component imports resolve through the package root.</DialogBody>
          <DialogFooter>
            <Button ref={initialFocus} onClick={close}>
              Close
            </Button>
          </DialogFooter>
        </Modal>
      )}
      {dialog === 'confirm' && (
        <ConfirmDialog
          title="Save profile?"
          cancelLabel="Cancel"
          confirmLabel="Save"
          pendingLabel="Saving"
          fallbackFocusRef={fallbackFocus}
          onClose={close}
          onConfirm={close}
        >
          This sample supplies every required label.
        </ConfirmDialog>
      )}
    </>
  );
}

render(<App />, document.getElementById('app')!);
