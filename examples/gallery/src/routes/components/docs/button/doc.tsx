import { BusyButtonsExample } from '../../../../examples/feedback';
import { samples } from '../../../../examples/code-samples';
import type { ComponentDoc } from '../../types';

export const buttonDoc: ComponentDoc = {
  title: 'Button',
  slug: 'button',
  purpose: 'Run an action with a native button, sized for text or icons.',
  example: BusyButtonsExample,
  code:
    samples.buttons +
    `\n\n<Button loading={refreshing} loadingLabel="Refreshing profiles" onClick={refresh}>Refresh profiles</Button>\n{refreshing && <LoadingState appearance="inline" label="Reading profiles" />}`,
  props: [
    ['variant', 'default | primary | subtle | danger', 'Visual emphasis; default is default.'],
    ['size', 'default | compact | icon', 'Control size; default is default.'],
    [
      'loading / loadingLabel',
      'boolean / string',
      'Suppress activation and retain focus. Optional localized replacement label. Explicit disabled still uses native disabled.',
    ],
  ],
  accessibility:
    'Use clear action text. Icon-only buttons need aria-label. Set type="submit" explicitly inside forms; the default is button. Loading sets aria-busy and aria-disabled without native disabled. Announce an operation with one application status or LoadingState rather than a live region per button.',
};
