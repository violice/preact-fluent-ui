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

## Limitations

Only one Modal may be active, and portaled dialogs use the root theme. Nested themes and ThemeProvider are not supported. The library does not provide application layouts, routing, or business state.

`styles.css` includes all component styles, even when you import only one component. Preact is a peer dependency; CVA and clsx are bundled and need no separate installation.

Forced-colors and reduced-motion CSS rules are included, but manual Windows verification is still pending. See [the pending Windows checks](docs/visual-acceptance.md#pending-windows-checks).

The [live gallery](https://violice.github.io/preact-fluent-ui/) uses the latest stable release from npm.

## Development

Use Node 24 and `npm ci`. `npm run dev` builds the library and starts the gallery at `http://localhost:5173`. The gallery offers Full/Minimal CSS presets, system/light/dark appearance, and standard/green/custom palettes. Settings are saved in the URL. Code examples use TanStack Highlight and can be copied. Rebuild or restart after editing library sources; the gallery imports built library artifacts.

Run the checks on a clean checkout:

```sh
npm run build
npm run check
npm run build:gallery
npm run test:package:all
```

Build before checking because the gallery needs the library's generated declarations. `check` runs type, lint, formatting, test, and license checks. `test:package:all` verifies the packed library with the locked and minimum supported Preact versions.

See [release documentation](docs/release.md) for archive verification and publishing.

## License

The MIT license covers this project's code. Fluent icon attribution and licensing are in [THIRD_PARTY_NOTICES.txt](THIRD_PARTY_NOTICES.txt) and [licenses/fluent-system-icons.txt](licenses/fluent-system-icons.txt).
