import { render } from 'preact';
import { useRef, useState } from 'preact/hooks';
import {
  AppShell,
  AppShellWorkspace,
  AppShellContent,
  Sidebar,
  Disclosure,
  DisclosureSummary,
  DisclosureContent,
  Spinner,
  LoadingState,
  Tooltip,
  Button,
  Card,
  Checkbox,
  Field,
  Input,
  Switch,
  Textarea,
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
  CounterBadge,
  Text,
  Box,
} from '@violice/preact-fluent-ui';
import '@violice/preact-fluent-ui/theme.css';
import '@violice/preact-fluent-ui/styles.css';
import '@violice/preact-fluent-ui/native-controls.css';

function App() {
  const [dialog, setDialog] = useState<'modal' | 'confirm' | null>(null);
  const close = () => setDialog(null);
  const initialFocus = useRef<HTMLButtonElement>(null);
  const fallbackFocus = useRef<HTMLButtonElement>(null);
  return (
    <AppShell>
      <Sidebar aria-label="Installed app" />
      <AppShellWorkspace>
        <AppShellContent>
          <PageHeader title="Installed package" description="Controls and localized dialogs" />
          <Box render={<Card padding="none" />} display="grid" gap="space-2">
            <InfoBar title="Ready" tone="success">
              Installed from an npm archive.
            </InfoBar>
            <StatusBadge tone="success">Connected</StatusBadge>
            <Text preset="subtitle2" render={<h2 />}>
              Saved routes
            </Text>
            <CounterBadge aria-label="Saved routes">0</CounterBadge>
            <Text color="muted" render={(props) => <p {...props} />}>
              Profile details
            </Text>
            <Icon name="network" />
            <Field label="Connection">
              {(control) => (
                <Select {...control} name="connection" classes={{ wrapper: 'connection' }}>
                  <option>Local network</option>
                </Select>
              )}
            </Field>
            <Field label="Port" required hint="Enter the connection port.">
              {(control) => (
                <Input {...control} name="port" type="number" defaultValue="443" class="port" />
              )}
            </Field>
            <Field label="Notes">
              {(control) => <Textarea {...control} name="notes" rows={3} />}
            </Field>
            <Checkbox name="remember" label="Remember connection" defaultChecked />
            <Switch name="automatic" label="Connect automatically" />
            <Button ref={fallbackFocus} onClick={() => setDialog('modal')}>
              Open modal
            </Button>
            <Button onClick={() => setDialog('confirm')}>Confirm action</Button>
            <Button loading loadingLabel="Refreshing">
              Refresh profiles
            </Button>
            <Spinner label="Checking connection" />
            <LoadingState label="Loading profiles" />
            <Disclosure open>
              <DisclosureSummary>Profile details</DisclosureSummary>
              <DisclosureContent>Installed disclosure</DisclosureContent>
            </Disclosure>
            <Tooltip content="Refresh connection">
              {(props) => (
                <Button {...props} size="icon" aria-label="Refresh connection">
                  <Icon name="refresh" size={16} />
                </Button>
              )}
            </Tooltip>
            <EmptyState title="No saved profiles">Create a profile to start.</EmptyState>
          </Box>
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
        </AppShellContent>
      </AppShellWorkspace>
    </AppShell>
  );
}

render(<App />, document.getElementById('app')!);
