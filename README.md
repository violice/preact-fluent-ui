# Preact Fluent UI

`@violice/preact-fluent-ui` is an independent Fluent-style component library for Preact. It is not an official Microsoft package or a native WinUI wrapper. It requires Preact `^10.27.0` and an ESM build setup that handles CSS imports.

## Links

- [Live gallery](https://violice.github.io/preact-fluent-ui/) with interactive examples and component documentation.
- [npm package](https://www.npmjs.com/package/@violice/preact-fluent-ui) with published versions.
- [Usage guide](docs/usage.md) for component composition and styles.
- [API reference](docs/api.md) for props, refs and accessibility.
- [Theme tokens](docs/tokens.md) for colors, typography and spacing.
- [Gallery documentation](docs/gallery.md) for navigation, examples and appearance settings.
- [Changelog](CHANGELOG.md) for release changes.

## Installation

```sh
npm install @violice/preact-fluent-ui preact
```

```tsx
import { Button, Card } from '@violice/preact-fluent-ui/components';

export function Example() {
  return <Card><Button variant="primary">Save</Button></Card>;
}
```

Add the styles plugin before the Preact plugin in `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { fluentStyles } from '@violice/preact-fluent-ui/vite';
import { fluentPreset } from '@violice/preact-fluent-ui/config';

export default defineConfig({
  plugins: [fluentStyles({ config: { presets: [fluentPreset] } }), preact()],
});
```

Start Vite to generate `styled-system/` at the project root. Import the CSS once
from `src/main.tsx` with `import '../styled-system/styles.css'`. Document reset
and native control styles are enabled by default. Import style helpers using
the generated module's path relative to your source file:

```ts
import { css, cx, token } from './styled-system/css';
```

See [styles setup](docs/styles.md) for plugin configuration.

JavaScript imports do not load CSS. The generated `styles.css` includes theme tokens, component styles, and the configured reset and native control rules. System fonts are used without distributing font files.

## Styles engine

Use `css()` for compiled classes, `css.dynamic()` for dynamic values and `cva()` / `sva()` for recipes. Box has been removed; apply styles to a native element or an existing component. See [the styles guide](docs/styles.md) for compiler setup, tokens and scoped themes. Components ship precompiled rules; the Vite plugin assembles them with your theme and configuration. Application style functions are compiled from the generated module.

## Limitations

Only one Modal may be active, and portaled dialogs use the root theme. Scoped themes use data attributes; there is no ThemeProvider. The application owns layout sizing, responsive navigation, routing and business state.

`styles.css` includes all component styles, even when you import only one component. Preact is a peer dependency. Class composition and recipes use the library’s own styles engine.

Forced-colors and reduced-motion CSS rules are included, but manual Windows verification is still pending. See [the pending Windows checks](docs/visual-acceptance.md#pending-windows-checks).

The [live gallery](https://violice.github.io/preact-fluent-ui/) uses the latest stable release from npm.

## Development

Use Node 24 and `npm ci`. `npm run dev` builds the library and starts the gallery at `http://localhost:5173`. Rebuild or restart after editing library sources; the gallery imports built library artifacts.

Run the checks on a clean checkout:

```sh
npm run build
npm run build:gallery
npm run check
npm run test:package:all
npm run test:gallery-artifact
npm run test:gallery-preview
```

Build the library and gallery before checking: gallery compilation generates the style bindings required by typecheck. `check` runs type, lint, formatting, test, and license checks. `test:package:all` verifies the packed library with the locked and minimum supported Preact versions, then checks the packed styles compiler in a separate consumer.

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
