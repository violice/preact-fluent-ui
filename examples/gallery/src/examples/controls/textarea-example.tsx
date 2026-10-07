import { Field, Textarea } from '../../../../../dist/components.js';

export function TextareaExample() {
  return (
    <Field label="Connection notes" hint="Resize vertically for longer notes.">
      {(control) => <Textarea {...control} rows={3} placeholder="Optional notes" />}
    </Field>
  );
}
