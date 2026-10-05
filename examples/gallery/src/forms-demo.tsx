import { useState } from 'preact/hooks';
import {
  Button,
  Checkbox,
  Field,
  InfoBar,
  Input,
  Select,
  Switch,
  Textarea,
} from '../../../dist/index.js';
import styles from './gallery.module.css';

export function ConnectionForm() {
  const [port, setPort] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState('Save the sample connection to preview its values.');
  return (
    <>
      <div class={styles.preview}>
        <form
          class={styles.form}
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            const number = Number(port);
            if (!port.trim() || !Number.isInteger(number) || number < 1 || number > 65535) {
              setError('Enter a whole port number from 1 to 65535.');
              setResult('');
              return;
            }
            setError('');
            const data = new FormData(event.currentTarget);
            setResult(
              `Saved: port ${port}, adapter ${data.get('adapter')}, remember ${data.has('remember') ? 'yes' : 'no'}, automatic ${data.has('automatic') ? 'yes' : 'no'}.`,
            );
          }}
        >
          <Field
            label="Port"
            hint="A whole number from 1 to 65535"
            required
            validationState={error ? 'error' : 'none'}
            validationMessage={error}
          >
            {(control) => (
              <Input
                {...control}
                name="port"
                type="number"
                min={1}
                max={65535}
                value={port}
                onInput={(event) => setPort(event.currentTarget.value)}
              />
            )}
          </Field>
          <Field label="Adapter">
            {(control) => (
              <Select {...control} name="adapter">
                <option value="auto">Automatic</option>
                <option value="ethernet">Ethernet</option>
              </Select>
            )}
          </Field>
          <Checkbox name="remember" value="yes" label="Remember connection" />
          <Switch name="automatic" value="yes" label="Automatic connection" />
          <Button type="submit" variant="primary">
            Save connection
          </Button>
        </form>
      </div>
      <InfoBar title="Sample result">{result}</InfoBar>
    </>
  );
}

export function FormStates() {
  return (
    <div class={styles.form}>
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
