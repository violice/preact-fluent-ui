export const samples = {
  buttons: `import { Button, Icon } from '@violice/preact-fluent-ui';

<Button variant="primary" onClick={save}>Save</Button>
<Button size="compact">Compact</Button>
<Button size="icon" aria-label="Refresh">
  <Icon name="refresh" size={16} />
</Button>
<Button disabled>Unavailable</Button>`,
  notices: `import { InfoBar, StatusBadge } from '@violice/preact-fluent-ui';

<InfoBar tone="success" title="Saved">
  Your changes have been applied.
</InfoBar>
<StatusBadge tone="success">Connected</StatusBadge>`,
  forms: `import { useState } from 'preact/hooks';
import { Button, Select } from '@violice/preact-fluent-ui';

export function ConnectionForm() {
  const [mode, setMode] = useState('automatic');
  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      console.log(mode);
    }}>
      <label>
        Connection mode
        <Select value={mode}
          onChange={(event) => setMode(event.currentTarget.value)}>
          <option value="automatic">Automatic</option>
          <option value="manual">Manual</option>
        </Select>
      </label>
      <Button type="submit" variant="primary">Save</Button>
    </form>
  );
}`,
  icons: `import { Icon } from '@violice/preact-fluent-ui';

// Icons are decorative. Put the accessible name on the control.
<Icon name="network" size={16} />
<Icon name="refresh" size={20} />
<Icon name="settings" size={24} />`,
  empty: `import { Button, EmptyState, Icon } from '@violice/preact-fluent-ui';

<EmptyState title="No connections yet">
  <p>Add a connection to start.</p>
  <Button onClick={addConnection}>
    <Icon name="add" />
    Add connection
  </Button>
</EmptyState>`,
  dialogs: `import { useRef, useState } from 'preact/hooks';
import { Button, ConfirmDialog } from '@violice/preact-fluent-ui';

export function ConfirmationExample() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const opener = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button ref={opener} onClick={() => setOpen(true)}>Apply changes</Button>
      {open && (
        <ConfirmDialog
          title="Apply changes?"
          cancelLabel="Cancel"
          confirmLabel="Apply"
          pendingLabel="Applying..."
          busy={busy}
          fallbackFocusRef={opener}
          onClose={() => setOpen(false)}
          onConfirm={async () => {
            setBusy(true);
            setError('');
            try {
              await new Promise((resolve) => setTimeout(resolve, 1000));
              setOpen(false);
            } catch {
              setError('Could not apply changes. Try again.');
            } finally {
              setBusy(false);
            }
          }}
        >
          <p>This example waits one second to simulate an operation.</p>
          {error && <p role="alert">{error}</p>}
        </ConfirmDialog>
      )}
    </>
  );
}`,
};
