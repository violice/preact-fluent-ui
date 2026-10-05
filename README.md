# Preact Fluent UI

`@violice/preact-fluent-ui` is an independent Fluent-style component library for Preact. It is not an official Microsoft package or a native WinUI wrapper. It requires Preact `^10.27.0` and an ESM build setup that handles CSS imports.

[Live examples](https://violice.github.io/preact-fluent-ui/) · [npm package](https://www.npmjs.com/package/@violice/preact-fluent-ui) · [API reference](docs/api.md) · [Theme tokens](docs/tokens.md)

## Installation

```sh
npm install @violice/preact-fluent-ui preact
```

```tsx
import { Button, Card } from '@violice/preact-fluent-ui';
import '@violice/preact-fluent-ui/theme.css';
import '@violice/preact-fluent-ui/styles.css';
// Optional document defaults and ordinary fields:
import '@violice/preact-fluent-ui/reset.css';
import '@violice/preact-fluent-ui/native-controls.css';

export function Example() {
  return <Card><Button variant="primary">Save</Button></Card>;
}
```

JavaScript imports do not load CSS. `theme.css` provides root tokens and the system light/dark color scheme. `styles.css` supplies every component's required styling. Reset and native-controls are optional. System fonts are used without distributing font files.

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

Use Field's controlId for explicit unique ids across independent Preact roots. Checkbox supports indeterminate independently of checked. See the [form API](docs/api.md#forms) for ref targets, class slots, ARIA composition and reset behavior.

Render only one active Modal. Give Modal `labelledBy` the unique id used by its DialogHeader, plus `initialFocusRef` and `onClose`. Supply a `fallbackFocusRef` when the opener can disappear. ConfirmDialog generates its title id and requires `cancelLabel`, `confirmLabel`, and `pendingLabel`; the caller owns its language, busy state, and operation. Keep ConfirmDialog in one persistent application root. Independent Preact roots can generate colliding ids; use manually named Modal headings if your page needs cross-root id coordination.

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

SidebarGroup has `classes` slots `root`, `label` and `content`; SidebarItem has `root`, `icon`, `content` and `description`. Structural parts have no `classes` prop. All parts use `class` with `className` fallback; slots are additive and accept `JSX.Signalish` values. See the [Sidebar API](docs/api.md#sidebar) for semantics and accessibility.

## Application shell and composition

`Sidebar` uses application navigation styles and supports `layout="expanded"`, `"rail"` and `"horizontal"`. Use `scrollable` to scroll navigation between its header and footer. `SidebarBrand` accepts a required title, optional description and decorative logo. Rail items keep accessible names and show labels on hover or keyboard focus; complex children require `label`.

Compose `AppShell`, `AppShellWorkspace`, `AppShellHeader`, `AppShellToolbar`, `AppShellContent` and `AppShellFooter`. Match `AppShell navigationLayout` with `Sidebar layout`. Workspace renders the document's main landmark; the other parts render divs. Default widths are 248px expanded and 64px rail, with an 8px workspace margin, 12px radius and 1240px content maximum. Applications own breakpoints and layout state.

`SidebarItem render` replaces its root with a VNode or callback. `as` still selects native types and defaults. A custom Link must forward composed props, children and ref to its native root. Do not nest an anchor or button inside another interactive root. `useRender` composes refs; `mergeProps` combines props with consumer handlers first and stops earlier handlers after `preventDefault()`. See the [utility API](docs/api.md#utilities).

The prepared 0.4.0 release includes data components, loading feedback, Tooltip, TextPreview, CodeBlock and AppShellToolbar. Toolbar and ToolbarGroup replace the former DataToolbar names without compatibility aliases. AppShellToolbar belongs directly inside AppShellWorkspace alongside Header and Content.

## Limitations

Only one Modal may be active, and portaled dialogs use the root theme. Nested themes and ThemeProvider are not supported. The application owns layout sizing, responsive navigation, routing and business state.

`styles.css` includes all component styles, even when you import only one component. Preact is a peer dependency; CVA and clsx are bundled and need no separate installation.

Forced-colors and reduced-motion CSS rules are included, but manual Windows verification is still pending. See [the pending Windows checks](docs/visual-acceptance.md#pending-windows-checks).

The [live gallery](https://violice.github.io/preact-fluent-ui/) uses the latest stable release from npm.

## Development

Use Node 24 and `npm ci`. `npm run dev` builds the library and starts the gallery at `http://localhost:5173`. The English gallery has separate component pages, Overview pages for Getting Started and About, Guides for Theming, Styling, Forms and Signals, and a 404 page. preact-iso provides gallery routing/prerendering; @preact/signals owns gallery settings and live examples. Both are devDependencies and are absent from the library runtime and peer contract. The sidebar Appearance settings button opens a Modal with Full/Minimal CSS presets, system/light/dark appearance, and standard/green/custom palettes. Settings are saved in the URL. Code examples are visible without opening a disclosure, use TanStack Highlight and can be copied. Components and Utils links are alphabetical. Utils documents useRender, mergeProps, mergeClasses and resolveClass; the gallery has 37 canonical documentation pages. AppShell, Sidebar and Dialog each document their exported parts on one page with API reference tables; Utils pages include parameter tables and separate return value blocks. Getting Started is the homepage at /; About is at /about. The gallery frame uses AppShell, AppShellWorkspace and AppShellContent. Getting Started includes a local profile form, and live Sidebar demos change their own selection without navigating the gallery. Rebuild or restart after editing library sources; the gallery imports built library artifacts.

Run the checks on a clean checkout:

```sh
npm run build
npm run check
npm run build:gallery
npm run test:package:all
npm run test:gallery-artifact
npm run test:gallery-preview
```

Build before checking because the gallery needs the library's generated declarations. `check` runs type, lint, formatting, test, and license checks. `test:package:all` verifies the packed library with the locked and minimum supported Preact versions.

`build:gallery` prerenders every known route and `404.html`, then verifies the artifact. The default base is `/`. For GitHub Pages, build and preview the repository base:

```sh
GALLERY_BASE=/preact-fluent-ui/ npm run build:gallery
GALLERY_BASE=/preact-fluent-ui/ npm run test:gallery-artifact
GALLERY_BASE=/preact-fluent-ui/ npx vite preview --config examples/gallery/vite.config.ts --port 4173
```

Open `http://localhost:4173/preact-fluent-ui/components/button` to test a direct nested entry. Use the same base for build, artifact checks and preview. On Windows, set `GALLERY_BASE` with your shell's environment syntax.

See [release documentation](docs/release.md) for archive verification and publishing.

## License

The MIT license covers this project's code. Fluent icon attribution and licensing are in [THIRD_PARTY_NOTICES.txt](THIRD_PARTY_NOTICES.txt) and [licenses/fluent-system-icons.txt](licenses/fluent-system-icons.txt).

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
