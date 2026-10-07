import { SwitchExample } from '../../../../examples/controls/switch-example';
import type { ComponentDoc } from '../../types';

export const switchDoc: ComponentDoc = {
  title: 'Switch',
  slug: 'switch',
  purpose: 'Toggle a named on/off setting.',
  example: SwitchExample,
  code: '<Switch name="automatic" label="Automatic connection" defaultChecked />',
  props: [
    ['label', 'ComponentChildren, required', 'Visible setting label.'],
    ['classes', 'root, wrapper, label, track, thumb', 'Add classes to switch parts.'],
  ],
  accessibility:
    'Uses a native checkbox with role switch. Space changes state. Keep the label stable when the switch changes.',
};
