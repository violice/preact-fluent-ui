# Styling engine first delivery

Branch: `feat/styling-engine-prototype`. User revisions replace Box with css()/css.props() and require complete removal of standalone clsx/CVA. No push, publication or consumer application migration.

## Implemented

- `css()` emits deterministic atomic class strings through a custom WyW processor; `cx()` composes equivalent property/selector/condition identities while retaining foreign classes.
- `css.props()` lowers explicit objects before extraction. Static declarations remain CSS; dynamic strings, numbers and signals become local variables in `{ class, style }`. Expressions evaluate once in source order. Supported dynamic shorthands expand into separate longhand variables. Null/undefined omit variables. Nested selectors/conditions work; spreads, computed keys and dynamic object shapes reject.
- `cva()` and `sva()` extract every variant and compound branch. Runtime selectors preserve defaults, null suppression, boolean selection and ordered compounds. `RecipeVariant` and `RecipeVariantProps` infer required/optional selections.
- Config supports presets, category replacement, deep extension, alias validation, conditional semantic tokens and partial named palettes. Generated bindings expose typed token paths. Native `@scope` handles nested palettes, independent modes and custom parent semantic conditions. Unrelated conditional values remain inherited.
- Optional build-only `./vite` and `./config` entries are separated from browser `./styling` and component entries. Existing CSS assets remain explicit imports. Config changes regenerate bindings through a dev-server restart.
- Button, Field, InfoBar and StatusBadge use the engine recipes. Their public props/accessibility behavior is retained. Box source, exports, contracts and current examples are removed. Legacy class joining delegates to cx; clsx and class-variance-authority are absent from dependencies and bundles.

## Evidence

Toolchain: Node 24.15.0, Vite 8.3.1, WyW Vite 2.5.1 / processor-utils 2.5.0.

Final validation: `npm run build`; `npm run check` (387 tests, 2 release tests, type/lint/format/notices); `npm run test:package:all` (both Preact versions plus compiled styling consumer); `npm run build:gallery` (41 pages and 404); `npm run test:gallery-artifact` (11 tests). `npm ls clsx class-variance-authority --all` reports an empty graph. The suite includes real Vite production extraction, imported constants, dependency rebuilds, Preact TSX, recipe runtime branches, signal updates, dynamic units/evaluation count, aliases, catch/loop/hoisted-var/switch shadowing, switch discriminant scope, custom output directories and explicit spread rejection. Reviewer findings were reproduced as failing regression tests before correction.

The packed consumer uses the installed npm archive outside the repository: public compiler/config entries, generated imports, static/dynamic CSS, cva/sva, inferred recipe types, invalid token/variant/slot diagnostics and a second configuration rebuild. It checks compiler dependencies are absent from emitted browser JS. Ordinary packed consumers are built against the locked and minimum Preact versions without installing WyW. Artifact graphs separately assert browser entries cannot reach compiler/config modules.

Real T3 collaborative browser checks:

- Mode/palette fixture computed colors: dark `rgb(17,17,17)`, green in dark `rgb(17,34,51)`, light inside green `rgb(221,255,221)`, blue inside light `rgb(221,221,255)`, dark inside blue `rgb(17,34,68)`, same-element dark/green `rgb(17,34,51)`.
- Custom parent semantic condition: default root `rgb(17,17,17)`; descendant, nested and same-element green roots `rgb(17,34,51)`. Unrelated dark semantic background remained blue.
- Gallery css.props range changed computed width from `220px` to `300px` and updated only its local width variable. A temporary source change of gap from token 4 to 6 applied `16px → 24px` through HMR while width remained `300px`, confirming delivery and state preservation. Source was restored.
- Migrated Button variants produced distinct expected default/primary/subtle/disabled computed backgrounds. Existing behavioral tests cover loading/disabled guards and Field ARIA/IDs/slots.

## Limits and follow-up

This is a first engine implementation, not complete Panda API parity. CSS object types currently accept arbitrary property strings; generated token paths and recipe variants are typed, but property-specific token categories are not exhaustively typed. Unitless properties and normalized shorthands are an explicit supported set. Known unexpanded shorthand/longhand overlaps reject; additional shorthand families require expansion or conflict metadata.

Mixed logical/physical spacing in the same selector/condition is rejected instead of guessing overlap in RTL/writing modes. Ordinary JSX class/style precedence still applies; callers compose returned classes with cx and explicitly merge style objects.

Native CSS `@scope` support is required for independent nested theme modes. Portals inherit their destination’s theme; no ThemeProvider or portal synchronization is added. Plain components require no compiler. Untransformed compile-time calls throw.

Diagnostic filenames and sourcemaps are available; exact line/column accuracy remains unverified. There is no comprehensive before/after visual baseline, and native Windows forced-colors acceptance remains pending. Browser keyboard automation was unavailable for the final manual interaction attempt; keyboard behavior is covered by existing automated component tests, not claimed as additional browser evidence.
