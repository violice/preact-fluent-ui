import { Field, Input } from '../../../../../dist/components.js';

export function FieldExample() {
  return (
    <Field
      label="Port"
      hint="A whole number from 1 to 65535"
      required
      validationState="error"
      validationMessage="Enter a valid port."
    >
      {(control) => <Input {...control} type="number" />}
    </Field>
  );
}
