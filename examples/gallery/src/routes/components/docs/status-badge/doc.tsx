import { BadgeExample } from '../../../../examples/controls/badge-example';
import type { ComponentDoc } from '../../types';

export const statusBadgeDoc: ComponentDoc = {
  title: 'StatusBadge',
  slug: 'status-badge',
  purpose: 'Show a compact text status alongside related content.',
  example: BadgeExample,
  code: '<StatusBadge tone="success">Connected</StatusBadge>',
  props: [['tone', 'neutral | success | warning | error', 'Default neutral.']],
  accessibility:
    'Include status text; color alone must not communicate the state. Use a separate live region when changes need announcements.',
};
