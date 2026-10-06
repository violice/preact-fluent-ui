# Component style engine migration

All production component and icon CSS Modules have been removed. Styles now use `css`, `cva` and `sva`; component families have colocated recipes, helpers and tests, with one component per TSX file. Package root exports, props, refs and `resolveClass` precedence remain intact.

`sva` adds stable slot markers and resolves `$slot` selector references. Top-level keyframes are emitted into CSS; scoped definitions are rejected. Tooltip and Sidebar hints use `css.dynamic` for measured geometry. Optional reset/native-control CSS now has explicit layers below utility styles, with order declared before every generated utility stylesheet.

Independent review found two important regressions, both fixed:

- Components retain public Fluent variables for local overrides. Configured semantic themes emit bridges to those variables; default aliases do not form cycles. The bridge regression test failed before the fix, then passed. Browser probes confirmed purple local Card/Tooltip text, pink Tooltip surface and green configured-theme Card text.
- Animation edits can reuse a name across compiler generations. A test reproduced the old process-global rejection, then passed after removing persistent keyframe-name validation. Authors must choose distinct animation names across unrelated definitions.

Validation completed:

- Full check: typecheck, lint, formatting, 402 tests, release checks and licenses.
- Library build and artifact checks; packed consumers against locked and minimum Preact; Button-only tree shaking and compiled styling consumer.
- Gallery build: 41 pages and 404; 11 gallery artifact tests.
- Browser comparison: 2,976 computed property values across Table, Checkbox, Sidebar, Spinner, Card, Disclosure, Text and LoadingState. Differences were renamed animation identifiers and restored Button semibold text/related widths after correcting reset precedence. Other sampled values matched.
- Additional browser probes covered unpadded Card at 560px, compact Table cells and final divider, Checkbox sibling-state styles, Spinner duration and Tooltip local theme colors/geometry.

Decisions and limits:

- TextPreview/CodeBlock retain the native style adapter because `wrap` previously overrode object and string styles. This leaves one owned inline declaration to preserve that contract.
- Sidebar horizontal footer uses logical block-start margin to satisfy spacing composition rules. Horizontal writing modes and RTL retain their layout; vertical writing modes can differ.
- Reset and native controls have lower priority than normal engine utilities. Unlayered application styles still override normal utilities.
- The all-page gallery DOM test has a 15-second timeout because its expanded atomic class lists exceeded five seconds; assertions are unchanged.
- Browser checks are representative computed-style/state checks, not an exhaustive pixel or forced-colors matrix.
