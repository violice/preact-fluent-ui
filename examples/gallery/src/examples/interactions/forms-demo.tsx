import { DocSection } from '../../components/documentation/doc-section';
import { useSignal } from '@preact/signals';
import { Button, InfoBar, Select } from '../../../../../dist/components.js';
import { galleryStyles } from '../../styles/gallery.styles.ts';
import { CodeExample } from '../../components/code-block';
import { samples } from '../code-samples';
import { ConnectionForm, FormStates } from '../forms';

export function FormsDemo() {
  const choice = useSignal('automatic');
  const message = useSignal('');
  return (
    <>
      {' '}
      <div class={galleryStyles.sections}>
        <DocSection title="Connection form">
          <ConnectionForm />
          <CodeExample code={samples.connectionForm} />
        </DocSection>
        <DocSection title="Control states">
          <div data-gallery-preview class={galleryStyles.preview}>
            <FormStates />
          </div>
          <CodeExample code={samples.formStates} />
        </DocSection>
        <DocSection title="Native fields and Select">
          <div data-gallery-preview class={galleryStyles.preview}>
            <form
              class={galleryStyles.form}
              onSubmit={(event) => {
                event.preventDefault();
                message.value = `Saved ${choice.value}.`;
              }}
            >
              <label class={galleryStyles.label} for="connection-mode">
                Connection mode
                <Select
                  id="connection-mode"
                  name="mode"
                  value={choice.value}
                  onChange={(event) => (choice.value = event.currentTarget.value)}
                >
                  <option value="automatic">Automatic</option>
                  <option value="manual">
                    Manual configuration with a long descriptive option
                  </option>
                </Select>
              </label>
              <label class={galleryStyles.label} for="disabled-mode">
                Unavailable mode
                <Select id="disabled-mode" disabled>
                  <option>Unavailable</option>
                </Select>
              </label>
              <label class={galleryStyles.label} for="native-name">
                Profile name
                <input
                  class={galleryStyles.nativeField}
                  id="native-name"
                  name="profile"
                  placeholder="Sample profile"
                />
              </label>
              <label class={galleryStyles.label} for="native-notes">
                Notes
                <textarea
                  class={galleryStyles.nativeField}
                  id="native-notes"
                  name="notes"
                  rows={2}
                  placeholder="Optional notes"
                />
              </label>
              <label class={galleryStyles.label} for="native-region">
                Region
                <select class={galleryStyles.nativeField} id="native-region" name="region">
                  <option>Local</option>
                  <option>Remote</option>
                </select>
              </label>
              <Button type="submit" variant="primary">
                Save sample
              </Button>
            </form>
          </div>
          <InfoBar title="Sample result">{message.value}</InfoBar>
          <CodeExample code={samples.forms} />
        </DocSection>
      </div>
    </>
  );
}
