# Public API

Import components and their exported props types from `@violice/preact-fluent-ui`. Internal source subpaths are not exports. JavaScript does not import CSS; explicitly load `theme.css` and `styles.css`. [README](../README.md#installation) explains optional global styles. The [usage guide](usage.md#theming) explains override order.

## Shared native props

The table lists every component-specific prop. Native props include events, children where allowed, `aria-*`, `data-*`, `id`, `style`, and the element's attributes. The exported types use Preact JSX types. Components with a DOM root forward `ref` to the element in the table. ConfirmDialog is composed and has no root ref or arbitrary native props.

Button, Card, StatusBadge, Icon, DialogBody, and DialogFooter merge `class` and `className` with internal classes, including Preact signal-like values. Field, Input, Textarea, Checkbox, Switch, Select, PageHeader, EmptyState, InfoBar, DialogHeader, Modal, ConfirmDialog, and all Sidebar parts read signal-like values before choosing `class ?? className`, then append `classes.root` when the component has multiple parts. An empty `class` suppresses the fallback. Native fields and events stay controlled by the caller. Custom props never reach DOM attributes. Select's class props style the select itself; `classes.wrapper` styles its wrapping span and `classes.icon` styles the decorative icon. ConfirmDialog accepts class/className on its dialog root and delegates its classes slots to its constituent components; it does not forward arbitrary native props.

| Component / exported type | Native props and ref | Component-specific props and defaults |
| --- | --- | --- |
| Button / ButtonProps | button | `variant?: 'default' \| 'primary' \| 'subtle' \| 'danger'` defaults to default; `size?: 'default' \| 'compact' \| 'icon'` defaults to default; native `type` defaults to button |
| Card / CardProps | section | `padding?: 'regular' \| 'none'`, default regular; native props and children |
| Box / BoxProps | div by default, HTMLElement ref | Optional flex/grid, spacing, size and overflow props described below; `render?: VNode \| (props: BoxRenderProps, state: BoxRenderState) => VNode`; native props and additive `class` with `className` fallback |
| InfoBar / InfoBarProps | div | `tone?: 'info' \| 'success' \| 'warning' \| 'error'` defaults to info; `title?: string`; role defaults to alert for error, status otherwise; explicit role is allowed; `classes?: { root?, title?, content? }` |
| CounterBadge / CounterBadgeProps | span | Count with a fixed 24px height, minimum 24px width, rounded corners and native HTML props. Longer counts expand only the width. Numeric children, including zero, are displayed as supplied. Uses `class` with `className` fallback. |
| Text / TextProps | span by default, HTMLElement ref | `preset?: JSX.Signalish<TextPreset>` defaults to body1; `color?: JSX.Signalish<TextColor>` defaults to inherit; `render?: VNode \| (props: TextRenderProps, state: TextRenderState) => VNode`; native attributes and additive `class` with `className` fallback |
| StatusBadge / StatusBadgeProps | span | `tone?: 'neutral' \| 'success' \| 'warning' \| 'error'` defaults to neutral |
| Icon / IconProps | svg, excluding children/width/height | required `name: IconName`; `size?: 16 \| 20 \| 24` defaults to 20; `aria-hidden=true` and `focusable=false` are invariants |
| Field / FieldProps | div, excluding children | required `label: ComponentChildren`, `children: (props: FieldControlProps) => ComponentChildren`; optional `controlId`, `hint`, `validationMessage`, `required`; `validationState?: ValidationState` defaults to none; `classes?: { root?, label?, hint?, validation? }` |
| Checkbox / CheckboxProps | input, excluding type/children | required `label: ComponentChildren`; `indeterminate?: boolean` defaults false; `classes?: { root?, wrapper?, label?, indicator? }` |
| Switch / SwitchProps | input, excluding type/children/role | required `label: ComponentChildren`; fixed checkbox type and switch role; `classes?: { root?, wrapper?, label?, track?, thumb? }` |
| Input / InputProps | input | `type?: 'text' \| 'search' \| 'email' \| 'url' \| 'tel' \| 'password' \| 'number'` defaults to text |
| Textarea / TextareaProps | textarea | Native rows/cols/maxLength and multiline values |
| Select / SelectProps | select | `classes?: { root?, wrapper?, icon? }`; children are native option/optgroup elements |
| PageHeader / PageHeaderProps | header, excluding children/title | required `title: string`, `description: string`; `actions?: ComponentChildren`, `notices?: ComponentChildren`; notices render after the header; `classes?: { root?, content?, title?, description?, actions?, notices? }` |
| EmptyState / EmptyStateProps | section, excluding title | required `title: string`; `icon?: IconName` defaults to routes; children optional; role defaults to status; `classes?: { root?, icon?, title?, content? }` |
| DialogHeader / DialogHeaderProps | header, excluding id/title/children | required `id: string`, `title: string`; `description?: ComponentChildren`; id belongs to its h2, native attrs/ref to header; `classes?: { root?, title?, description? }` |
| DialogBody / DialogBodyProps | div | Native props and children |
| DialogFooter / DialogFooterProps | footer | Native props and children |
| Modal / ModalProps | dialog div, excluding children/onClose/role/aria-modal/aria-labelledby | required `labelledBy: string`, `initialFocusRef: RefObject<HTMLElement>`, `onClose(): void`, `children: ComponentChildren`; optional `fallbackFocusRef: RefObject<HTMLElement>`; `classes?: { root?, backdrop? }` |
| ConfirmDialog / ConfirmDialogProps | composed, no root ref | required `title: string`, `children: ComponentChildren`, `cancelLabel: string`, `confirmLabel: string`, `pendingLabel: string`, `onClose(): void`, `onConfirm(): void`; optional `busy`, `confirmDisabled`, `danger` default false; optional `fallbackFocusRef: RefObject<HTMLElement>`; `classes?: { root?, backdrop?, header?, title?, body?, footer?, cancelButton?, confirmButton? }`; `class?`, `className?` |
| Sidebar / SidebarProps | aside, HTMLElement | Native props plus layout and scrollable; no classes prop |
| SidebarHeader / SidebarHeaderProps | div | Native props and children; no classes prop |
| SidebarNav / SidebarNavProps | nav, HTMLElement | Required `aria-label` or `aria-labelledby`; no classes prop |
| SidebarGroup / SidebarGroupProps | div | Optional `label: ComponentChildren`; `classes?: { root?, label?, content? }` |
| SidebarItem / SidebarItemProps | a or button | Anchor href or render; button as="button"; optional icon, description, label and active for anchors; slots root/icon/content/description |
| SidebarFooter / SidebarFooterProps | div | Native props and children; no classes prop |

`IconName` contains exactly 22 names: `about`, `adapter`, `add`, `chevron-down`, `connected`, `copy`, `delete`, `diagnostics`, `disconnected`, `edit`, `eye`, `info`, `network`, `open`, `profile`, `refresh`, `restore`, `routes`, `settings`, `shield`, `vpn`, `warning`. Icon supplies no accessible label. Name the parent icon button with visible text or `aria-label`.

## Layout

`Box` adds layout to a native or component root without another wrapper. The
default root is `div`; without layout props it preserves the root's existing
display, spacing, typography and appearance. It adds no role or focus behavior.

| Group | Props |
| --- | --- |
| Flex | `display`, `flex`, `flexDirection`, `flexWrap`, `flexGrow`, `flexShrink`, `flexBasis`, `order` |
| Alignment | `alignItems`, `alignContent`, `alignSelf`, `justifyContent`, `justifyItems`, `justifySelf` |
| Grid | `gridTemplateColumns`, `gridTemplateRows`, `gridAutoColumns`, `gridAutoRows`, `gridAutoFlow`, `gridColumn`, `gridRow` |
| Gaps | `gap`, `rowGap`, `columnGap` |
| Padding | `padding`, `paddingInline`, `paddingBlock`, `paddingInlineStart`, `paddingInlineEnd`, `paddingBlockStart`, `paddingBlockEnd` |
| Margin | `margin`, `marginInline`, `marginBlock`, `marginInlineStart`, `marginInlineEnd`, `marginBlockStart`, `marginBlockEnd` |
| Size | `width`, `height`, `minWidth`, `maxWidth`, `minHeight`, `maxHeight` |
| Overflow | `overflow`, `overflowX`, `overflowY` |

All layout props accept signals. Spacing accepts `space-1`, `space-2`, `space-3`,
`space-4`, `space-5`, `space-6` and `space-8`, resolving to the corresponding theme
variables. For example, `gap="space-4"` uses `var(--space-4)`. Numbers are pixels
for lengths; numeric flex factors, order and grid placement remain unitless.
Other strings are native CSS values, such as `marginInline="auto"`, `width="100%"`
or `gridTemplateColumns="repeat(2, minmax(0, 1fr))"`. Use `0` for zero spacing.

```tsx
<Box render={<section />} display="flex" flexWrap="wrap" gap="space-4">
  <Text>Saved routes</Text>
  <Button>Add route</Button>
</Box>
<Box render={<Card />} display="grid" gap="space-3">
  <Text>Connection details</Text>
</Box>
```

`BoxLayoutProps` exposes just the layout props. `BoxSpacing` documents the spacing
values. Render callbacks receive `BoxRenderProps` and `BoxRenderState.layout`,
the resolved layout before native style overrides; callbacks must forward all
props and the composed callback ref. `BoxProps` accepts an `HTMLElement` ref.

Layout props become inline styles. Object `style` overrides matching layout
properties; a native string `style` is appended to the generated declarations.
Render templates use the same [style merging as useRender](#utilities):
object styles merge, while string styles replace the preceding style value.
For responsive layout, leave the changing property in an application CSS class
and omit that Box prop. Native `hidden` remains effective with explicit display;
`hidden="until-found"` retains the browser's reveal behavior.

## Typography

`Text` separates visual typography from HTML semantics. Its ten presets follow
[Fluent 2 Text](https://fluent2.microsoft.design/components/web/react/core/text/usage)
and use the theme's `--font-body` font family.

| Preset | Size | Line height | Weight |
| --- | --- | --- | --- |
| caption2 | 10px | 14px | 400 |
| caption1 | 12px | 16px | 400 |
| body1 | 14px | 20px | 400 |
| subtitle2 | 16px | 22px | 600 |
| subtitle1 | 20px | 28px | 600 |
| title3 | 24px | 32px | 600 |
| title2 | 28px | 36px | 600 |
| title1 | 32px | 40px | 600 |
| largeTitle | 40px | 52px | 600 |
| display | 68px | 92px | 600 |

```tsx
<Text preset="title1" render={<h1 />}>Routes</Text>
<Text preset="subtitle2" render={<h2 />} id="saved-title">Saved routes</Text>
<Text color="muted" render={<p />}>Profile details</Text>
<Text>Inline text</Text>
```

Presets do not create heading semantics. The root retains its native block or
inline display; Text resets its margin and wraps long words. Color is independent
of the preset. `TextColor` supports `inherit`, `default`, `muted` and `subtle`.
The default `inherit` adds no color declaration, preserving the existing cascade.
The other values use `--color-text`, `--color-text-muted` and `--color-text-subtle`
respectively, including locally scoped theme tokens. Arbitrary CSS colors can
still be supplied through the native `style` prop. No focus behavior
or live region is added. A render VNode composes native props, classes and refs;
a callback receives the resolved preset and color in `TextRenderState` and must forward
all `TextRenderProps`, including the composed callback ref, to its native root.
`TextProps` accepts a native `HTMLElement` ref.

The optional `reset.css` clears margins and inherits font styles for bare
`h1`–`h6` and `p` using a low specificity selector. It does not assign presets;
use Text or explicit application styles for visual hierarchy. Existing
component typography continues to override the reset.

## Data presentation

All data components resolve signal-like `class` and `className` using
`class ?? className` before appending their internal classes. They accept
native attributes and forward refs to their native roots. No `classes` slots
are needed because each part is a separate public component.

| Component / Props type | Native element and ref | Additional props |
| --- | --- | --- |
| Table / TableProps | table, HTMLTableElement | `density?: 'regular' \| 'compact'`, default regular; `dividers?: 'all' \| 'between'`, default all |
| TableContainer / TableContainerProps | div, HTMLDivElement | Native props; optional horizontal scroll container |
| TableHeader / TableHeaderProps | thead, HTMLTableSectionElement | Native props |
| TableBody / TableBodyProps | tbody, HTMLTableSectionElement | Native props |
| TableFooter / TableFooterProps | tfoot, HTMLTableSectionElement | Native props; summary rows inside the table |
| TableRow / TableRowProps | tr, HTMLTableRowElement | Native props |
| TableHeaderCell / TableHeaderCellProps | th, HTMLTableCellElement | `align?: 'start' \| 'center' \| 'end'`, default start; native `scope` defaults to col |
| TableCell / TableCellProps | td, HTMLTableCellElement | `align?: 'start' \| 'center' \| 'end'`, default start |
| TableCaption / TableCaptionProps | caption, HTMLTableCaptionElement | Native props; caption is visible |
| Pagination / PaginationProps | nav, HTMLElement | Required `page`, `pageCount`, `onPageChange(page)`, `previousLabel`, `nextLabel`, `aria-label`; optional `disabled` and `formatPageLabel(page, pageCount)` |
| AppShellToolbar / AppShellToolbarProps | div, HTMLDivElement | Native props, root ref and children; shared Toolbar inner layout |
| Toolbar / ToolbarProps | div, HTMLDivElement | Native props and children |
| ToolbarGroup / ToolbarGroupProps | div, HTMLDivElement | `align?: 'start' \| 'end'`, default start |
| DataList / DataListProps | dl, HTMLDListElement | `direction?: 'horizontal' \| 'vertical'`, default horizontal |
| DataListItem / DataListItemProps | div, HTMLDivElement | Native props; groups one label/value pair |
| DataListLabel / DataListLabelProps | dt, HTMLElement | Native props |
| DataListValue / DataListValueProps | dd, HTMLElement | Native props and rich children |
| Separator / SeparatorProps | div, HTMLDivElement | `orientation?: 'horizontal' \| 'vertical'`, default horizontal; `decorative?: boolean`, default true; excludes role, aria-hidden and aria-orientation overrides |

Card `padding="none"` removes the outer inset at all viewport widths. Its first
and last direct child inherit the corresponding card corners. Compose a
TableContainer inside it to preserve horizontal scrolling and rounded table
surfaces; Card itself does not clip overflow. Cell padding is independent.
Use Table `dividers="between"` for separators between rows without a line below
the final row. This includes header/body/footer boundaries and works when
native tfoot precedes tbody. The default `all` retains the existing bottom
border on every cell.

```tsx
<Card padding="none">
  <TableContainer>
    <Table dividers="between" aria-label="Saved routes">
      {/* TableHeader and TableBody */}
    </Table>
  </TableContainer>
</Card>
```

Table preserves native `scope`, `headers`, `colSpan`, `rowSpan`, and `aria-sort`.
Use TableCaption or `aria-labelledby` to name it. Table has no wrapper or grid
keyboard model. TableContainer does not add a tab stop automatically; supply
`role="region"`, a name and `tabIndex={0}` when keyboard scrolling is needed.
Column hiding, mobile card layouts, selection, and sorting belong to consumers.

Pagination uses one-based pages and a nonnegative integer pageCount. A zero
pageCount displays `0 / 0` and disables both buttons. Stale page values are
clamped for display; rendering does not emit onPageChange. Actions emit valid
adjacent pages. `disabled` defaults to false and disables both actions.
`formatPageLabel?: (page: number, pageCount: number) => ComponentChildren`
customizes the default `page / pageCount` indicator. Labels are required so
applications control localization. Keep filtering and data slicing outside
the component.

Toolbar wraps independent controls without automatically applying a
`toolbar` role or composite keyboard model. ToolbarGroup `align="end"`
pushes the group to the logical end. Reuse the same family below a data view
for counter text and Pagination; TableFooter remains a native tfoot.

DataList direction describes each label/value pair. Horizontal uses aligned
columns and stacks below 600px; vertical keeps labels above values. HTML `dir`
controls LTR/RTL independently. Pair wrappers preserve native dl/dt/dd
semantics and values can contain links, badges, or long text. Separators are
not inserted automatically.

Separator is decorative by default with `role="none"` and `aria-hidden=true`.
`decorative={false}` exposes `role="separator"` and explicit aria-orientation.
It is not focusable by default. Vertical separators stretch in a flex parent;
provide a height through style/class when the surrounding layout has no
height. Spacing belongs to the parent layout.

## Forms

```tsx
<label for="connection-mode">Connection mode</label>
<Select id="connection-mode" name="mode" value={mode}
  onChange={event => setMode(event.currentTarget.value)}
  class="select" classes={{ wrapper: "field" }}>
  <option value="automatic">Automatic</option>
  <option value="manual">Manual</option>
</Select>
```

Select retains native keyboard, form, disabled, and option behavior. It requires no native-controls CSS.

### Field composition and accessibility

Field labels exactly one control through a render prop. `FieldControlProps` contains `id: string`, optional `aria-describedby: string`, `aria-invalid: true`, and `required: true`. `ValidationState` is `'none' | 'error' | 'warning' | 'success'`. Spread the supplied props onto Input, Textarea, Select, or a native input. Field's `id` and ref belong to its div; `controlId` belongs to the control. A missing controlId uses Preact useId, stable within one application root. Independent roots may generate matching ids; provide explicit unique controlId values there.

Field renders label, hint and validation message. Hint and message ids append `-hint` and `-validation` to the control id. Only rendered blocks appear in aria-describedby, hint first. Null, undefined, false and empty strings omit a block; numeric zero renders. Only error sets aria-invalid. Required adds a decorative star and forwards native required. Field does not validate values, disable controls, or assign alert/live semantics. The application chooses validation timing and error announcements.

```tsx
import { Field, Input } from '@violice/preact-fluent-ui';

<Field label="Port" controlId="connection-port" hint="1 to 65535" required>
  {(control) => <Input {...control} type="number" name="port" min={1} max={65535}
    aria-describedby={[control['aria-describedby'], 'external-help'].filter(Boolean).join(' ')} />}
</Field>
<p id="external-help">Use the port assigned to this connection.</p>
```

Merge your own description ids with Field's ids explicitly as above. Replacing aria-describedby loses Field's hint/error connection. All visible strings come from the caller.

### Native control behavior and class slots

Input and Textarea have no wrapper. Their refs point to HTMLInputElement and HTMLTextAreaElement. They preserve native value/defaultValue, events, name/form, required, disabled and readOnly. Input supports only the text-like types listed above; use ordinary HTML for other types. No value formatting or separate onValueChange is supplied. The application owns state, submit and validation. To show custom errors for an empty required field on submit, use a form with noValidate and validate in its handler, keeping the control's required prop.

Checkbox and Switch wrap their input in a label. Their refs point to HTMLInputElement. Native id, name/value, checked/defaultChecked, required, disabled, class and ARIA props belong to that input. Their required label supplies the visible accessible name; the caller must provide meaningful text. classes.wrapper styles the outer label and classes.label styles its text span. Indicator, track and thumb spans are decorative and aria-hidden. Switch derives its accessible checked state from the native input. Both use native label click, Space, keyboard focus and form submission. Disabled prevents interaction and Tab focus. Checked controls contribute name/value to FormData; unchecked ones are omitted.

Checkbox's checked and indeterminate states are independent. Mixed state sets the DOM indeterminate property, never an HTML attribute, and does not change submission. Browser interaction clears mixed state; it is reapplied only when checked or indeterminate props change. Form reset restores native defaultChecked and defaultValue; the component does not manage indeterminate during reset. Ref cleanup clears the forwarded ref.

Only components with multiple parts expose `classes`, with `root` and named internal slots. Single-element components such as Input and Textarea use `class` with `className` fallback and do not expose `classes`. A `classes` object whose only supported key is `root` must not be introduced. All class slot values use `JSX.Signalish<string | undefined>`. Slots are typed per component; unknown keys are rejected. Components with named slots, new form controls and Sidebar parts retain internal classes followed by the resolved `class ?? className` and any classes.root slot. An explicit empty class suppresses className on these components. Button, Card, StatusBadge, Icon, DialogBody and DialogFooter retain their existing behavior of merging both class and className. Field's root slot styles the div, while Checkbox/Switch root styles the input. `hidden` on Field/Input/Textarea hides that root; on Checkbox/Switch it also hides the entire outer label. Select wrapper classes use classes.wrapper; wrapperClassName is no longer supported.

## Dialogs

```tsx
const cancel = useRef<HTMLButtonElement>(null);
const fallback = useRef<HTMLButtonElement>(null);

<Button ref={fallback}>Connections</Button>
{open && <Modal labelledBy="connection-dialog-title"
  initialFocusRef={cancel} fallbackFocusRef={fallback} onClose={() => setOpen(false)}>
  <DialogHeader id="connection-dialog-title" title="Connection settings" />
  <DialogBody><p>Change the connection options.</p></DialogBody>
  <DialogFooter><Button ref={cancel} onClick={() => setOpen(false)}>Cancel</Button></DialogFooter>
</Modal>}
```

Use unique title ids and only one active Modal, including ConfirmDialog. There is no nested dialog stack. Modal traps Tab and Shift+Tab among visible, enabled, non-inert controls, focuses itself when there are none, makes background body children inert, and locks body scrolling. Escape and backdrop call `onClose`; the caller must unmount the Modal. Focus returns to the opener, then the latest supplied fallback, then body. Closed disclosure content is excluded; the visible summary remains available. Interior Tab and radio arrow selection use native browser behavior, with Tab wrapping at the dialog edges. Caller keyboard handlers run first; `preventDefault()` suppresses Modal's handling. Its role, aria-modal and aria-labelledby cannot be replaced.

Dialog tokens live at `:root` because the portal renders into body. A theme on a nested app container will not reach the dialog.

```tsx
{open && <ConfirmDialog title="Delete connection?"
  cancelLabel="Cancel" confirmLabel="Delete" pendingLabel="Deleting..."
  danger busy={busy} confirmDisabled={!canDelete}
  fallbackFocusRef={fallback}
  onClose={() => setOpen(false)} onConfirm={deleteConnection}>
  <p>This removes the selected connection.</p>
</ConfirmDialog>}
```

All three button labels are mandatory so the app chooses the language. ConfirmDialog generates its heading id through Preact useId. Keep it in one persistent application root. Independent Preact roots can generate the same id; use Modal with manually unique heading ids if you need cross-root coordination. Busy disables both actions and blocks Escape/backdrop. ConfirmDisabled disables only confirmation; cancel and dismissal remain available. Danger uses the danger Button variant. The caller starts and completes asynchronous work and decides when to close.

## Styling multipart components

Slots target existing owned elements; children supplied by the caller are not slots. PageHeader.root styles the header, and notices styles its following sibling. EmptyState.icon styles the decorative SVG. Modal.root and ConfirmDialog.root style the dialog, while backdrop styles the portal backdrop. ConfirmDialog.header/title/body/footer/cancelButton/confirmButton reach the corresponding header, h2, body div, footer and native buttons. Optional content does not render merely because its slot has a class. All slots accept signal-like values and preserve internal classes.

```tsx
<PageHeader title="Connections" description="Manage your connections"
  class="page-header"
  classes={{ title: "page-title", actions: "page-actions", notices: "page-notices" }}
  actions={<Button>Add connection</Button>}
  notices={<InfoBar classes={{ title: "notice-title", content: "notice-content" }}
    title="Offline">Check your connection.</InfoBar>}
/>
```

## Sidebar

Sidebar is an aside with a vertical flex layout. SidebarHeader and SidebarFooter are divs; the footer uses margin-top: auto. SidebarNav is a native nav and must have an accessible name through aria-label or aria-labelledby. The application controls width, height, sticky positioning, scrolling and mobile disclosure. There are no hidden wrappers around these structural parts.

SidebarGroup wraps its children in a content div. A nonempty label renders a label div with a generated id, sets aria-labelledby to that id, and defaults role to group. Without a label, caller-provided aria-labelledby and role remain usable. An explicit role overrides the default. IDs use Preact useId; coordinate independent roots when combining them on one page.

SidebarItem defaults to an anchor. The anchor branch requires href unless render supplies the root. The as="button" branch uses type="button" by default, accepts disabled, and rejects href, target, download, active and aria-current. The anchor branch forwards its HTMLAnchorElement ref and native anchor attributes/events, and does not intercept clicks or implement routing. The application chooses the active item; active defaults to false and accepts JSX.Signalish<boolean>. Only an active item receives aria-current="page"; a caller aria-current does not replace this behavior. The optional icon is inside an aria-hidden span, so visible text or an explicit accessible name must name the link. Children render in the content span. Use as="button" for SidebarItem actions.

SidebarGroup slots are root/label/content, and SidebarItem slots are root/icon/content/description. Slots accept JSX.Signalish<string | undefined> and append to internal classes. class takes priority over className, including an explicit empty class; classes.root remains additive. Structural parts have no classes prop. Navigation uses native Tab and Enter, without menu roles or arrow-key handling. Styles support wrapping, focus-visible, logical RTL positioning and forced colors; active Windows contrast-theme acceptance remains a manual check.

See the [composition example](../README.md#sidebar-composition). The library imports neither preact-iso nor @preact/signals. Their use in the documentation gallery does not require consumers to install them.


## Application shell

`AppShellProps` extends div native props with `navigationLayout?: JSX.Signalish<SidebarLayout>`, default `expanded`. Match it to Sidebar's `layout?: JSX.Signalish<SidebarLayout>`. Sidebar also accepts `scrollable?: JSX.Signalish<boolean>`, default false. Sidebar uses application navigation styling. Vertical items fill their row, including buttons in the footer; horizontal items retain intrinsic width. Scrollable navigation keeps header and footer visible.

`SidebarBrandProps` extends native div props, replacing native title with required `title: string`. It accepts `description?: string`, `logo?: ComponentChildren` and class slots root/logo/content/title/description. The logo is decorative. Rail layout hides visual text while keeping names; set SidebarItem `label` for complex children. Rail labels appear in a portal on hover or keyboard focus and Escape dismisses them until hover and focus leave.

`AppShellWorkspaceProps` forwards native main props and an HTMLElement ref. Use one Workspace per document. `AppShellHeaderProps`, `AppShellContentProps` and `AppShellFooterProps` forward native div props and HTMLDivElement refs. Content and Footer share full width, a 1240px maximum and logical automatic margins through `--app-shell-content-max-width`; all padded shell parts use `--app-shell-content-padding`, default 24px. Header remains full workspace width. They add no heading, focus or responsive state. All shell parts preserve hidden and class/className fallback. Horizontal layout stacks navigation above the workspace, removes workspace margin and radius. Applications own breakpoints and keyboard disclosure.

## Utilities

All utilities import from the main package entry. Production code has no Signals, React, Base UI or router dependency.

```ts
mergeClasses(...classes: JSX.Signalish<string | undefined>[]): string
resolveClass(classProp: JSX.Signalish<string | undefined>, className: JSX.Signalish<string | undefined>): string | undefined
mergeProps<P extends object>(...sources: (Partial<P> | null | undefined)[]): P
useRender<Tag extends keyof JSX.IntrinsicElements, S extends object = Record<string, never>>(options: UseRenderOptions<Tag, S>): VNode
```

`UseRenderOptions<Tag, S>` has required `defaultTagName: Tag`, optional `props: JSX.IntrinsicElements[Tag]`, `render: RenderProp<JSX.IntrinsicElements[Tag], S>`, `state: S` and a selected native root `ref` or readonly array of those refs. `RenderProp<P, S>` is a VNode or `(props: P, state: S) => VNode`. Call useRender inside a component. Callback render receives composed props and state, and must forward props, children and ref. `as` on SidebarItem still determines types and native defaults; render does not infer DOM semantics. Custom Link roots must forward to one native interactive element.

VNode templates merge after component props. Explicit template children replace component children; absent template children preserve component children. useRender composes native props refs, external refs and template refs, deduplicates identical refs and runs cleanup on detach. It does not mutate the template or prop inputs.

mergeProps merges ordinary props left to right. Each source selects class before className, then the selected classes accumulate. Object styles merge by key; string styles replace previous styles and an object following a string starts a new style object. Event handlers run right to left, stopping earlier handlers when the event is defaultPrevented. Ref uses ordinary right precedence in mergeProps; useRender handles composition separately. Null and undefined sources are skipped.

mergeClasses reads string or Signalish values and joins nonempty classes. resolveClass reads both values and selects class unless it is null or undefined. An empty string suppresses className fallback. Neither helper resolves CSS conflicts or creates a computed signal; call them during a tracked render or computed calculation for signal updates.

The existing shell and utility API is published. Version 0.4.0 adds AppShellToolbar as a direct Workspace child and replaces DataToolbar/DataToolbarGroup with Toolbar/ToolbarGroup. Install version 0.4.0 or newer from npm to use these additions.

The gallery groups [AppShell](https://violice.github.io/preact-fluent-ui/components/app-shell), [Sidebar](https://violice.github.io/preact-fluent-ui/components/sidebar) and [Dialog](https://violice.github.io/preact-fluent-ui/components/dialog) into canonical family pages with an API reference table for each export. Dialog is a documentation family for Modal, DialogHeader, DialogBody, DialogFooter and ConfirmDialog; it is not an exported component. Modal controls focus and dismissal, while ConfirmDialog supplies Cancel-first action confirmation. Constituent page URLs and the old getting-started path are removed; Getting Started is at the gallery root.

## Disclosure and operation feedback

`Disclosure`, `DisclosureSummary` and `DisclosureContent` forward native details,
summary and div props and refs. Put Summary first. Root `appearance` is `default`
or `card`; native `open`, `name` and `onToggle` remain available. Read
`event.currentTarget.open` in `onToggle` when synchronizing application state.
The browser owns keyboard toggling and named groups. Content has no imposed
file typography, height or scrolling.

```tsx
<Disclosure appearance="card" open onToggle={event => setOpen(event.currentTarget.open)}>
  <DisclosureSummary>Proposed hosts file</DisclosureSummary>
  <DisclosureContent><pre>{proposedFile}</pre></DisclosureContent>
</Disclosure>
```

`Spinner` is a native span with `size="small" | "medium" | "large"` for
16/24/32px. Its optional localized `label` makes it a status; without a label it
is decorative. Slots are `root`, `indicator`, `label`. Reduced motion displays a
static incomplete ring. `LoadingState` is a div with required localized `label`,
optional descriptive children and `appearance="default" | "inline"`. Its slots
are `root`, `spinner`, `label`, `content`. One status container announces the
operation; its internal Spinner stays decorative. Applications decide when to
mount loading feedback and whether to retain existing results during refresh.

`Button` accepts `loading` and an optional localized `loadingLabel`. Loading
retains the existing label by default, shows a decorative small Spinner, sets
`aria-busy` and `aria-disabled`, and suppresses activation and form submission
while keeping focus. Explicit `disabled` still sets native disabled and takes
precedence. Icon actions replace the visible icon and retain their aria-label.
Use one application status or LoadingState to announce a shared operation.
Buttons do not create individual live regions.

## Tooltip

`Tooltip` requires localized string `content` and a render-function child.
`placement` is `top` by default, with `bottom`, `left` and `right` options.
Spread every supplied `TooltipTriggerProps` prop onto one trigger. Put caller
handlers, refs and existing description IDs in `triggerProps` so Tooltip can
compose them. Props written after the spread can overwrite composed behavior.
The trigger's accessible name remains its own aria-label or visible text.

```tsx
<Tooltip content="Refresh connection" triggerProps={{
  ref: buttonRef, onClick: refresh, 'aria-describedby': 'existing-hint',
}}>
  {props => <Button {...props} size="icon" aria-label="Refresh connection">
    <Icon name="refresh" size={16} />
  </Button>}
</Tooltip>
```

Hover opens after 500ms and keyboard focus opens immediately. Pointer/focus
exit hides the description; hovering the tooltip keeps it visible. Escape
dismisses it until the next interaction. Content must not contain interactive
controls. The portal flips and shifts inside the viewport, follows scrolling
and resizing, and copies effective theme tokens and direction from the trigger.
It remains visible inside scrolling TableContainer and Modal. Slots are `root`
and `content`; `class` takes precedence over `className`. Tooltip does not
forward arbitrary native root props or a root ref. Native disabled controls
cannot receive keyboard focus; no focusable wrapper is added. Place essential
instructions in visible text rather than relying on a disabled trigger hint.

All six new components and their Props types are root exports. Tooltip also
exports `TooltipTriggerProps`; placement/theme helpers remain internal.

AppShellToolbar supplies application surface and bottom-border chrome around Toolbar.
The first direct Workspace child inherits its upper corner radii, so a toolbar
background follows the Workspace outline. Content overflow remains visible.
The inner layout shares AppShell's `--app-shell-content-max-width` with a 1240px
default and `--app-shell-content-padding` with a 24px default. It uses border-box
sizing, full width and logical automatic margins. Desktop minimum height is
76px with 18px block padding. At widths up to 640px block padding is 12px and
inline padding remains aligned with Content at 24px; an explicit AppShell padding variable wins.
Content can wrap and increase the height. Native attributes, events, hidden,
classes and ref apply to the outer div. Children and business state belong to
the application; no toolbar role or keyboard controller is supplied.
