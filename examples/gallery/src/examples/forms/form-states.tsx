import { Checkbox, Field, Input, Switch, Textarea } from '../../../../../dist/components.js';
import { galleryStyles } from '../../styles/gallery.styles.ts';

export function FormStates() {
  return (
    <div class={galleryStyles.form}>
      <Field
        label="Display name"
        hint="Component styles remain available with document and native styles disabled."
      >
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
