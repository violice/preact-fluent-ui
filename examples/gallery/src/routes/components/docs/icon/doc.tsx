import { samples } from '../../../../examples/code-samples';
import { IconsDemo } from '../../../../examples/interactions';
import type { ComponentDoc } from '../../types';

export const iconDoc: ComponentDoc = {
  title: 'Icon',
  slug: 'icon',
  purpose: 'Display a decorative Fluent icon at one of three supported sizes.',
  example: IconsDemo,
  code: samples.icons,
  props: [
    ['name', 'IconName, required', 'Name from the exported icon set.'],
    ['size', '16 | 20 | 24', 'Default 20.'],
  ],
  accessibility:
    'Icons are aria-hidden and not focusable. Put the accessible name on the surrounding button or visible text.',
};
