import { useSignal } from '@preact/signals';
import {
  Button,
  Checkbox,
  Field,
  InfoBar,
  Input,
  Select,
  Switch,
} from '../../../../../dist/components.js';
import { galleryStyles } from '../../styles/gallery.styles.ts';

export function ConnectionForm() {
  const port = useSignal('');
  const error = useSignal('');
  const result = useSignal('Save the sample connection to preview its values.');
  return (
    <>
      <div data-gallery-preview class={galleryStyles.preview}>
        <form
          class={galleryStyles.form}
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            const number = Number(port.value);
            if (!port.value.trim() || !Number.isInteger(number) || number < 1 || number > 65535) {
              error.value = 'Enter a whole port number from 1 to 65535.';
              result.value = '';
              return;
            }
            error.value = '';
            const data = new FormData(event.currentTarget);
            result.value = `Saved: port ${port.value}, adapter ${data.get('adapter')}, remember ${data.has('remember') ? 'yes' : 'no'}, automatic ${data.has('automatic') ? 'yes' : 'no'}.`;
          }}
        >
          <Field
            label="Port"
            hint="A whole number from 1 to 65535"
            required
            validationState={error.value ? 'error' : 'none'}
            validationMessage={error.value}
          >
            {(control) => (
              <Input
                {...control}
                name="port"
                type="number"
                min={1}
                max={65535}
                value={port.value}
                onInput={(event) => (port.value = event.currentTarget.value)}
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
      <InfoBar title="Sample result">{result.value}</InfoBar>
    </>
  );
}
