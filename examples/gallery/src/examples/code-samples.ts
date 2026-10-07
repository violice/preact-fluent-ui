export const samples = {
  formStates: `import { Checkbox, Field, Input, Switch, Textarea } from '@violice/preact-fluent-ui/components';

export function FormStates() {
  return (
    <div>
      <Field label="Display name" hint="Component styles remain available with document and native styles disabled.">
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
  connectionForm: `import { useSignal } from '@preact/signals';
import { Button, Checkbox, Field, InfoBar, Input, Select, Switch } from '@violice/preact-fluent-ui/components';

export function ConnectionForm() {
  const port = useSignal('');
  const error = useSignal('');
  const result = useSignal('Save the sample connection to preview its values.');
  return (
    <>
    <form noValidate onSubmit={(event) => {
      event.preventDefault();
      const number = Number(port.value);
      if (!port.value.trim() || !Number.isInteger(number) || number < 1 || number > 65535) {
        error.value = 'Enter a whole port number from 1 to 65535.';
        result.value = '';
        return;
      }
      error.value = '';
      const data = new FormData(event.currentTarget);
      result.value = \`Saved: port \${port.value}, adapter \${data.get('adapter')}, remember \${data.has('remember') ? 'yes' : 'no'}, automatic \${data.has('automatic') ? 'yes' : 'no'}.\`;
    }}>
      <Field label="Port" hint="A whole number from 1 to 65535" required
        validationState={error.value ? 'error' : 'none'} validationMessage={error.value}>
        {(control) => <Input {...control} name="port" type="number" min={1} max={65535}
          value={port.value} onInput={(event) => { port.value = event.currentTarget.value; }} />}
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
    <InfoBar title="Sample result">{result.value}</InfoBar>
    </>
  );
}`,
  buttons: `import { Button, Icon } from '@violice/preact-fluent-ui/components';

<Button variant="primary" onClick={save}>Save</Button>
<Button size="compact">Compact</Button>
<Button size="icon" aria-label="Refresh">
  <Icon name="refresh" size={16} />
</Button>
<Button disabled>Unavailable</Button>`,
  notices: `import { InfoBar, StatusBadge } from '@violice/preact-fluent-ui/components';

<InfoBar tone="success" title="Saved">
  Your changes have been applied.
</InfoBar>
<StatusBadge tone="success">Connected</StatusBadge>`,
  forms: `import { useSignal } from '@preact/signals';
import { Button, Field, Select } from '@violice/preact-fluent-ui/components';

export function ConnectionForm() {
  const mode = useSignal('automatic');
  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      console.log(mode.value);
    }}>
      <Field label="Connection mode">
        {control => <Select {...control} value={mode.value}
          onChange={(event) => { mode.value = event.currentTarget.value; }}>
          <option value="automatic">Automatic</option>
          <option value="manual">Manual</option>
        </Select>}
      </Field>
      <Button type="submit" variant="primary">Save</Button>
    </form>
  );
}`,
  icons: `import { Icon } from '@violice/preact-fluent-ui/components';

// Icons are decorative. Put the accessible name on the control.
<Icon name="network" size={16} />
<Icon name="refresh" size={20} />
<Icon name="settings" size={24} />`,
  empty: `import { Button, EmptyState, Icon } from '@violice/preact-fluent-ui/components';

<EmptyState title="No connections yet">
  <p>Add a connection to start.</p>
  <Button onClick={addConnection}>
    <Icon name="add" />
    Add connection
  </Button>
</EmptyState>`,
  dialogs: `import { useRef } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { Button, ConfirmDialog } from '@violice/preact-fluent-ui/components';

export function ConfirmationExample() {
  const open = useSignal(false);
  const busy = useSignal(false);
  const error = useSignal('');
  const opener = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button ref={opener} onClick={() => { open.value = true; }}>Apply changes</Button>
      {open.value && (
        <ConfirmDialog
          title="Apply changes?"
          cancelLabel="Cancel"
          confirmLabel="Apply"
          pendingLabel="Applying..."
          busy={busy.value}
          fallbackFocusRef={opener}
          onClose={() => { open.value = false; }}
          onConfirm={async () => {
            busy.value = true;
            error.value = '';
            try {
              await new Promise((resolve) => setTimeout(resolve, 1000));
              open.value = false;
            } catch {
              error.value = 'Could not apply changes. Try again.';
            } finally {
              busy.value = false;
            }
          }}
        >
          <p>This example waits one second to simulate an operation.</p>
          {error.value && <p role="alert">{error.value}</p>}
        </ConfirmDialog>
      )}
    </>
  );
}`,
};
