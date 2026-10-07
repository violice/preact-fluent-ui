import { CounterExample } from '../../../../examples/controls/counter-example';
import type { ComponentDoc } from '../../types';

export const counterBadgeDoc: ComponentDoc = {
  title: 'CounterBadge',
  slug: 'counter-badge',
  purpose: 'Show a numeric count in a compact badge beside a heading or label.',
  example: CounterExample,
  code: '<CounterBadge>{count}</CounterBadge>',
  props: [['children', 'ComponentChildren', 'Count supplied by the caller, including zero.']],
  accessibility:
    'Place the count beside its heading or label. CounterBadge adds no live region or focus behavior. Use native ARIA attributes when the surrounding context does not explain the count.',
  note: 'Height stays at 24px. Width starts at 24px and expands for longer numbers. Counts are not truncated or hidden automatically.',
};
