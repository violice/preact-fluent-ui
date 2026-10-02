# Preact Fluent UI

`@violice/preact-fluent-ui` is an independent Fluent-style component library for Preact. It is not an official Microsoft package or a native WinUI wrapper. Version 0.1.0 requires Preact `^10.27.0` and an ESM build setup that handles CSS imports.

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
import './app-theme.css';

export function Example() {
  return <Card><Button variant="primary">Save</Button></Card>;
}
```

JavaScript imports do not load CSS. `theme.css` provides root tokens and the system light/dark color scheme. `styles.css` supplies every component's required styling, including Select. Reset and native-controls are optional; neither supplies an application layout. System fonts are used without distributing font files.

Put overrides after the library styles. Define light values at `:root`, dark values inside `prefers-color-scheme: dark`, and forced-colors values last. Primary aliases accent by default, but apps can change them independently. Portaled dialogs inherit the root theme; nested themes and ThemeProvider are outside version 0.1.0.

All components with a DOM root accept native props and forward their DOM ref. `class` and `className` merge with internal classes. Select also accepts `wrapperClassName` for its span. Icon is always decorative: give an icon-only Button an `aria-label` such as `<Button size="icon" aria-label="Refresh"><Icon name="refresh" /></Button>`.

Render only one active Modal. Give Modal `labelledBy` the unique id used by its DialogHeader, plus `initialFocusRef` and `onClose`. Supply a stable `fallbackFocusRef` when the opener can disappear. ConfirmDialog generates its title id and requires `cancelLabel`, `confirmLabel`, and `pendingLabel`; the caller owns its language, busy state, and operation. Keep ConfirmDialog in one persistent application root. Independent Preact roots can generate colliding ids; use manually named Modal headings if your page needs cross-root id coordination.

See [all props and examples](docs/api.md), [the full token table](docs/tokens.md), and [visual acceptance results](docs/visual-acceptance.md).

## Development

Use Node 24 and `npm ci`. `npm run dev` builds the library and starts the gallery at `http://localhost:5173`. The pages are `/index.html` for full CSS, `/minimal.html` for theme/styles only, and `/green.html` for the Xbox DNS overrides. Rebuild or restart after editing library sources; the gallery imports built library artifacts.

`npm run build:gallery` writes all three HTML entries to `.gallery-dist`, separately from npm `dist`. Run `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm test`, and `npm run build` for library checks. Gallery sources participate in type and format checks.

The MIT license covers this project's code. Fluent icon attribution and licensing are in [THIRD_PARTY_NOTICES.txt](THIRD_PARTY_NOTICES.txt) and [licenses/fluent-system-icons.txt](licenses/fluent-system-icons.txt).
