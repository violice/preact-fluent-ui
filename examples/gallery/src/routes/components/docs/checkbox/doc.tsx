import { CheckboxExample } from '../../../../examples/controls/checkbox-example';
import type { ComponentDoc } from '../../types';

export const checkboxDoc: ComponentDoc = {
  title: 'Checkbox',
  slug: 'checkbox',
  purpose: 'Toggle independent choices, including a mixed selection.',
  example: CheckboxExample,
  code: '<Checkbox name="remember" label="Remember connection" />\n<Checkbox label="Mixed selection" indeterminate />',
  props: [
    ['label', 'ComponentChildren, required', 'Visible label.'],
    ['indeterminate', 'boolean', 'Sets the native mixed state; default false.'],
    ['classes', 'root, wrapper, label, indicator', 'Add classes to checkbox parts.'],
  ],
  accessibility:
    'Uses a native checkbox and associated label. Space toggles it. Indeterminate communicates a partial selection and does not set checked.',
};
