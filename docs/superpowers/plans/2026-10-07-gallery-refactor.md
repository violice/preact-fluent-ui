# Gallery refactor implementation plan

Goal: preserve the existing gallery, URLs, prerender, accessibility and appearance while splitting initialization, shell components, routes, examples and reactive state; use the library styles engine for all gallery styles.

Architecture: app owns browser/prerender initialization and shell composition; components owns navigation, appearance dialog and documentation primitives; routes owns routing helpers and page registry; examples owns demo families; state owns signals, settings and context; styles owns named engine style maps and generated theme configuration. No compatibility files for moved modules.

- [x] Replace CSS Modules and handwritten theme CSS with engine css() maps and configured theme generation. Preserve selectors, conditions and values; keep dynamic theme custom properties as runtime data.
- [x] Convert demo state to useSignal/useComputed with direct signal writes; keep refs and effects for DOM lifecycle.
- [x] Extract shell navigation, appearance dialog and route rendering; move modules into owned directories and update imports/tests/build scripts.
- [x] Replace static inline style objects with css(); retain dynamic css.dynamic and intentionally demonstrated inline-style API examples.
- [x] Verify full checks, gallery build/prerender/artifact tests and inspect final structure; review changes independently.
