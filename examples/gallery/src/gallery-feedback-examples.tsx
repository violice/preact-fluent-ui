import { useRef, useState } from 'preact/hooks';
import {
  Button,
  Disclosure,
  DisclosureSummary,
  DisclosureContent,
  Spinner,
  LoadingState,
  Tooltip,
  Icon,
  InfoBar,
  TableContainer,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  Modal,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from '../../../dist/components.js';
import type { ComponentDoc } from './gallery-pages';
import { ButtonsDemo } from './gallery-demos';
import styles from './gallery.module.css';

function DisclosureExample() {
  const [opened, setOpened] = useState(false);
  return (
    <div class={styles.stack} style={{ width: '100%' }}>
      <InfoBar tone="error" title="Connection failed">
        <Disclosure onToggle={(event) => setOpened(event.currentTarget.open)}>
          <DisclosureSummary>Error details</DisclosureSummary>
          <DisclosureContent>
            <pre class={styles.longText}>
              The remote endpoint refused the connection. Retry after checking the address.
            </pre>
          </DisclosureContent>
        </Disclosure>
      </InfoBar>
      <p>Details {opened ? 'open' : 'closed'}.</p>
      <Disclosure appearance="card">
        <DisclosureSummary>Current hosts file</DisclosureSummary>
        <DisclosureContent>
          <pre>127.0.0.1 localhost</pre>
        </DisclosureContent>
      </Disclosure>
      <Disclosure appearance="card" open>
        <DisclosureSummary>Proposed hosts file</DisclosureSummary>
        <DisclosureContent>
          <pre>127.0.0.1 localhost{'\n'}192.168.1.20 office</pre>
        </DisclosureContent>
      </Disclosure>
    </div>
  );
}
export function BusyButtonsExample() {
  const [busy, setBusy] = useState(false);
  const [complete, setComplete] = useState(false);
  return (
    <div class={styles.stack}>
      <ButtonsDemo />
      <div class={styles.row}>
        <Button
          loading={busy}
          loadingLabel="Refreshing profiles"
          onClick={() => {
            setBusy(true);
            setComplete(false);
          }}
        >
          Refresh profiles
        </Button>
        {busy && (
          <Button
            onClick={() => {
              setBusy(false);
              setComplete(true);
            }}
          >
            Complete refresh
          </Button>
        )}
      </div>
      {busy && <LoadingState appearance="inline" label="Reading profiles" />}
      {complete && <p role="status">Profiles refreshed.</p>}
      <div class={styles.row}>
        {(['default', 'primary', 'subtle', 'danger'] as const).map((variant) => (
          <Button key={variant} variant={variant} loading>
            {variant} action
          </Button>
        ))}
        <Button size="compact" loading loadingLabel="Applying">
          Apply configuration
        </Button>
        <Button size="icon" loading aria-label="Refresh connection">
          <Icon name="refresh" size={16} />
        </Button>
        <Button disabled loading>
          Unavailable action
        </Button>
      </div>
    </div>
  );
}
function SpinnerExample() {
  return (
    <div class={styles.row}>
      <Spinner size="small" label="Checking connection" />
      <Spinner size="medium" label="Reading profiles" />
      <Spinner size="large" label="Loading backups" />
    </div>
  );
}
function LoadingExample() {
  return (
    <div class={styles.stack} style={{ width: '100%' }}>
      <LoadingState label="Loading connection profiles">
        Saved profiles will appear when loading finishes.
      </LoadingState>
      <LoadingState appearance="inline" label="Refreshing profiles">
        Existing results remain available.
      </LoadingState>
    </div>
  );
}
function TooltipExample() {
  const [open, setOpen] = useState(false);
  const initialFocus = useRef<HTMLButtonElement>(null);
  return (
    <div class={styles.stack} style={{ width: '100%' }}>
      <TableContainer tabIndex={0} role="region" aria-label="Scrollable tooltip examples">
        <Table style={{ minWidth: '520px' }} aria-label="Connection actions">
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Profile</TableHeaderCell>
              <TableHeaderCell>Address</TableHeaderCell>
              <TableHeaderCell>Action</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {['Office', 'Home', 'Travel'].map((name) => (
              <TableRow key={name}>
                <TableHeaderCell scope="row">{name}</TableHeaderCell>
                <TableCell>192.168.1.20</TableCell>
                <TableCell>
                  <Tooltip content={`Refresh ${name} connection`}>
                    {(props) => (
                      <Button {...props} size="icon" aria-label={`Refresh ${name} connection`}>
                        <Icon name="refresh" size={16} />
                      </Button>
                    )}
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div
        data-theme="dark"
        style={{
          '--pfui-colors-surface': '#232428',
          '--pfui-colors-surface-raised': '#34353b',
          '--pfui-colors-text': '#f3f4f6',
          '--pfui-colors-surface-muted': '#292a2f',
          '--pfui-colors-surface-hover': '#35373e',
          '--pfui-colors-surface-pressed': '#2d2f35',
          '--pfui-colors-border': '#3b3d44',
          '--pfui-colors-border-strong': '#626670',
          '--pfui-colors-control': '#37393f',
          '--pfui-colors-control-hover': '#40434b',
          '--pfui-colors-control-pressed': '#303238',
          '--pfui-colors-control-border': '#484b54',
          '--pfui-colors-control-bottom': '#656975',
          '--pfui-colors-focus': '#dceaff',
          '--pfui-colors-disabled': '#8e939e',
          '--pfui-shadows-control':
            'inset 0 1px 0 rgb(255 255 255 / 3%), 0 1px 2px rgb(0 0 0 / 10%)',
          colorScheme: 'dark',
          padding: '16px',
          background: 'var(--pfui-colors-surface)',
          color: 'var(--pfui-colors-text)',
        }}
      >
        <Tooltip content="This tooltip inherits the local dark theme" placement="right">
          {(props) => <Button {...props}>Local theme hint</Button>}
        </Tooltip>
      </div>
      <Button onClick={() => setOpen(true)}>Open tooltip dialog</Button>
      {open && (
        <Modal
          labelledBy="tooltip-dialog-title"
          initialFocusRef={initialFocus}
          onClose={() => setOpen(false)}
        >
          <DialogHeader id="tooltip-dialog-title" title="Connection actions" />
          <DialogBody>
            <Tooltip
              content="Refresh this connection without leaving the dialog"
              triggerProps={{ ref: initialFocus }}
            >
              {(props) => (
                <Button {...props} size="icon" aria-label="Refresh dialog connection">
                  <Icon name="refresh" size={16} />
                </Button>
              )}
            </Tooltip>
          </DialogBody>
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Close dialog</Button>
          </DialogFooter>
        </Modal>
      )}
    </div>
  );
}
const disclosureCode = `<Disclosure appearance="card" open onToggle={event => setOpen(event.currentTarget.open)}>
  <DisclosureSummary>Proposed hosts file</DisclosureSummary>
  <DisclosureContent><pre>{proposedFile}</pre></DisclosureContent>
</Disclosure>`;
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
