import { Field, Input } from '../../../../../dist/components.js';
import { galleryStyles } from '../../styles/gallery.styles.ts';

export function InputExample() {
  return (
    <div class={galleryStyles.form}>
      <Field label="Profile name">
        {(control) => <Input {...control} placeholder="Office connection" />}
      </Field>
      <Field label="Read-only profile">
        {(control) => <Input {...control} readOnly value="Managed connection" />}
      </Field>
      <Field label="Unavailable profile">
        {(control) => <Input {...control} disabled value="Unavailable" />}
      </Field>
    </div>
  );
}
