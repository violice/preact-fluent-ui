import { SelectExample } from '../../../../examples/controls/select-example';
import type { ComponentDoc } from '../../types';

export const selectDoc: ComponentDoc = {
  title: 'Select',
  slug: 'select',
  purpose: 'Choose an option using the native select control.',
  example: SelectExample,
  code: `<Field label="Connection mode">
  {control => <Select {...control} value={mode} onChange={event => setMode(event.currentTarget.value)}>
    <option value="automatic">Automatic</option>
    <option value="manual">Manual configuration</option>
  </Select>}
</Field>`,
  props: [
    ['classes', 'root, wrapper, icon', 'Style the select, outer span and decorative chevron.'],
  ],
  accessibility:
    'Associate a label using Field or a wrapping label. Native keyboard selection and form submission remain available.',
};
