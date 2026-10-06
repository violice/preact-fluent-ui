# Styling engine implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved WyW-based styling foundation with Panda-like tokens/themes, cva/sva and automatic dynamic css.props.

**Architecture:** A shared schema and build-time processors emit atomic CSS and compact runtime selectors. The package ships explicit CSS and compiled components; an optional consumer Vite integration compiles user-authored styles and dynamic css.props. Existing CSS Modules coexist during migration.

**Tech stack:** TypeScript, Preact, WyW-in-JS, Vite 8/Rolldown, Vitest, existing Node artifact checks.

**Spec:** `docs/superpowers/specs/2026-10-06-styling-engine-design.md` (approved 2026-10-06).

## Global constraints

- API names: css, cx, token, cva, sva, RecipeVariant, RecipeVariantProps; configuration helpers: defineConfig, definePreset.
- Preserve explicit theme/styles/reset/native-controls CSS exports, external Preact and safe Node imports.
- No runtime stylesheet injection or automatic browser theme selection.
- User revision: remove Box. Preserve dynamic values through css.props-generated local variables; no Box JSX extractor.
- Conditional semantic tokens accept scope selectors and at-rules, not element interaction states.
- All declared cva/sva branches compile even when their selections are runtime values.
- Compiler/config code must not enter browser bundles. No application migration, publication or push is part of this plan.
- At completion, no clsx or class-variance-authority dependency, production import or bundled module remains.
- Existing public CSS variable names and component props remain compatible.
- Work in an isolated workspace at execution time. Commit independently verified tasks; do not change versions or publish a release.

## Review focus

- JSX spreads and explicit class/style props retain normal evaluation and precedence; css.props lowers only its explicit style object (Task 6).
- A nested brand inherits the outer mode but must not accidentally inherit outer primitive aliases (Tasks 3 and 8).
- A shorthand overridden by one longhand must retain other sides, including RTL logical properties (Tasks 2 and 8).
- Different application configurations must not share stale class/token output through compiler caches (Tasks 5 and 7).
- Recipe props may explicitly be null, false or undefined; defaults and compounds must use resolved values consistently (Task 4).

## File map and boundaries

New `src/styling/` holds browser-safe types, class metadata/composition, selectors and public compile-time stubs. New `src/styling/config/` holds configuration and the Fluent preset. New `src/styling/compiler/` holds WyW processors, token/theme generation, JSX extraction and Vite integration. Each processor and major responsibility has its own file.

New `tests/styling-consumer/` holds build fixtures with a dedicated Node test runner, separate from jsdom tests. `src/styling/**/*.test.ts` contains focused unit tests; compiler tests select the Node environment explicitly. Compiler/config declarations and exports are split from browser entrypoints through multi-entry build output.

Modify `package.json`, `vite.config.ts`, `vitest.config.ts`, `tsconfig.build.json`, `scripts/build-css.mjs`, `scripts/check-dist.mjs` and package fixture tooling only as their owning task requires. Remove Box in Task 6; migrate Button and Field in Task 8. Keep `src/utils/merge-classes.ts` compatible during early tasks; replace its implementation with an engine adapter in Task 9.

## Task 1: Prove WyW integration with the current toolchain

**Status:** Prototype verified on 2026-10-06; see `docs/superpowers/reports/2026-10-06-styling-prototype.md`. File-level diagnostics pass; precise line/column, browser HMR delivery and source-map accuracy remain explicitly unverified. Execution authorization covers this task only.

**Files:** Create `src/styling/compiler/prototype.test.ts`, `tests/styling-consumer/prototype/{entry.ts,vite.config.ts}`, `docs/superpowers/reports/2026-10-06-styling-prototype.md`; modify package/lockfile only for verified build dependencies.

**Interfaces:** Produces a documented working WyW processor registration and transform sequence for Vite 8, or a blocking incompatibility report. Prototype internals are not public API.

- [x] Write a Node integration fixture using a minimal custom processor: a static object with an imported constant emits a class and CSS; an unbound runtime expression produces a source-located diagnostic. Assert two clean builds produce identical CSS/class names and contain no processor implementation in browser JS.
- [x] Run `npx vitest run src/styling/compiler/prototype.test.ts`; confirm the first run fails for missing integration rather than an unrelated environment error.
- [x] Check official WyW package/API compatibility, select and pin a compatible release in the lockfile, implement the smallest processor and Vite fixture. Rebuild after changing the imported constant and verify CSS invalidation. Exercise the same sequence in Vite development mode.
- [x] Run the focused test and `npm run build`; record actual versions, registration API, transform ordering, dev/build behavior and artifacts in the report.
- [x] Stop if Vite 8/Rolldown or dependency isolation cannot pass. Do not silently replace WyW or downgrade the project's toolchain; report the failing evidence for a design revision. Otherwise commit `build: validate WyW styling integration`.

## Task 2: Define atomic normalization and composition

**Files:** Create `src/styling/{types.ts,properties.ts,normalize.ts,class-metadata.ts,cx.ts,index.ts}`, and `normalize.test.ts`, `cx.test.ts` alongside implementations.

**Interfaces:** `normalizeStyles(style: StyleObject, context: StyleContext): NormalizedDeclaration[]`; `NormalizedDeclaration` records CSS property/value, canonical selector, condition and layer. `compileDeclarations(declarations): { className: string; css: string; metadata: ClassMetadata[] }` lives in `compiler/atomic.ts`. `cx(...values: ClassValue[]): string` merges known classes; ClassValue accepts strings, false, null, undefined and nested arrays. The legacy mergeClasses adapter resolves signals before calling cx; cx itself need not subscribe to signals. Metadata is emitted as module-local serialized data and registered without DOM access by `class-metadata.ts`.

- [ ] Write tests asserting `padding: '16px'` plus `paddingLeft: '4px'` retains top/right/bottom; margin logical/physical combinations preserve CSS behavior in LTR and RTL; unitless flex/order are not suffixed; selector/condition mismatches do not cancel each other; foreign class strings survive unchanged; identical declarations deduplicate.
- [ ] Run `npx vitest run src/styling/normalize.test.ts src/styling/cx.test.ts` and observe meaningful failures.
- [ ] Implement explicit property tables and shorthand expansion for Box-supported properties and properties used by Button/Field. Generic valid CSS properties without ambiguous shorthands may pass through. Reject unsupported shorthands in conflict-sensitive composition with a property-specific diagnostic. Preserve logical versus physical declarations rather than equating them blindly.
- [ ] Add `compiler/atomic.ts` with stable content-derived identifiers and declared cascade-layer ordering; add tests for deterministic output, hash collision detection and override precedence across layers. Metadata conflict resolution is limited to equivalent selectors/conditions and documented layer precedence, not string order alone.
- [ ] Run focused tests and `npm run typecheck`; commit `feat: add atomic style normalization and composition`.

## Task 3: Configuration, tokens and scoped themes

**Files:** Create `src/styling/config/{types.ts,define-config.ts,define-preset.ts,resolve-config.ts,fluent-preset.ts,index.ts}`, `src/styling/compiler/{tokens.ts,themes.ts,generate-bindings.ts}`, `src/styling/token.ts`; tests `config/resolve-config.test.ts`, `compiler/tokens.test.ts`, `compiler/themes.test.ts`. Read `src/styles/theme.css` for compatibility mappings before designing the preset.

**Interfaces:** `defineConfig<const T extends StylingConfig>(config: T): T`, `definePreset<const T extends StylingPreset>(preset: T): T`; `resolveConfig(config): ResolvedConfig`; `generateThemeCss(config: ResolvedConfig): string`; `generateBindings(config, outputDirectory): Promise<void>` emits typed consumer bindings. The Fluent preset supplies existing variables, default palette/mode selectors and compatibility aliases. `token.var(path: TokenPath): string` reads the generated variable-reference table and never computes browser values.

- [ ] Write tests for preset order, category replacement, deep extension and replacing arrays; assert overriding one gray token keeps siblings, aliases resolve in borders, cycles and missing paths report their full path. Assert theme overrides reject new unknown paths and preserve inherited defaults.
- [ ] Run the three focused test files and observe failures.
- [ ] Implement config resolution and alias validation. Extract the current palette into the preset without changing values or existing selector behavior. Compile tokens to existing names where mapped and namespaced paths otherwise. Emit a complete resolved palette at every explicit brand scope; semantic aliases are redeclared at every theme/mode root.
- [ ] Add theme fixtures for same-element attributes, nested brand within dark mode, nested light mode within dark, and sibling themes; generate required selectors for roots and descendants. Generate `styled-system/` bindings from the resolved config, including css/cva/sva wrappers and token types, importing runtime helpers from the package styling entry. This directory is consumer-owned and ignored by git; integration errors explain how to generate it.
- [ ] Run focused tests and `npm run typecheck`; add type fixtures proving a misspelled token and invalid semantic hover condition are rejected, while a custom extended token is accepted. Commit `feat: add preset tokens and scoped themes`.

## Task 4: cva/sva selectors and inferred variant types

**Files:** Create `src/styling/{recipe-types.ts,recipe-runtime.ts,cva.ts,sva.ts}`, `src/styling/compiler/{cva-processor.ts,sva-processor.ts}`; tests `recipe-runtime.test.ts`, `compiler/recipes.test.ts` and `tests/styling-consumer/types/variants.ts`.

**Interfaces:** Public `cva<const D extends CvaDefinition>(definition: D): CvaFunction<D>` and `sva<const D extends SvaDefinition>(definition: D): SvaFunction<D>` are compile-time APIs replaced by selectors. `createCva(compiled: CompiledCva): CvaFunction`, `createSva(compiled: CompiledSva): SvaFunction` are browser-safe factories. `RecipeVariant<T>` has required branch selections; `RecipeVariantProps<T>` has optional selections with null/undefined. Definitions use base, variants, compoundVariants, defaultVariants; sva additionally requires slots.

- [ ] Write tests: omitted/undefined size resolves default, null suppresses it, false selects the false branch, compound arrays match accepted values, all predicates must match, later compounds override earlier ones, sva returns every declared slot, unknown slots fail compilation. Assert untyped invalid values throw in development and are ignored in production.
- [ ] Run `npx vitest run src/styling/recipe-runtime.test.ts src/styling/compiler/recipes.test.ts` and observe failures.
- [ ] Implement selectors and definition processors using Tasks 2–3. Emit every declared branch regardless of call sites. Preserve selection order and use cx metadata for conflicts; reuse semantics between cva/sva without forcing callers to handle slots for single-part recipes.
- [ ] Add type assertions for boolean branches, required/optional selections and typo rejection in both APIs. Test an application which picks an otherwise unused variant at runtime and still has its CSS.
- [ ] Run focused tests, type fixtures and `npm run typecheck`; commit `feat: add cva and sva recipes`.

## Task 5: Production css processor and Vite integration

**Files:** Create `src/styling/css.ts`, `src/styling/compiler/{css-processor.ts,vite.ts,index.ts}`, tests `compiler/css.test.ts`, `compiler/vite.test.ts`; modify library Vite/Vitest config for the production integration.

**Interfaces:** `css(style: StyleObject, ...overrides: StyleObject[]): string` compiles to class composition; `fluentStyles(options: { configFile: string; outdir?: string }): Plugin[]` is the Vite export. Default generated output is project-relative `styled-system/`. The generated bindings expose configuration-specific types while published library declarations remain self-contained.

- [ ] Write tests compiling token names, composite aliases, imported static constants, media conditions and nested selectors. Assert raw values pass through and token names take precedence in their category; an untransformed css/cva/sva call throws a descriptive compilation-required error. Assert configuration A and B with different token catalogs cannot reuse incorrect cached output.
- [ ] Run focused tests and observe failures.
- [ ] Replace the Task 1 prototype registration with production processors. Generate bindings before dependent modules are compiled; invalidate the configuration and its dependency graph on changes. Install integration before Preact transformation, preserve sourcemaps and serve generated CSS through Vite dev/HMR and build assets.
- [ ] Configure library tests to compile style definitions and exercise both dev and production fixtures. Assert editing a token updates emitted CSS and types without requiring a clean manual rebuild. Prototype fixtures remain as regression tests against integration changes.
- [ ] Run focused tests and `npm run build`; commit `feat: integrate styling compiler with Vite`.

## Task 6: Dynamic css.props and Box removal (user revision)

**Files:** Create `src/styling/{style-props.ts,style-props.test.tsx}`, `src/styling/compiler/dynamic.ts`; modify css types, integration fixtures, library exports, gallery and consumer contracts. Remove Box source, CSS and tests.

**Interfaces:** css.props(object) returns `{class, style}`. The early pass lowers dynamic leaves to variable references consumed by the common css processor; the browser helper resolves signals and numeric units. Import aliases and lexical shadows must be respected.

- [ ] Test dynamic width with px, unitless opacity, signals, null, token values, nested responsive leaves and expression evaluation order.
- [ ] Verify missing transformation fails before implementation, then implement binding-aware lowering with sourcemaps. Reject spreads/dynamic shapes/computed keys/methods rather than silently omitting them.
- [ ] Remove Box exports/source/gallery/API contracts and replace its examples with css()/css.props() on semantic elements. Document the breaking change and ordinary JSX class/style merge precedence.
- [ ] Run integration, signal, gallery, type and package checks; commit `feat: replace Box with compiled dynamic style props`.

## Task 7: Package boundaries and packed consumers

**Files:** Modify `package.json`, `vite.config.ts`, `tsconfig.build.json`, `scripts/build-css.mjs`, `scripts/check-dist.mjs`, `scripts/test-package.mjs`; create `tests/styling-consumer/{package.json,run.test.mjs,plain.tsx,compiled.tsx,styling.config.ts,vite.config.ts,tsconfig.json}` and secondary config fixtures.

**Interfaces:** Exports `./styling` (browser-safe), `./config`, `./vite`; exported compiled Fluent preset from config entry. Existing CSS assets retain their public paths; generated component/utility CSS is included in styles.css and generated preset variables in theme.css. Consumer-generated CSS is a separate Vite-managed asset. Entry modules do not import CSS automatically.

- [ ] Add packed tests for plain consumers with no WyW installed: library imports and shipped variants/themes work, existing CSS imports resolve, and dynamic css.props values render. Compiled consumer tests import generated bindings and exercise custom tokens, css/cva/sva, responsive css.props and alternate theme config.
- [ ] Run `node --test tests/styling-consumer/run.test.mjs` and confirm missing exports fail.
- [ ] Implement multi-entry ESM output and declarations; update artifact graphs to check every entry separately. Compiler dependencies may appear only in build-only entries. Assert compiler/config entries are not transitively reachable from root/styling browser entries, Preact stays external, and cold/DOM-trapped Node imports work.
- [ ] Verify two packed consumer builds with distinct configs and generated directories produce independent output; stale generated types cannot silently accept removed tokens. Integrate the fixture runner into existing package validation without weakening existing consumers or peer-version coverage.
- [ ] Run `npm run build`, `npm run test:package:all` and `node --test tests/styling-consumer/run.test.mjs`; commit `build: ship styling exports and validate consumers`.

## Task 8: Migrate representative components and document usage

**Files:** Modify `src/components/{button.tsx,button.module.css,field.tsx,field.module.css}`, relevant component tests, `README.md`, `CHANGELOG.md`; create `src/components/{button.styles.ts,field.styles.ts}`, gallery styling example under `examples/gallery/src/`, and `docs/superpowers/reports/2026-10-06-styling-acceptance.md`.

**Interfaces:** Button uses the new cva while preserving variant default/primary/subtle/danger and size default/compact/icon. Field uses sva slots root/label/hint/validation/required and retains its existing classes API and validation-state behavior. All current consumer props remain unchanged.

- [ ] Read the full existing Button/Field CSS and add only missing behavioral/visual acceptance cases. Preserve disabled/loading activation, Field IDs/aria relationships, custom slot classes, hover/focus and forced-colors rules. Record the pre-migration gallery render for comparison.
- [ ] Run the current Button/Field tests before migration, then add assertions for generated style output and theme switching; demonstrate failures only for new expected integration behavior.
- [ ] Move styles into cva/sva definitions, retaining exact current values/selectors. Keep difficult legacy rules in CSS Modules if the compiler does not yet support them; document each retained rule. Remove the old CVA import from Button; retain the dependency until Task 9 migrates all remaining production consumers.
- [ ] Add gallery examples and README sections for plugin-free usage, compiler setup, tokens/presets/extend, conditional semantic tokens, brand scopes, cva/sva/types and dynamic scalar limitations. Check code samples in the compiled consumer fixture.
- [ ] Use the T3 collaborative preview to verify same-element/nested brand and modes, responsive widths, dynamic variables, shorthand overrides in LTR/RTL and Button/Field keyboard states. Assert computed styles for scope cases rather than relying solely on screenshots. Record browser evidence and any target-runtime limits.
- [ ] Run `npm run check`, `npm run build`, `npm run test:package:all`, the styling consumer runner and gallery build. Update license notices for introduced dependencies and rerun notices checks. Commit `feat: adopt styling recipes in Button and Field`.

## Task 9: Remove standalone clsx and class-variance-authority

**Files:** Modify `src/components/{info-bar.tsx,status-badge.tsx}`, create adjacent `info-bar.styles.ts` and `status-badge.styles.ts`; modify `src/utils/{merge-classes.ts,merge-classes.test.ts}`, `package.json`, lockfile, `scripts/{check-dist.mjs,test-package.mjs,generate-third-party-notices.mjs}`, `THIRD_PARTY_NOTICES.txt` and generated license files. Remove obsolete component CSS only after equivalent styles are migrated.

**Interfaces:** Every production recipe uses the engine cva/sva. `mergeClasses(...classes: JSX.Signalish<string | undefined>[]): string` remains a compatibility adapter that resolves signal values and delegates to engine cx. Foreign CSS Module classes remain supported; their unknown declarations are not automatically merged. The engine runtime has no dependency on clsx or class-variance-authority.

- [ ] Inventory all remaining imports and add assertions that final module graphs and browser bundles contain neither helper. Preserve mergeClasses tests for signal values, empty input and foreign class strings. Add regression cases for InfoBar intent and StatusBadge variants before migration.
- [ ] Run focused component/helper tests and artifact checks; existing behavior must pass while the new absence checks fail on the current dependencies.
- [ ] Migrate InfoBar and StatusBadge recipes to engine cva with unchanged public props, visual defaults and accessibility. Replace clsx usage in mergeClasses with the signal-resolving cx adapter. Do not rewrite every existing class call site solely to remove the adapter.
- [ ] Remove both direct dependencies through the package manager. Check transitive reachability with `npm ls clsx class-variance-authority --all`; expected no installed nodes. If new tooling reintroduces either transitively, choose a compatible dependency arrangement that satisfies removal rather than deleting lockfile entries manually.
- [ ] Replace check-dist/test-package positive expectations for bundled helpers with negative expectations. Extend source-map/module allowlists for actual engine modules narrowly rather than accepting arbitrary sources. Regenerate notices: remove helper license artifacts only when no longer applicable and add real build/runtime notices according to the repository's existing license policy.
- [ ] Run focused tests, `npm run check`, `npm run build`, `npm run test:package:all` and the styling consumer runner. Search production sources and emitted JS for helper imports and inspect module graphs for bundled helper code. Commit `refactor: replace clsx and CVA with styling engine`.

## Completion and handoff

- [ ] Self-review each task against the approved spec, especially compiler-free consumers, theme scope inheritance and class merge limits.
- [ ] Obtain final code review using the selected execution method; fix material findings and rerun affected checks. Do not claim support for inputs excluded by the spec.
- [ ] Report commits, validated toolchain versions, artifact/browser evidence and remaining limitations. Do not publish, push or migrate applications unless separately requested.

## Plan self-review

Coverage: tokens/presets/themes/types → Task 3; cva/sva → Task 4; atomic composition → Task 2; WyW/Vite → Tasks 1 and 5; css.props/Box removal → Task 6; distribution → Task 7; migration/docs/browser verification → Task 8; full clsx/CVA removal and artifact checks → Task 9. All five Review Focus cases have explicit tests in their owning tasks. Shared signatures are defined once in Interfaces blocks. The Task 1 stop condition prevents speculative toolchain compatibility from becoming an assumption in later work.

Execution is not started by writing this plan. Review the plan and select inline execution or task-by-task delegated execution before implementation.

Implementation rulings: class names encode property/context identity without a runtime registry; mixed physical/logical spacing is rejected. User revisions supersede prior hybrid Box requirements and authorize css.props automatic local variables.


## Delivery status (2026-10-06)

The user authorized continuing beyond the feasibility prototype, then replaced hybrid Box with css()/css.props(). Implementation is consolidated into the first engine delivery rather than the original per-task commit sequence. Tasks 2–9 have working implementations and integration checks; file boundaries were combined where they share one responsibility (one recipe processor/compiler, token/theme generation together). The acceptance report records validation and remaining limits; unchecked historical substeps are not an assertion of full Panda API parity.

See [acceptance report](../reports/2026-10-06-styling-acceptance.md). Class identity is encoded in names instead of runtime registration. Compiler-generated dynamic shorthands use independent longhand variables. Precise positional diagnostics, exhaustive CSS property/token typing and broader shorthand support remain follow-up work.
