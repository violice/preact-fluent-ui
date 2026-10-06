# Usage guide

See the [API reference](api.md), [theme tokens](tokens.md), and [live gallery](https://violice.github.io/preact-fluent-ui/) for complete component documentation and examples.

## Theming

Put overrides after the library styles. Define light values at `:root`, dark values inside `prefers-color-scheme: dark`, and forced-colors values last. Primary aliases accent by default, but apps can change them independently.

## Component usage

All components with a DOM root accept native props and forward their DOM ref. Button, Card, StatusBadge, Icon, DialogBody, and DialogFooter merge `class` and `className` with internal classes. Field, Input, Textarea, Checkbox, Switch, Select, PageHeader, EmptyState, InfoBar, DialogHeader, Modal, and ConfirmDialog choose `class` first, use `className` as a fallback, without a `classes` prop on Input or Textarea. Only multipart components expose `classes`, with `root` and named internal slots; `classes.root` is additive. PageHeader exposes root/content/title/description/actions/notices; EmptyState root/icon/title/content; InfoBar root/title/content; DialogHeader root/title/description; Modal root/backdrop; ConfirmDialog root/backdrop/header/title/body/footer/cancelButton/confirmButton. Select accepts `classes.wrapper` for its span and `classes.icon` for its decorative icon. Icon is always decorative: give an icon-only Button an `aria-label` such as `<Button size="icon" aria-label="Refresh"><Icon name="refresh" /></Button>`.

Field links one control to a label, hint and validation message. Input and Textarea keep native text editing; Checkbox and Switch keep native checked state and form submission. Values and validation belong to your app. All five controls work with theme.css and styles.css alone.

```tsx
import { Field, Input } from '@violice/preact-fluent-ui';

export function PortField() {
  return (
    <Field label="Port" hint="A number from 1 to 65535" required>
      {(control) => <Input {...control} type="number" name="port" min={1} max={65535} />}
    </Field>
  );
}
```

Use Field's controlId for explicit unique ids across independent Preact roots. Checkbox supports indeterminate independently of checked. See the [form API](api.md#forms) for ref targets, class slots, ARIA composition and reset behavior.

Render only one active Modal. Give Modal `labelledBy` the unique id used by its DialogHeader, plus `initialFocusRef` and `onClose`. Supply a `fallbackFocusRef` when the opener can disappear. ConfirmDialog generates its title id and requires `cancelLabel`, `confirmLabel`, and `pendingLabel`; the caller owns its language, busy state, and operation. Keep ConfirmDialog in one persistent application root. Independent Preact roots can generate colliding ids; use manually named Modal headings if your page needs cross-root id coordination.

## Layout composition

Use compiled classes on native elements or existing components:

```tsx
import { Card, Text } from '@violice/preact-fluent-ui';
import { css } from './styled-system/css';

<Card class={css({ display: 'grid', gap: 'space-4' })}>
  <Text preset="subtitle2" render={<h2 />}>Connection details</Text>
  <Text color="muted">Selected VPN profile</Text>
</Card>
```

Box has been removed. Use `css.dynamic()` for dynamic values or signals and `css()` for static and responsive styles. See [the styling guide](styling.md) for setup and class/style composition.

## Typography and native HTML reset

Use `Text` for typography with explicit HTML semantics:

```tsx
import { Text } from '@violice/preact-fluent-ui';

<Text preset="subtitle2" render={<h2 />}>Saved routes</Text>
<Text color="muted" render={<p />}>Connection details</Text>
<Text>Inline text</Text>
```

The default preset is `body1` and the default element is `span`. Color defaults
to `inherit`, preserving the surrounding styles. Use `default`, `muted` or
`subtle` for theme text colors independently of the preset. Both props accept signals.
Render callbacks
must forward the supplied props and ref, for example `render={(props) => <p {...props} />}`.
The optional `reset.css` resets native `h1`–`h6` and `p` margins and font styles
to inherited values. Add Text presets or application styles wherever visual
hierarchy is needed. See the [typography API](api.md#typography) for all presets.

## Sidebar composition

Compose navigation from Sidebar, SidebarHeader, SidebarNav, SidebarGroup, SidebarItem and SidebarFooter. Each component forwards its native element props and ref. SidebarNav requires `aria-label` or `aria-labelledby`; Plain anchor SidebarItem requires `href`; `as="button"` provides native actions.

```tsx
import { Sidebar, SidebarHeader, SidebarNav, SidebarGroup, SidebarItem,
  SidebarFooter, Button, Icon } from '@violice/preact-fluent-ui';

<Sidebar class="app-sidebar">
  <SidebarHeader>Connection manager</SidebarHeader>
  <SidebarNav aria-label="Main navigation">
    <SidebarGroup label="Application">
      <SidebarItem href="/connections" active={path === '/connections'}
        icon={<Icon name="connected" />}>Connections</SidebarItem>
      <SidebarItem href="/settings">Settings</SidebarItem>
    </SidebarGroup>
  </SidebarNav>
  <SidebarFooter><Button onClick={signOut}>Sign out</Button></SidebarFooter>
</Sidebar>
```

The caller supplies `path` and `signOut`. Sidebar has no router dependency; links retain native Tab, Enter, modifier-click and new-tab behavior. The caller decides URLs, active state, width, height, positioning and mobile disclosure. Active links receive `aria-current="page"`. Footer uses `margin-top: auto`.

SidebarGroup has `classes` slots `root`, `label` and `content`; SidebarItem has `root`, `icon`, `content` and `description`. Structural parts have no `classes` prop. All parts use `class` with `className` fallback; slots are additive and accept `JSX.Signalish` values. See the [Sidebar API](api.md#sidebar) for semantics and accessibility.

## Application shell and composition

`Sidebar` uses application navigation styles and supports `layout="expanded"`, `"rail"` and `"horizontal"`. Use `scrollable` to scroll navigation between its header and footer. `SidebarBrand` accepts a required title, optional description and decorative logo. Rail items keep accessible names and show labels on hover or keyboard focus; complex children require `label`.

Compose `AppShell`, `AppShellWorkspace`, `AppShellHeader`, `AppShellToolbar`, `AppShellContent` and `AppShellFooter`. Match `AppShell navigationLayout` with `Sidebar layout`. Workspace renders the document's main landmark; the other parts render divs. Default widths are 248px expanded and 64px rail, with an 8px workspace margin, 12px radius and 1240px maximum shared by Content, Footer and the inner Toolbar. Their inline padding stays aligned at 24px, including on mobile. Override `--app-shell-content-max-width` and `--app-shell-content-padding` to change these together. Applications own breakpoints and layout state.

`SidebarItem render` replaces its root with a VNode or callback. `as` still selects native types and defaults. A custom Link must forward composed props, children and ref to its native root. Do not nest an anchor or button inside another interactive root. `useRender` composes refs; `mergeProps` combines props with consumer handlers first and stops earlier handlers after `preventDefault()`. See the [utility API](api.md#utilities).

Version 0.5.0 added Text and CounterBadge, plus Card padding="none" and Table dividers="between" for edge-to-edge tables. The upcoming styling engine replaces Box with css()/css.dynamic().

Version 0.4.0 includes data components, loading feedback, Tooltip, TextPreview, CodeBlock and AppShellToolbar. Toolbar and ToolbarGroup replace the former DataToolbar names without compatibility aliases. AppShellToolbar belongs directly inside AppShellWorkspace alongside Header and Content.

## Text preview and code blocks

`TextPreview` renders literal selectable text in a native `pre`, with wrapping enabled
by default. Use `style={{ maxHeight: '220px' }}` for internal scrolling and
`wrap={false}` for horizontal scrolling. Native attributes, `hidden`, and the
`HTMLPreElement` ref are forwarded. `tabIndex` defaults to `0` and can be overridden.

`CodeBlock` renders a native `div` containing `pre`/`code`. It accepts `code`, optional
`language` display text, `wrap` (default `false`), and `copy` (default `false`).
`codeLabel` names the scrollable `pre` (default `Code`); root `aria-label` names only
the `div`. Localize copy feedback with `labels={{ copy, success, failure }}`.
`preStyle={{ maxHeight: '400px' }}` constrains the source; root `style` applies to the
div. Copying uses the exact raw `code` and reports clipboard absence or rejection.

For external highlighting, pass `tokens: readonly CodeBlockToken[]`, where each
item contains `text` and an optional `kind`. Token text must concatenate to `code`
to preserve the displayed source. The library escapes all text and performs no
parsing, retokenization, or mismatch fallback. Supported kinds are `keyword`,
`string`, `comment`, `function`, `type`, `property`, `number`, `literal`, `tag`,
`attribute`, `operator`, `punctuation`, and `command`. Omitted or unrecognized kinds
render plain text. Override syntax colors with `--code-color-<kind>` variables.
Forced colors render token spans in `CanvasText`. Both components add native
`class` or `className` to library classes; `class` takes precedence when both exist.
