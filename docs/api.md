# Public API

Import components and their exported props types from `@violice/preact-fluent-ui`. Internal source subpaths are not exports. JavaScript does not import CSS; explicitly load `theme.css` and `styles.css`. [README](../README.md) explains optional global styles and override order.

## Shared native props

The table lists every component-specific prop. Native props include events, children where allowed, `aria-*`, `data-*`, `id`, `style`, and the element's attributes. The exported types use Preact JSX types. Components with a DOM root forward `ref` to the element in the table. ConfirmDialog is composed and has no root ref or arbitrary native props.

`class` and `className` merge with internal classes, including Preact signal-like class values. Native fields and events stay controlled by the caller. Custom props never reach DOM attributes. Select's class props style the select itself; `wrapperClassName` styles its wrapping span. ConfirmDialog does not accept class props; style its constituent components through tokens or compose a Modal for custom structure.

| Component / exported type | Native props and ref | Component-specific props and defaults |
| --- | --- | --- |
| Button / ButtonProps | button | `variant?: 'default' \| 'primary' \| 'subtle' \| 'danger'` defaults to default; `size?: 'default' \| 'compact' \| 'icon'` defaults to default; native `type` defaults to button |
| Card / CardProps | section | Native props and children |
| InfoBar / InfoBarProps | div | `tone?: 'info' \| 'success' \| 'warning' \| 'error'` defaults to info; `title?: string`; role defaults to alert for error, status otherwise; explicit role is allowed |
| StatusBadge / StatusBadgeProps | span | `tone?: 'neutral' \| 'success' \| 'warning' \| 'error'` defaults to neutral |
| Icon / IconProps | svg, excluding children/width/height | required `name: IconName`; `size?: 16 \| 20 \| 24` defaults to 20; `aria-hidden=true` and `focusable=false` are invariants |
| Select / SelectProps | select | `wrapperClassName?: string`; children are native option/optgroup elements |
| PageHeader / PageHeaderProps | header, excluding children/title | required `title: string`, `description: string`; `actions?: ComponentChildren`, `notices?: ComponentChildren`; notices render after the header |
| EmptyState / EmptyStateProps | section, excluding title | required `title: string`; `icon?: IconName` defaults to routes; children optional; role defaults to status |
| DialogHeader / DialogHeaderProps | header, excluding id/title/children | required `id: string`, `title: string`; `description?: ComponentChildren`; id belongs to its h2, native attrs/ref to header |
| DialogBody / DialogBodyProps | div | Native props and children |
| DialogFooter / DialogFooterProps | footer | Native props and children |
| Modal / ModalProps | dialog div, excluding children/onClose/role/aria-modal/aria-labelledby | required `labelledBy: string`, `initialFocusRef: RefObject<HTMLElement>`, `onClose(): void`, `children: ComponentChildren`; optional `fallbackFocusRef: RefObject<HTMLElement>` |
| ConfirmDialog / ConfirmDialogProps | composed, no root ref | required `title: string`, `children: ComponentChildren`, `cancelLabel: string`, `confirmLabel: string`, `pendingLabel: string`, `onClose(): void`, `onConfirm(): void`; optional `busy`, `confirmDisabled`, `danger` default false; optional `fallbackFocusRef: RefObject<HTMLElement>` |

`IconName` contains exactly 22 names: `about`, `adapter`, `add`, `chevron-down`, `connected`, `copy`, `delete`, `diagnostics`, `disconnected`, `edit`, `eye`, `info`, `network`, `open`, `profile`, `refresh`, `restore`, `routes`, `settings`, `shield`, `vpn`, `warning`. Icon supplies no accessible label. Name the parent icon button with visible text or `aria-label`.

## Forms

```tsx
<label for="connection-mode">Connection mode</label>
<Select id="connection-mode" name="mode" value={mode}
  onChange={event => setMode(event.currentTarget.value)}
  className="select" wrapperClassName="field">
  <option value="automatic">Automatic</option>
  <option value="manual">Manual</option>
</Select>
```

Select retains native keyboard, form, disabled, and option behavior. It requires no native-controls CSS.

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

Use unique title ids and only one active Modal, including ConfirmDialog. There is no nested dialog stack. Modal traps Tab and Shift+Tab among visible, enabled, non-inert controls, focuses itself when there are none, makes background body children inert, and locks body scrolling. Escape and backdrop call `onClose`; the caller must unmount the Modal. Focus returns to the opener, then the supplied fallback, then body. Keep fallback ref identity stable while open. Caller keyboard handlers run first; `preventDefault()` suppresses Modal's handling. Its role, aria-modal and aria-labelledby cannot be replaced.

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
