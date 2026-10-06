import { css } from '../../../dist/styling.js';
import { Changelog } from './gallery-changelog';
import { feedbackDocs, BusyButtonsExample } from './gallery-feedback-examples';
import { utilityPages } from './gallery-utils';
import { dataDocs } from './gallery-data-examples';
import { appShellDocs } from './gallery-app-shell-examples';
import { sidebarExamples, sidebarCodes } from './gallery-sidebar-examples';
import {
  About,
  GettingStarted,
  FormsGuide,
  ThemingGuide,
  SignalsGuide,
  StylingGuide,
} from './gallery-guides';
import type { ComponentType } from 'preact';
import { useState } from 'preact/hooks';
import {
  Table,
  TableContainer,
  TableHeader,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  Button,
  Card,
  Checkbox,
  DialogBody,
  DialogFooter,
  DialogHeader,
  EmptyState,
  Field,
  Icon,
  InfoBar,
  Input,
  PageHeader,
  Select,
  StatusBadge,
  CounterBadge,
  Text,
  Switch,
  Textarea,
  TextPreview,
  CodeBlock as PlainCodeBlock,
} from '../../../dist/index.js';
import type { TextColor, TextPreset } from '../../../dist/index.js';
import { CodeExample } from './code-block';
import { samples } from './code-samples';
import { DialogsDemo, IconsDemo } from './gallery-demos';
import { useGalleryHref } from './gallery-context';
import styles from './gallery.module.css';

type Prop = [name: string, type: string, description: string];
export type ComponentDoc = {
  title: string;
  slug: string;
  purpose: string;
  example: ComponentType;
  code: string;
  props: Prop[];
  accessibility: string;
  note?: string;
  members?: ComponentDoc[];
};
const native: Prop = [
  'Native HTML props and ref',
  'See the component props type',
  'Forwarded to the underlying element. class is additive and takes priority over className.',
];
function SelectExample() {
  const [mode, setMode] = useState('automatic');
  return (
    <label class={styles.label}>
      Connection mode
      <Select value={mode} onChange={(e) => setMode(e.currentTarget.value)}>
        <option value="automatic">Automatic</option>
        <option value="manual">Manual configuration with a long descriptive option</option>
      </Select>
    </label>
  );
}
function InputExample() {
  return (
    <div class={styles.form}>
      <Field label="Profile name">
        {(control) => <Input {...control} placeholder="Office connection" />}
      </Field>
      <Field label="Read-only profile">
        {(control) => <Input {...control} readOnly value="Managed connection" />}
      </Field>
      <Field label="Unavailable profile">
        {(control) => <Input {...control} disabled value="Unavailable" />}
      </Field>
    </div>
  );
}
function TextareaExample() {
  return (
    <Field label="Connection notes" hint="Resize vertically for longer notes.">
      {(control) => <Textarea {...control} rows={3} placeholder="Optional notes" />}
    </Field>
  );
}
function FieldExample() {
  return (
    <Field
      label="Port"
      hint="A whole number from 1 to 65535"
      required
      validationState="error"
      validationMessage="Enter a valid port."
    >
      {(control) => <Input {...control} type="number" />}
    </Field>
  );
}
function CheckboxExample() {
  return (
    <div class={styles.stack}>
      <Checkbox label="Remember connection" />
      <Checkbox label="Mixed selection" indeterminate />
      <Checkbox label="Unavailable selection" disabled defaultChecked />
      <Checkbox label="A long checkbox label wraps across lines inside a narrow window." />
    </div>
  );
}
function SwitchExample() {
  return (
    <div class={styles.stack}>
      <Switch label="Automatic connection" />
      <Switch label="Enabled connection" defaultChecked />
      <Switch label="Unavailable connection" disabled />
    </div>
  );
}
function InfoBarExample() {
  return (
    <div class={styles.stack}>
      {(['info', 'success', 'warning', 'error'] as const).map((tone) => (
        <InfoBar tone={tone} title={tone} key={tone}>
          A long message remains readable in a narrow window.
          example-of-a-long-unbroken-message-that-needs-to-wrap-without-moving-the-page-sideways.
        </InfoBar>
      ))}
    </div>
  );
}
const textPresets: TextPreset[] = [
  'caption2',
  'caption1',
  'body1',
  'subtitle2',
  'subtitle1',
  'title3',
  'title2',
  'title1',
  'largeTitle',
  'display',
];
function TextExample() {
  return (
    <div class={styles.stack}>
      {textPresets.map((preset) => (
        <Text key={preset} preset={preset} render={<p />} data-preset={preset}>
          {preset}
        </Text>
      ))}
      <Text preset="subtitle2" render={<h2 />}>
        Semantic heading
      </Text>
      <Text render={(props, state) => <p {...props} data-current-preset={state.preset} />}>
        A paragraph composed through a render callback.
      </Text>
      <Text>Default inline text</Text>
      <div style={{ color: 'var(--color-text-muted)' }}>
        {(['inherit', 'default', 'muted', 'subtle'] satisfies TextColor[]).map((color) => (
          <Text key={color} color={color} render={<p />} data-color={color}>
            {color}
          </Text>
        ))}
      </div>
    </div>
  );
}
function StylingExample() {
  const [width, setWidth] = useState(220);
  return (
    <div class={css({ display: 'grid', gap: '4', minWidth: 0 })}>
      <label>
        Width{' '}
        <input
          type="range"
          min="120"
          max="360"
          value={width}
          onInput={(event) => setWidth(Number(event.currentTarget.value))}
        />
      </label>
      <section
        aria-label="Dynamic styles"
        {...css.dynamic({
          width,
          padding: '4',
          backgroundColor: 'surface',
          color: 'text',
          '&:hover': { backgroundColor: 'var(--color-surface-hover)' },
          '@media (max-width: 600px)': { maxWidth: '100%' },
        })}
      >
        <Text>Local width variable: {width}px</Text>
      </section>
    </div>
  );
}
function CounterExample() {
  return (
    <div class={styles.row}>
      {[0, 1, 12, 123, 123456].map((count) => (
        <CounterBadge key={count}>{count}</CounterBadge>
      ))}
    </div>
  );
}
function BadgeExample() {
  return (
    <div class={styles.row}>
      {(['neutral', 'success', 'warning', 'error'] as const).map((tone) => (
        <StatusBadge tone={tone} key={tone}>
          {tone}
        </StatusBadge>
      ))}
      <StatusBadge>
        Waiting for a very long status description to finish across several lines
      </StatusBadge>
    </div>
  );
}
function EmptyExample() {
  const [added, setAdded] = useState(false);
  return (
    <EmptyState title={added ? 'Connection added' : 'No connections yet'}>
      <p>Add a sample connection to start. Longer descriptions fit inside the available space.</p>
      <Button onClick={() => setAdded(true)}>
        <Icon name="add" />
        Add connection
      </Button>
    </EmptyState>
  );
}
const docs: ComponentDoc[] = [
  ...dataDocs,
  ...feedbackDocs,
  ...appShellDocs,
  {
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
  },
  {
    title: 'Card',
    slug: 'card',
    purpose: 'Group related content in a section, with optional padding for edge-to-edge data.',
    example: () => (
      <div class={styles.stack}>
        <Card aria-labelledby="card-example-title" data-padding="regular">
          <Text preset="subtitle2" render={<h2 />} id="card-example-title">
            Connection details
          </Text>
          <p>Office network configuration.</p>
        </Card>
        <Card padding="none" aria-label="Saved routes" data-padding="none">
          <TableContainer>
            <Table dividers="between" aria-label="Routes without outer padding">
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Prefix</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>203.0.113.10/32</TableCell>
                  <TableCell>Through VPN</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>192.168.50.0/24</TableCell>
                  <TableCell>Through VPN</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </div>
    ),
    code: '<Card aria-labelledby="details"><Text preset="subtitle2" render={<h2 />} id="details">Connection details</Text><Text render={<p />}>Office network configuration.</Text></Card>\n\n<Card padding="none">\n  <TableContainer>\n    <Table dividers="between">{/* header and rows */}</Table>\n  </TableContainer>\n</Card>',
    props: [
      [
        'padding',
        'regular | none',
        'Default regular. none removes outer padding and passes corner radii to the first and last child.',
      ],
    ],
    note: 'Use padding="none" with TableContainer for data that meets the card edge. Cell padding remains inside the table; the scroll container follows the card corners.',
    accessibility:
      'Give meaningful sections a heading and aria-labelledby. Card does not add a heading or interactive behavior.',
  },
  {
    title: 'InfoBar',
    slug: 'info-bar',
    purpose: 'Communicate a result or warning with a title and message.',
    example: InfoBarExample,
    code: samples.notices.split('<StatusBadge')[0],
    props: [
      [
        'tone',
        'info | success | warning | error',
        'Default info. Error uses role alert; other tones use status.',
      ],
      ['title', 'string', 'Optional heading above the content.'],
      ['classes', 'root, title, content', 'Add classes to individual parts.'],
    ],
    accessibility:
      'Keep messages concise. Error messages use alert announcements; use the native role prop to adjust announcements when appropriate.',
  },
  {
    title: 'Text',
    slug: 'text',
    purpose: 'Apply Fluent 2 typography independently of the semantic HTML element.',
    example: TextExample,
    code: '<Text preset="subtitle2" render={<h2 />}>Saved routes</Text>\n<Text color="muted" render={<p />}>Profile details</Text>\n<Text>Inline text</Text>',
    props: [
      [
        'preset',
        textPresets.join(' | '),
        'Default body1. Accepts a signal; selects size, line height and weight.',
      ],
      [
        'color',
        'inherit | default | muted | subtle',
        'Default inherit leaves the surrounding color unchanged. Other values use theme text tokens. Accepts a signal.',
      ],
      [
        'render',
        'VNode | (props: TextRenderProps, state: TextRenderState) => VNode',
        'Default span. Composes a native root without a wrapper; callbacks must forward props and ref.',
      ],
    ],
    accessibility:
      'Choose h1–h6 for headings and p for paragraphs. Visual presets do not imply heading semantics. Text adds no tab stop or live region.',
    note: 'The optional reset.css clears native h1–h6 and p margins and typography. Text preserves native block or inline display and uses the theme body font.',
  },
  {
    title: 'Styling engine',
    slug: 'styling-engine',
    purpose: 'Compile typed CSS objects and dynamic local variables without a layout wrapper.',
    example: StylingExample,
    code: 'const layout = css({ display: "flex", gap: "4" });\n<section class={layout}>...</section>\n\n<div {...css.dynamic({ width: measuredWidth })} />',
    props: [
      ['css(styles)', 'string', 'Static styles become atomic classes.'],
      ['css.dynamic(styles)', '{ class, style }', 'Dynamic leaves become local CSS variables.'],
      [
        'cva / sva',
        'Recipe functions',
        'Variants and compound variants for single or multiple slots.',
      ],
    ],
    accessibility:
      'Use native semantic elements and existing components; styling adds no role or focus behavior.',
    note: 'Requires fluentStyles() in Vite for your own style definitions. Built-in library components use precompiled CSS.',
  },
  {
    title: 'CounterBadge',
    slug: 'counter-badge',
    purpose: 'Show a numeric count in a compact badge beside a heading or label.',
    example: CounterExample,
    code: '<CounterBadge>{count}</CounterBadge>',
    props: [['children', 'ComponentChildren', 'Count supplied by the caller, including zero.']],
    accessibility:
      'Place the count beside its heading or label. CounterBadge adds no live region or focus behavior. Use native ARIA attributes when the surrounding context does not explain the count.',
    note: 'Height stays at 24px. Width starts at 24px and expands for longer numbers. Counts are not truncated or hidden automatically.',
  },
  {
    title: 'StatusBadge',
    slug: 'status-badge',
    purpose: 'Show a compact text status alongside related content.',
    example: BadgeExample,
    code: '<StatusBadge tone="success">Connected</StatusBadge>',
    props: [['tone', 'neutral | success | warning | error', 'Default neutral.']],
    accessibility:
      'Include status text; color alone must not communicate the state. Use a separate live region when changes need announcements.',
  },
  {
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
  },
  {
    title: 'PageHeader',
    slug: 'page-header',
    purpose: 'Introduce a page with its title, description, actions and notices.',
    example: () => (
      <PageHeader
        title="PageHeader"
        description="Manage local connections."
        ref={(header: HTMLElement | null) =>
          header?.querySelector('h1')?.setAttribute('tabindex', '-1')
        }
        actions={<Button>Add connection</Button>}
      />
    ),
    code: `<PageHeader
  title="Connection workspace"
  description="Manage local connections."
  actions={<Button>Add connection</Button>}
/>`,
    props: [
      ['title', 'string, required', 'Page heading rendered as h1.'],
      ['description', 'string, required', 'Supporting text.'],
      ['actions / notices', 'ComponentChildren', 'Optional actions and notices.'],
      [
        'classes',
        'root, content, title, description, actions, notices',
        'Add classes to the header parts.',
      ],
    ],
    accessibility:
      'PageHeader renders h1. This documentation page uses the demonstration as its sole h1. Use a descriptive title and meaningful action labels.',
  },
  {
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
  },
  {
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
  },
  {
    title: 'Modal',
    slug: 'modal',
    purpose: 'Show a controlled dialog with focus containment and restoration.',
    example: () => <DialogsDemo />,
    code: `<Modal labelledBy="dialog-title" initialFocusRef={closeButton} fallbackFocusRef={opener} onClose={close}>
  <DialogHeader id="dialog-title" title="Connection details" />
  <DialogBody>Connection settings</DialogBody>
  <DialogFooter><Button ref={closeButton} onClick={close}>Close</Button></DialogFooter>
</Modal>`,
    props: [
      ['labelledBy', 'string, required', 'ID of the dialog heading.'],
      ['initialFocusRef', 'RefObject<HTMLElement>, required', 'First preferred focus target.'],
      ['fallbackFocusRef', 'RefObject<HTMLElement>', 'Focus target if the opener is removed.'],
      ['onClose', '() => void, required', 'Called by Escape or backdrop selection.'],
      ['children', 'ComponentChildren, required', 'Dialog contents.'],
      ['classes', 'root, backdrop', 'Add classes to modal parts.'],
    ],
    accessibility:
      'Mount only while open. The modal marks the background inert, traps focus, supports Escape and restores focus. Always supply a heading and a visible close action.',
  },
  {
    title: 'ConfirmDialog',
    slug: 'confirm-dialog',
    purpose: 'Confirm a pending or destructive action with safe initial focus.',
    example: () => <DialogsDemo confirmation />,
    code: samples.dialogs,
    props: [
      [
        'title / cancelLabel / confirmLabel / pendingLabel',
        'string, required',
        'Dialog title and explicit action labels.',
      ],
      [
        'busy / confirmDisabled / danger',
        'boolean',
        'Default false. Busy disables both actions and close requests.',
      ],
      [
        'onClose / onConfirm',
        '() => void, required',
        'Controlled cancellation and confirmation handlers.',
      ],
      ['fallbackFocusRef', 'RefObject<HTMLElement>', 'Alternative restoration target.'],
      ['children', 'ComponentChildren, required', 'Explanation of the operation.'],
      [
        'classes',
        'root, backdrop, header, title, body, footer, cancelButton, confirmButton',
        'Add classes to dialog parts.',
      ],
    ],
    accessibility:
      'Initial focus goes to Cancel. Explain destructive results and provide a pending label while busy. Finish or report asynchronous operations in the controlling component.',
  },
  {
    title: 'DialogHeader',
    slug: 'dialog-header',
    purpose: 'Name a dialog with a heading and optional description.',
    example: () => (
      <DialogHeader
        id="header-example"
        title="Connection details"
        description="Review the configuration."
      />
    ),
    code: '<DialogHeader id="dialog-title" title="Connection details" description="Review the configuration." />',
    props: [
      ['id', 'string, required', 'ID assigned to the h2 heading.'],
      ['title', 'string, required', 'Heading text.'],
      ['description', 'ComponentChildren', 'Optional description.'],
      ['classes', 'root, title, description', 'Add classes to header parts.'],
    ],
    accessibility:
      'Pass the heading id to Modal labelledBy. The ref and native props apply to the header element.',
  },
  {
    title: 'DialogBody',
    slug: 'dialog-body',
    purpose: 'Contain the scrollable content of a dialog.',
    example: () => (
      <DialogBody>
        <p class={styles.longText}>
          Long descriptions wrap inside a narrow dialog.
          example-of-a-long-unbroken-value-that-should-fit-without-horizontal-scrolling.
        </p>
      </DialogBody>
    ),
    code: '<DialogBody><p>Review the connection configuration.</p></DialogBody>',
    props: [],
    accessibility:
      'Keep the content in a logical reading order. Place the dialog name in DialogHeader and actions in DialogFooter.',
  },
  {
    title: 'DialogFooter',
    slug: 'dialog-footer',
    purpose: 'Arrange the actions at the end of a dialog.',
    example: () => (
      <DialogFooter>
        <Button>Cancel</Button>
        <Button variant="primary">Save</Button>
      </DialogFooter>
    ),
    code: '<DialogFooter><Button onClick={close}>Cancel</Button><Button variant="primary" onClick={save}>Save</Button></DialogFooter>',
    props: [],
    accessibility:
      'Use native buttons with specific action labels. Set initial focus through Modal rather than through the footer.',
  },
  {
    title: 'Input',
    slug: 'input',
    purpose: 'Enter a single-line value using a styled native input.',
    example: InputExample,
    code: '<Field label="Profile name">{control => <Input {...control} placeholder="Office connection" />}</Field>',
    props: [
      [
        'type',
        'text | search | email | url | tel | password | number',
        'Default text. Native value, disabled, readOnly and event props remain available.',
      ],
    ],
    accessibility:
      'Always provide a label. Spread Field control props to connect descriptions, errors and required state.',
  },
  {
    title: 'Textarea',
    slug: 'textarea',
    purpose: 'Edit multiline text in a native textarea.',
    example: TextareaExample,
    code: '<Field label="Notes">{control => <Textarea {...control} rows={3} />}</Field>',
    props: [],
    accessibility:
      'Provide a label and enough rows for the content. Native disabled, readOnly, value and input events are supported.',
  },
  {
    title: 'Field',
    slug: 'field',
    purpose: 'Connect a control with its label, hint and validation message.',
    example: FieldExample,
    code: '<Field label="Port" required hint="1 to 65535" validationState="error" validationMessage="Enter a valid port.">\n  {control => <Input {...control} type="number" />}\n</Field>',
    props: [
      ['label', 'ComponentChildren, required', 'Visible control label.'],
      [
        'children',
        '(control: FieldControlProps) => ComponentChildren, required',
        'Render the control and spread supplied accessibility props.',
      ],
      ['controlId', 'string', 'Explicit control ID; generated otherwise.'],
      [
        'hint / validationMessage',
        'ComponentChildren',
        'Descriptions connected with aria-describedby.',
      ],
      [
        'validationState',
        'none | error | warning | success',
        'Default none. Error sets aria-invalid.',
      ],
      ['required', 'boolean', 'Sets required on the child control.'],
      ['classes', 'root, label, hint, validation', 'Add classes to field parts.'],
    ],
    accessibility:
      'Spread all control props onto one labelable input. Validate in your form handler; Field presents the validation result.',
  },
  {
    title: 'Checkbox',
    slug: 'checkbox',
    purpose: 'Toggle independent choices, including a mixed selection.',
    example: CheckboxExample,
    code: '<Checkbox name="remember" label="Remember connection" />\n<Checkbox label="Mixed selection" indeterminate />',
    props: [
      ['label', 'ComponentChildren, required', 'Visible label.'],
      ['indeterminate', 'boolean', 'Sets the native mixed state; default false.'],
      ['classes', 'root, wrapper, label, indicator', 'Add classes to checkbox parts.'],
    ],
    accessibility:
      'Uses a native checkbox and associated label. Space toggles it. Indeterminate communicates a partial selection and does not set checked.',
  },
  {
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
  },
  ...(
    [
      'Sidebar',
      'SidebarHeader',
      'SidebarNav',
      'SidebarGroup',
      'SidebarItem',
      'SidebarFooter',
      'SidebarBrand',
    ] as const
  ).map((title) => ({
    title,
    slug: title.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
    purpose: {
      Sidebar: 'Compose expanded, rail or horizontal navigation with header, links and footer.',
      SidebarHeader: 'Place a brand or custom content at the top of navigation.',
      SidebarNav: 'Group navigation links in a named native nav landmark.',
      SidebarGroup: 'Group related navigation links with an optional visible label.',
      SidebarItem: 'Navigate with an anchor, run a button action or forward a custom root.',
      SidebarBrand: 'Display a decorative logo, title and optional description.',
      SidebarFooter: 'Place secondary content at the bottom of a Sidebar.',
    }[title],
    example: sidebarExamples[title],
    code: sidebarCodes[title],
    props:
      title === 'SidebarBrand'
        ? ([
            ['title', 'string, required', 'Visible brand title.'],
            [
              'logo / description',
              'ComponentChildren / string',
              'Decorative logo and optional supporting text.',
            ],
            ['classes', 'root, logo, content, title, description', 'Add classes to brand parts.'],
          ] as Prop[])
        : title === 'Sidebar'
          ? ([
              ['layout', 'Signalish<SidebarLayout>', 'expanded, rail or horizontal.'],
              [
                'scrollable',
                'Signalish<boolean>',
                'Make the nav scroll while header and footer remain visible.',
              ],
            ] as Prop[])
          : title === 'SidebarNav'
            ? ([
                [
                  'aria-label or aria-labelledby',
                  'string, required',
                  'Accessible navigation name.',
                ],
              ] as Prop[])
            : title === 'SidebarGroup'
              ? ([
                  [
                    'label',
                    'ComponentChildren',
                    'Optional group label linked through aria-labelledby.',
                  ],
                  ['classes', 'root, label, content', 'Add classes to group parts.'],
                ] as Prop[])
              : title === 'SidebarItem'
                ? ([
                    [
                      'href / as',
                      'anchor href / a | button',
                      'Plain anchors require href. Buttons accept disabled and reject href and active.',
                    ],
                    [
                      'render',
                      'VNode | callback',
                      'Replace the root; forward all composed props, children and ref. as still determines types and defaults.',
                    ],
                    [
                      'label / description',
                      'string',
                      'Explicit accessible name for complex rail content and supporting text.',
                    ],
                    ['active', 'Signalish<boolean>', 'Sets aria-current page.'],
                    ['icon', 'ComponentChildren', 'Optional decorative icon.'],
                    ['classes', 'root, icon, content, description', 'Add classes to item parts.'],
                  ] as Prop[])
                : [],
    accessibility: {
      SidebarBrand:
        'The logo is decorative. The title remains the visible brand text. No interactive wrapper is added.',
      Sidebar:
        'Size and responsive visibility belong to the application shell. Use SidebarNav for the navigation landmark.',
      SidebarHeader: 'Use visible branding and meaningful link text if the brand navigates.',
      SidebarNav:
        'Supply aria-label or aria-labelledby. Links use normal Tab and Enter navigation.',
      SidebarGroup:
        'A visible label names the group. Navigation remains native links without menu roles.',
      SidebarItem:
        'Active links expose aria-current page. Native modified clicks, targets and keyboard activation remain available. Icons are decorative.',
      SidebarFooter: 'Use descriptive text and native buttons or links for secondary actions.',
    }[title],
  })),
];
const families = [
  ...['Table', 'DataList', 'Toolbar', 'Disclosure'].map((title) => ({
    title,
    slug: title.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
    members: docs.filter((doc) => doc.title.startsWith(title)),
  })),
  {
    title: 'AppShell',
    slug: 'app-shell',
    members: docs.filter((doc) => doc.title.startsWith('AppShell')),
  },
  {
    title: 'Sidebar',
    slug: 'sidebar',
    members: docs.filter((doc) => doc.title.startsWith('Sidebar')),
  },
  {
    title: 'Dialog',
    slug: 'dialog',
    members: ['Modal', 'DialogHeader', 'DialogBody', 'DialogFooter', 'ConfirmDialog'].map((title) =>
      docs.find((doc) => doc.title === title)!,
    ),
  },
];
const componentDocs: ComponentDoc[] = [
  {
    title: 'TextPreview',
    slug: 'text-preview',
    purpose: 'Read selectable diagnostics or configuration without changing whitespace.',
    example: () => (
      <div class={styles.form}>
        <TextPreview
          text={
            'Connection: office\nAddress: 192.168.10.24\nGateway: 192.168.10.1\nAttempt 1: DNS lookup completed\nAttempt 2: request timed out after 30000ms while resolving the configured gateway and retrying the connection.\nAttempt 3: gateway unreachable\nRoute: 192.168.10.0/24\nInterface: ethernet\nResult: reconnect required'
          }
          aria-label="Connection diagnostics"
          style={{ maxHeight: '100px' }}
        />
        <TextPreview
          text={
            '[network]\ngateway = 192.168.10.1\nroute = 192.168.10.0/24 via 192.168.10.1 dev ethernet'
          }
          wrap={false}
          aria-label="Network configuration"
          style={{ maxHeight: '120px' }}
        />
      </div>
    ),
    code: '<TextPreview text={diagnostics} aria-label="Diagnostics" style={{ maxHeight: "220px" }} />',
    props: [
      ['text', 'string', 'Literal selectable text, preserving whitespace and newlines.'],
      ['wrap', 'boolean = true', 'Wrap long lines; false enables horizontal scrolling.'],
      ['style.maxHeight', 'CSS-compatible value', 'Constrain the native pre and scroll inside it.'],
    ],
    accessibility:
      'Native pre root, ref, hidden and attributes are forwarded. tabIndex defaults to 0 for keyboard scrolling and can be overridden. No live announcement or editing role.',
  },
  {
    title: 'CodeBlock',
    slug: 'code-block',
    purpose: 'Read source code with optional generic syntax tokens and exact-source copying.',
    example: () => (
      <div class={styles.form}>
        <PlainCodeBlock
          code={'{\n  "gateway": "192.168.10.1",\n  "retry": 3\n}'}
          language="json"
          copy
          codeLabel="Plain configuration"
          preStyle={{ maxHeight: '140px' }}
        />
        <PlainCodeBlock
          code={
            '# Long diagnostic command\nnetwork inspect --gateway 192.168.10.1 --profile office --include-routes --include-diagnostics'
          }
          wrap
          copy
          codeLabel="Wrapped command"
          preStyle={{ maxHeight: '100px' }}
        />
        <CodeExample code={'const ready = true;\nconsole.log("Connection ready");'} />
      </div>
    ),
    code: '<CodeBlock code={source} language="json" copy codeLabel="Configuration" />',
    props: [
      ['code', 'string', 'Raw source; copying always uses this exact string.'],
      [
        'tokens',
        'readonly CodeBlockToken[]',
        'Optional safe text/kind tokens. Their text must concatenate to code to preserve displayed source. No parsing or runtime mismatch fallback.',
      ],
      ['language', 'string', 'Display label only.'],
      ['wrap', 'boolean = false', 'Wrap long lines when enabled.'],
      ['copy', 'boolean = false', 'Show a native copy button and live result.'],
      [
        'codeLabel',
        'string = "Code"',
        'Localized accessible name of the scrollable pre. Root aria-label only names the div.',
      ],
      [
        'labels',
        '{ copy?: string; success?: string; failure?: string }',
        'Override English copy and result labels.',
      ],
      [
        'preStyle',
        'Native style',
        'Constrain code height with maxHeight. Root style applies to the div.',
      ],
    ],
    accessibility:
      'Native div root and ref with pre/code semantics. hidden is forwarded. Source is escaped; plain or unknown kinds render as text. The pre has tabIndex 0. Clipboard rejection or absence announces failure.',
    note: 'Token kinds: keyword, string, comment, function, type, property, number, literal, tag, attribute, operator, punctuation, command. Override --code-color-<kind> theme variables. Forced colors use CanvasText. Tokenization remains external; this gallery maps TanStack tokens to library kinds.',
  },
  ...docs.filter((doc) => !families.some((family) => family.members.includes(doc))),
  ...families.map((family) => ({
    ...family.members[0]!,
    title: family.title,
    slug: family.slug,
    members: family.members,
    ...(family.title === 'Dialog'
      ? {
          purpose:
            'Compose a controlled modal or confirm an action with the dialog family. Dialog is a documentation group, not an exported component. Modal provides focus containment and restoration; DialogHeader, DialogBody and DialogFooter compose its contents. ConfirmDialog composes these parts with Cancel-first focus and pending action handling.',
          note: 'Choose the standard or confirmation scenario in the live example. Mount Modal or ConfirmDialog only while open.',
        }
      : {}),
  })),
];

function ComponentPage({ doc }: { doc: ComponentDoc }) {
  const Example = doc.example;
  return (
    <div class={styles.sections}>
      {doc.title === 'PageHeader' && (
        <section aria-label="PageHeader example" class={styles.preview}>
          <Example />
        </section>
      )}
      <p>{doc.purpose}</p>
      {doc.title !== 'PageHeader' && (
        <section aria-label={`${doc.title} example`} class={styles.docSection}>
          <Text preset="subtitle1" render={<h2 />}>
            Example
          </Text>
          {['Button', 'Dialog'].includes(doc.title) ? (
            <Example />
          ) : (
            <div class={styles.preview}>
              <Example />
            </div>
          )}
          <InfoBar>
            {doc.note ??
              (doc.title.startsWith('Sidebar')
                ? 'Demo selection is local. Rail links retain accessible names; focus or hover reveals their labels. Layout and breakpoints belong to the application.'
                : 'This example runs inside the gallery.')}
          </InfoBar>
        </section>
      )}
      <section class={styles.docSection}>
        <Text preset="subtitle1" render={<h2 />}>
          Usage
        </Text>
        <CodeExample code={doc.code} />
      </section>
      <section class={styles.apiReference}>
        <Text preset="subtitle1" render={<h2 />} id={`${doc.slug}-api-reference`}>
          API reference
        </Text>
        {(doc.members ?? [doc]).map((member) => (
          <section key={member.title} id={member.slug} class={styles.docSection}>
            {doc.members && (
              <Text preset="subtitle2" render={<h3 />} id={`${member.slug}-api`}>
                {member.title}
              </Text>
            )}
            {member.title === 'Styling engine' ? (
              <p>Import css, cx, cva and sva from the styling entry or generated bindings.</p>
            ) : (
              <p>Import {member.title}Props for the complete TypeScript contract.</p>
            )}
            {doc.members && <p>{member.purpose}</p>}
            <Table
              class={styles.propsTable}
              aria-labelledby={doc.members ? `${member.slug}-api` : `${doc.slug}-api-reference`}
            >
              <TableHeader>
                <TableRow>
                  <TableHeaderCell scope="col">Prop</TableHeaderCell>
                  <TableHeaderCell scope="col">Type</TableHeaderCell>
                  <TableHeaderCell scope="col">Description</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ...member.props,
                  ...(member.title === 'Styling engine'
                    ? []
                    : [
                        member.title === 'Tooltip'
                          ? ([
                              'class / className',
                              'Signalish<string | undefined>',
                              'Add a portal root class. Caller native trigger props and refs belong in triggerProps.',
                            ] as Prop)
                          : member.title === 'ConfirmDialog'
                            ? ([
                                'class / className',
                                'Signalish<string | undefined>',
                                'Add a root class. className is the fallback. Other native HTML props are not accepted.',
                              ] as Prop)
                            : native,
                      ]),
                ].map(([name, type, description]) => (
                  <TableRow key={name}>
                    <TableHeaderCell scope="row">{name}</TableHeaderCell>
                    <TableCell>
                      <code>{type}</code>
                    </TableCell>
                    <TableCell>{description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {doc.members && <p>{member.accessibility}</p>}
            {doc.members && member.title !== doc.title && !member.title.startsWith('AppShell') && (
              <CodeExample code={member.code} />
            )}
          </section>
        ))}
      </section>
      <section class={styles.docSection}>
        <Text preset="subtitle1" render={<h2 />}>
          Accessibility
        </Text>
        <p>{doc.accessibility}</p>
      </section>
    </div>
  );
}
export function NotFound() {
  const href = useGalleryHref();
  return (
    <>
      <p>The requested documentation page does not exist.</p>
      <a class={styles.documentationLink} href={href('/')}>
        Return to Getting Started
      </a>
    </>
  );
}
export type GalleryPage = {
  path: string;
  title: string;
  group: 'Overview' | 'Components' | 'Guides' | 'Utils';
  component: ComponentType;
  demoOwnsHeading?: boolean;
};
export const galleryPages: GalleryPage[] = [
  ...utilityPages,
  {
    path: '/',
    title: 'Getting Started',
    group: 'Overview',
    component: GettingStarted,
  },
  { path: '/changelog', title: 'Changelog', group: 'Overview', component: Changelog },
  { path: '/about', title: 'About', group: 'Overview', component: About },
  ...componentDocs.map((doc) => ({
    path: `/components/${doc.slug}`,
    title: doc.title,
    group: 'Components' as const,
    component: () => <ComponentPage doc={doc} />,
    demoOwnsHeading: doc.title === 'PageHeader',
  })),
  { path: '/guides/theming', title: 'Theming', group: 'Guides', component: ThemingGuide },
  { path: '/guides/styling', title: 'Styling', group: 'Guides', component: StylingGuide },
  { path: '/guides/forms', title: 'Forms', group: 'Guides', component: FormsGuide },
  { path: '/guides/signals', title: 'Signals', group: 'Guides', component: SignalsGuide },
];
