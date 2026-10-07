import { FieldExample } from '../../../../examples/controls/field-example';
import type { ComponentDoc } from '../../types';

export const fieldDoc: ComponentDoc = {
  title: 'Field',
  slug: 'field',
  purpose: 'Connect a control with its label, hint and validation message.',
  example: FieldExample,
  code: '<Field label="Port" required hint="1 to 65535" validationState="error" validationMessage="Enter a valid port.">\n  {control => <Input {...control} type="number" />}\n</Field>',
  props: [
    ['label', 'ComponentChildren, required', 'Visible control label.'],
    [
      'children',
      '(control: FieldControlProps) => ComponentChildren, required',
      'Render the control and spread supplied accessibility props.',
    ],
    ['controlId', 'string', 'Explicit control ID; generated otherwise.'],
    [
      'hint / validationMessage',
      'ComponentChildren',
      'Descriptions connected with aria-describedby.',
    ],
    [
      'validationState',
      'none | error | warning | success',
      'Default none. Error sets aria-invalid.',
    ],
    ['required', 'boolean', 'Sets required on the child control.'],
    ['classes', 'root, label, hint, validation', 'Add classes to field parts.'],
  ],
  accessibility:
    'Spread all control props onto one labelable input. Validate in your form handler; Field presents the validation result.',
};
