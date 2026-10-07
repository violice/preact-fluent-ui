import { samples } from '../../../../examples/code-samples';
import { EmptyExample } from '../../../../examples/controls/empty-example';
import type { ComponentDoc } from '../../types';

export const emptyStateDoc: ComponentDoc = {
  title: 'EmptyState',
  slug: 'empty-state',
  purpose: 'Explain an empty collection and offer a next action.',
  example: EmptyExample,
  code: samples.empty,
  props: [
    ['title', 'string, required', 'Heading rendered as h2.'],
    ['icon', 'IconName', 'Decorative icon, routes by default.'],
    ['classes', 'root, icon, title, content', 'Add classes to the empty-state parts.'],
  ],
  accessibility:
    'The default role is status. Provide useful text and a named action rather than relying on the icon.',
};
