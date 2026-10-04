export const samples = {
  formStates: `import { Checkbox, Field, Input, Switch, Textarea } from '@violice/preact-fluent-ui';

export function FormStates() {
  return (
    <div>
      <Field label="Display name" hint="Text controls work with either CSS preset.">
        {(control) => <Input {...control} placeholder="Connection name" />}
      </Field>
      <Field label="Read-only name">
        {(control) => <Input {...control} readOnly value="Office connection" />}
      </Field>
      <Field label="Unavailable name" hint="The description remains readable.">
        {(control) => <Input {...control} disabled value="Unavailable" />}
      </Field>
      <Field
        label="Invalid name"
        validationState="error"
        validationMessage="Choose a different name."
      >
        {(control) => <Input {...control} defaultValue="Duplicate" />}
      </Field>
      <Field label="Connection notes" hint="Resize vertically to add more lines.">
        {(control) => <Textarea {...control} rows={3} placeholder="Optional connection notes" />}
      </Field>
      <Field label="Read-only notes">
        {(control) => <Textarea {...control} readOnly value="Managed by your administrator." />}
      </Field>
      <Field label="Unavailable notes">
        {(control) => <Textarea {...control} disabled value="Unavailable" />}
      </Field>
      <Checkbox label="Checked checkbox" defaultChecked />
      <Checkbox label="Mixed checkbox" indeterminate />
      <Checkbox label="Disabled checkbox" disabled defaultChecked />
      <Checkbox label="A long checkbox label wraps across several lines so its full description remains readable in a narrow window." />
      <Switch label="Enabled switch" defaultChecked />
      <Switch label="Off switch" />
      <Switch label="Disabled switch" disabled defaultChecked />
      <div dir="rtl">
        <Switch label="Automatic connection in RTL" defaultChecked />
      </div>
      <Switch label="A long switch label wraps across several lines so its full description remains readable in a narrow window." />
      <Field label="Hidden field" hidden>
        {(control) => <Input {...control} />}
      </Field>
      <Input aria-label="Hidden input" hidden />
      <Textarea aria-label="Hidden textarea" hidden />
      <Checkbox label="Hidden checkbox" hidden />
      <Switch label="Hidden switch" hidden />
    </div>
  );
}
`,
  connectionForm: `import { useState } from 'preact/hooks';
import { Button, Checkbox, Field, InfoBar, Input, Select, Switch } from '@violice/preact-fluent-ui';

export function ConnectionForm() {
  const [port, setPort] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState('Save the sample connection to preview its values.');
  return (
    <>
    <form noValidate onSubmit={(event) => {
      event.preventDefault();
      const number = Number(port);
      if (!port.trim() || !Number.isInteger(number) || number < 1 || number > 65535) {
        setError('Enter a whole port number from 1 to 65535.');
        setResult('');
        return;
      }
      setError('');
      const data = new FormData(event.currentTarget);
      setResult(\`Saved: port \${port}, adapter \${data.get('adapter')}, remember \${data.has('remember') ? 'yes' : 'no'}, automatic \${data.has('automatic') ? 'yes' : 'no'}.\`);
    }}>
      <Field label="Port" hint="A whole number from 1 to 65535" required
        validationState={error ? 'error' : 'none'} validationMessage={error}>
        {(control) => <Input {...control} name="port" type="number" min={1} max={65535}
          value={port} onInput={(event) => setPort(event.currentTarget.value)} />}
      </Field>
      <Field label="Adapter">
        {(control) => <Select {...control} name="adapter">
          <option value="auto">Automatic</option>
          <option value="ethernet">Ethernet</option>
        </Select>}
      </Field>
      <Checkbox name="remember" value="yes" label="Remember connection" />
      <Switch name="automatic" value="yes" label="Automatic connection" />
      <Button type="submit" variant="primary">Save connection</Button>
    </form>
    <InfoBar title="Sample result">{result}</InfoBar>
    </>
  );
}`,
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
