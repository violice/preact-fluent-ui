# Public API

Import components and their exported props types from `@violice/preact-fluent-ui`. Internal source subpaths are not exports. JavaScript does not import CSS; explicitly load `theme.css` and `styles.css`. [README](../README.md) explains optional global styles and override order.

## Shared native props

The table lists every component-specific prop. Native props include events, children where allowed, `aria-*`, `data-*`, `id`, `style`, and the element's attributes. The exported types use Preact JSX types. Components with a DOM root forward `ref` to the element in the table. ConfirmDialog is composed and has no root ref or arbitrary native props.

Button, Card, StatusBadge, Icon, DialogBody, and DialogFooter merge `class` and `className` with internal classes, including Preact signal-like values. Field, Input, Textarea, Checkbox, Switch, Select, PageHeader, EmptyState, InfoBar, DialogHeader, Modal, ConfirmDialog, and all Sidebar parts read signal-like values before choosing `class ?? className`, then append `classes.root` when the component has multiple parts. An empty `class` suppresses the fallback. Native fields and events stay controlled by the caller. Custom props never reach DOM attributes. Select's class props style the select itself; `classes.wrapper` styles its wrapping span and `classes.icon` styles the decorative icon. ConfirmDialog accepts class/className on its dialog root and delegates its classes slots to its constituent components; it does not forward arbitrary native props.

| Component / exported type | Native props and ref | Component-specific props and defaults |
| --- | --- | --- |
| Button / ButtonProps | button | `variant?: 'default' \| 'primary' \| 'subtle' \| 'danger'` defaults to default; `size?: 'default' \| 'compact' \| 'icon'` defaults to default; native `type` defaults to button |
| Card / CardProps | section | Native props and children |
| InfoBar / InfoBarProps | div | `tone?: 'info' \| 'success' \| 'warning' \| 'error'` defaults to info; `title?: string`; role defaults to alert for error, status otherwise; explicit role is allowed; `classes?: { root?, title?, content? }` |
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
| Sidebar / SidebarProps | aside, HTMLElement | Native props plus appearance, layout and scrollable; no classes prop |
| SidebarHeader / SidebarHeaderProps | div | Native props and children; no classes prop |
| SidebarNav / SidebarNavProps | nav, HTMLElement | Required `aria-label` or `aria-labelledby`; no classes prop |
| SidebarGroup / SidebarGroupProps | div | Optional `label: ComponentChildren`; `classes?: { root?, label?, content? }` |
| SidebarItem / SidebarItemProps | a or button | Anchor href or render; button as="button"; optional icon, description, label and active for anchors; slots root/icon/content/description |
| SidebarFooter / SidebarFooterProps | div | Native props and children; no classes prop |

`IconName` contains exactly 22 names: `about`, `adapter`, `add`, `chevron-down`, `connected`, `copy`, `delete`, `diagnostics`, `disconnected`, `edit`, `eye`, `info`, `network`, `open`, `profile`, `refresh`, `restore`, `routes`, `settings`, `shield`, `vpn`, `warning`. Icon supplies no accessible label. Name the parent icon button with visible text or `aria-label`.

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

`AppShellProps` extends div native props with `navigationLayout?: JSX.Signalish<SidebarLayout>`, default `expanded`. Match it to Sidebar's `layout?: JSX.Signalish<SidebarLayout>`. Sidebar also accepts `appearance?: 'default' | 'app'`, default `default`, and `scrollable?: JSX.Signalish<boolean>`, default false. Default Sidebar remains a vertical flex aside; the app appearance applies application navigation styling. Scrollable navigation keeps header and footer visible.

`SidebarBrandProps` extends native div props, replacing native title with required `title: string`. It accepts `description?: string`, `logo?: ComponentChildren` and class slots root/logo/content/title/description. The logo is decorative. Rail layout hides visual text while keeping names; set SidebarItem `label` for complex children. Rail labels appear in a portal on hover or keyboard focus and Escape dismisses them until hover and focus leave.

`AppShellWorkspaceProps` forwards native main props and an HTMLElement ref. Use one Workspace per document. `AppShellHeaderProps`, `AppShellContentProps` and `AppShellFooterProps` forward native div props and HTMLDivElement refs. They add no heading, focus or responsive state. All shell parts preserve hidden and class/className fallback. Horizontal layout stacks navigation above the workspace, removes workspace margin and radius. Applications own breakpoints and keyboard disclosure.

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

The new shell and utility API is unreleased. Build and pack the checkout for consumers and install that local archive until release. Keep tracked manifests free of absolute local paths.
