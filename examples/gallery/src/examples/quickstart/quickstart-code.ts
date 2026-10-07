export const quickstartCode = `import { useSignal } from '@preact/signals';
import {
  Button, Field, InfoBar, Input, Select, Switch,
} from '@violice/preact-fluent-ui/components';

export function ProfileForm() {
  const result = useSignal('Save the sample profile to preview its values.');

  return (
    <div>
      <form onSubmit={event => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const profile = data.get('profile');
        const connection = data.get('connection');
        const automatic = data.has('automatic') ? 'yes' : 'no';
        (result.value = \`Saved \${profile} with \${connection} connection, automatic \${automatic}.\`);
      }}>
        <Field label="Profile name" required>
          {control => <Input {...control} name="profile" defaultValue="Office connection" />}
        </Field>
        <Field label="Connection type">
          {control => (
            <Select {...control} name="connection">
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
            </Select>
          )}
        </Field>
        <Switch name="automatic" label="Connect automatically" defaultChecked />
        <Button type="submit" variant="primary">Save profile</Button>
      </form>
      <InfoBar title="Sample result">{result.value}</InfoBar>
    </div>
  );
}`;
