import { InputExample } from '../../../../examples/controls/input-example';
import type { ComponentDoc } from '../../types';

export const inputDoc: ComponentDoc = {
  title: 'Input',
  slug: 'input',
  purpose: 'Enter a single-line value using a styled native input.',
  example: InputExample,
  code: '<Field label="Profile name">{control => <Input {...control} placeholder="Office connection" />}</Field>',
  props: [
    [
      'type',
      'text | search | email | url | tel | password | number',
      'Default text. Native value, disabled, readOnly and event props remain available.',
    ],
  ],
  accessibility:
    'Always provide a label. Spread Field control props to connect descriptions, errors and required state.',
};
