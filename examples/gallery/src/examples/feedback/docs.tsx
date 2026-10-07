import type { ComponentDoc } from '../../routes/components/types';
import { DisclosureExample } from './disclosure-example';
import { SpinnerExample } from './spinner-example';
import { LoadingExample } from './loading-example';
import { TooltipExample } from './tooltip-example';

export const disclosureCode = `import { useSignal } from '@preact/signals';
import { Disclosure, DisclosureSummary, DisclosureContent } from '@violice/preact-fluent-ui/components';

export function ProposedFile({ proposedFile }: { proposedFile: string }) {
  const open = useSignal(true);
  return (
    <Disclosure appearance="card" open={open.value}
      onToggle={event => { open.value = event.currentTarget.open; }}>
      <DisclosureSummary>Proposed hosts file</DisclosureSummary>
      <DisclosureContent><pre>{proposedFile}</pre></DisclosureContent>
    </Disclosure>
  );
}`;

export const feedbackDocs: ComponentDoc[] = [
  ...(['Disclosure', 'DisclosureSummary', 'DisclosureContent'] as const).map(
    (title) =>
      ({
        title,
        slug: title.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
        purpose:
          title === 'Disclosure'
            ? 'Show optional details with native details and summary behavior.'
            : title === 'DisclosureSummary'
              ? 'Name the disclosure with its first summary child.'
              : 'Contain diagnostic text or file previews in a native div.',
        example: DisclosureExample,
        code: disclosureCode,
        props:
          title === 'Disclosure'
            ? [
                [
                  'appearance',
                  'default | card',
                  'Transparent by default; card adds a border and background.',
                ],
                [
                  'open / name / onToggle',
                  'native details props',
                  'Use currentTarget.open in onToggle. Native name groups related disclosures.',
                ],
              ]
            : [],
        accessibility:
          'Keep Summary first. The browser handles keyboard toggling and name grouping. Content does not impose file typography or scrolling.',
      }) satisfies ComponentDoc,
  ),
  {
    title: 'Spinner',
    slug: 'spinner',
    purpose: 'Indicate an indeterminate operation with an optional localized status label.',
    example: SpinnerExample,
    code: '<Spinner size="small" label="Checking connection" />\n<Spinner /> {/* Decorative when unlabeled. */}',
    props: [
      ['size', 'small | medium | large', '16, 24 or 32px; medium by default.'],
      ['label', 'string', 'Optional localized label. Without it the spinner is aria-hidden.'],
      ['classes', 'root, indicator, label', 'Style internal parts.'],
    ],
    accessibility:
      'A labeled Spinner is a status. Use an unlabeled spinner inside another status container. Reduced motion leaves a static incomplete ring.',
  },
  {
    title: 'LoadingState',
    slug: 'loading-state',
    purpose: 'Present initial or inline loading with one localized status announcement.',
    example: LoadingExample,
    code: '<LoadingState label="Loading profiles">Saved profiles will appear here.</LoadingState>\n<LoadingState appearance="inline" label="Refreshing profiles" />',
    props: [
      ['label', 'string, required', 'Localized operation text.'],
      [
        'appearance',
        'default | inline',
        'Centered card by default; inline uses a compact horizontal layout.',
      ],
      ['children', 'ComponentChildren', 'Optional description.'],
      ['classes', 'root, spinner, label, content', 'Style internal parts.'],
    ],
    accessibility:
      'One role=status container owns the announcement; the internal Spinner is decorative. The application owns loading state and decides whether to retain existing results.',
  },
  {
    title: 'Tooltip',
    slug: 'tooltip',
    purpose:
      'Describe a focused or hovered trigger without changing its layout or accessible name.',
    example: TooltipExample,
    code: `<Tooltip content="Refresh connection" placement="top"
  triggerProps={{ ref: buttonRef, onClick: refresh, 'aria-describedby': 'existing-hint' }}>
  {props => <Button {...props} size="icon" aria-label="Refresh connection"><Icon name="refresh" size={16} /></Button>}
</Tooltip>`,
    props: [
      ['content', 'string, required', 'Localized, noninteractive description.'],
      [
        'placement',
        'top | bottom | left | right',
        'Top by default. Flips and shifts within the viewport.',
      ],
      [
        'children',
        '(props: TooltipTriggerProps) => VNode',
        'Spread all supplied props onto one trigger.',
      ],
      [
        'triggerProps',
        'HTMLAttributes<HTMLElement>',
        'Put caller refs, handlers and existing description IDs here for composition.',
      ],
      ['classes', 'root, content', 'Style portal parts.'],
    ],
    accessibility:
      'Hover opens after 500ms; keyboard focus opens immediately. Escape dismisses until the next interaction. Keep an explicit aria-label on icon buttons. Native disabled buttons cannot receive keyboard focus; Tooltip adds no focusable wrapper. Portals inherit local theme and direction and remain visible in scrolling tables and Modal.',
  },
];
