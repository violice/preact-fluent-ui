# Preact Fluent UI

`@violice/preact-fluent-ui` is an independent Fluent-style component library for Preact. It is not an official Microsoft package or a native WinUI wrapper. Version 0.1.0 requires Preact `^10.27.0` and an ESM build setup that handles CSS imports.

Version 0.1.0 is prepared locally and has not been published to npm. The install command below applies after the release's registry verification. Before publication, use the verified local tarball described in [release preparation](docs/release.md).

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

Render only one active Modal. Give Modal `labelledBy` the unique id used by its DialogHeader, plus `initialFocusRef` and `onClose`. Supply a `fallbackFocusRef` when the opener can disappear. ConfirmDialog generates its title id and requires `cancelLabel`, `confirmLabel`, and `pendingLabel`; the caller owns its language, busy state, and operation. Keep ConfirmDialog in one persistent application root. Independent Preact roots can generate colliding ids; use manually named Modal headings if your page needs cross-root id coordination.

See [all props and examples](docs/api.md), [the full token table](docs/tokens.md), and [visual acceptance results](docs/visual-acceptance.md).

## Size and limits

The installed archive was checked with the locked Preact `10.29.8` and minimum peer `10.27.0`. The full consumer imports all components and four CSS files. The Button-only consumer imports Button, `theme.css`, and `styles.css` and builds separately.

| Preact | Full JS raw / gzip bytes | Button-only JS raw / gzip bytes | Full CSS raw / gzip bytes | Button-only CSS raw / gzip bytes |
| --- | ---: | ---: | ---: | ---: |
| 10.29.8 | 89,105 / 33,979 | 20,545 / 8,234 | 16,770 / 3,506 | 13,841 / 3,185 |
| 10.27.0 | 89,041 / 34,004 | 20,435 / 8,237 | 16,770 / 3,506 | 13,841 / 3,185 |

These measured baselines count emitted JS/CSS buffers, exclude source maps, and sum each emitted file's bytes and Node `gzipSync` result with default options. They include Preact's consumer runtime and are not package-only transfer sizes. The library's unminified `index.js` is 72,152 raw / 25,514 gzip bytes; `styles.css` is 9,866 / 2,160 and `theme.css` is 4,743 / 1,238. The common component stylesheet remains in the Button-only build, including unused components' CSS. Its JavaScript has no live Modal, ConfirmDialog, Icon, or SVG catalog mappings. No arbitrary size limit is enforced.

Preact remains external to the library, and each isolated consumer resolves its Preact subpaths from one installed copy. CVA and clsx are bundled and need no separate consumer dependencies. The verifier checks strict declarations, closed private subpaths, licenses, source maps, and real installed package contents.

Only one Modal may be active, and portals use the root theme. Nested themes, ThemeProvider, application layouts, routing, and business state are outside version 0.1.0. Forced-colors and reduced-motion CSS rules exist, but their manual Windows acceptance is still pending. DOM tests and the checked light/dark gallery do not establish those results. See [the pending Windows checks](docs/visual-acceptance.md#pending-windows-checks).

## Development

Use Node 24 and `npm ci`. `npm run dev` builds the library and starts the gallery at `http://localhost:5173`. The pages are `/index.html` for full CSS, `/minimal.html` for theme/styles only, and `/green.html` for the Xbox DNS overrides. Rebuild or restart after editing library sources; the gallery imports built library artifacts.

`npm run check` runs typecheck, lint, format checks, behavior tests, release tests, and notices checks. The individual commands remain available. Gallery sources participate in type and format checks.

Run `npm run build` before `npm run build:gallery`; the gallery consumes the existing library `dist` and writes all three HTML entries to `.gallery-dist`. Finish both builds before `npm run test:package:all`, which packs once and verifies the same archive with the locked Preact version and minimum peer `10.27.0`. These commands are the CI checks. `npm run test:package -- --tarball <absolute-path> --preact 10.27.0` remains available to verify an existing archive independently. Without `--tarball`, `test:package` packs the existing build and checks one peer.

Push/PR workflows retain the archive, checksum, and size reports. The release workflow repeats these checks and publishes the verified file through npm OIDC after tag/version and repository metadata guards. See [release setup and registry verification](docs/release.md).

The MIT license covers this project's code. Fluent icon attribution and licensing are in [THIRD_PARTY_NOTICES.txt](THIRD_PARTY_NOTICES.txt) and [licenses/fluent-system-icons.txt](licenses/fluent-system-icons.txt).
