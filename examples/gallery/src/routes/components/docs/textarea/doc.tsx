import { TextareaExample } from '../../../../examples/controls/textarea-example';
import type { ComponentDoc } from '../../types';

export const textareaDoc: ComponentDoc = {
  title: 'Textarea',
  slug: 'textarea',
  purpose: 'Edit multiline text in a native textarea.',
  example: TextareaExample,
  code: '<Field label="Notes">{control => <Textarea {...control} rows={3} />}</Field>',
  props: [],
  accessibility:
    'Provide a label and enough rows for the content. Native disabled, readOnly, value and input events are supported.',
};
