# Styling engine for Preact Fluent UI

Status: proposed design, awaiting review of this document. The user approved the conversational direction; implementation is not yet authorized by a reviewed spec and plan.

## Purpose

Provide a shared styling foundation for the UI library and consumer applications. Preserve the convenient Box layout-prop API while moving fixed styles into generated CSS. Support typed tokens, scoped themes, variants, compound variants and recipes from the outset.

The selected direction is a hybrid engine using WyW-in-JS for build-time evaluation and extraction. It must preserve the current package's explicit CSS imports, Preact externalization and safe Node imports. Existing CSS Modules can coexist during migration.

## Public surface

Proposed exports are `css`, `cx`, `defineTokens`, `defineThemeContract`, `createTheme`, `recipe`, `slotRecipe` and `RecipeVariants` under a styling subpath. A separate Vite subpath exposes the compiler integration. Export names are part of this proposal, not existing APIs.

`css(styleObject)` returns an opaque class string after compilation. Style objects support typed CSS properties, token references, nested selectors and configured conditions. Numeric lengths follow existing Box conventions; unitless properties remain unitless. Token references are symbolic CSS-variable references, not theme values evaluated at runtime.

`cx` merges engine-generated classes using metadata about property conflicts and conditions. External class strings are retained verbatim; their declarations cannot be inferred. Class order alone does not promise precedence over external CSS.

## Tokens and themes

`defineTokens` declares primitive token values. `defineThemeContract` declares the shape of semantic tokens independently from their values. `createTheme(contract, values)` produces a theme class and scoped CSS custom-property declarations.

Every theme must satisfy the full contract. Token aliases must resolve without cycles; unknown references and cyclic aliases are build errors. Names are deterministic and namespaced to avoid collisions between packages. Existing public variables such as `--space-4` retain their names through an explicit compatibility mapping.

Components use semantic tokens for theme-dependent colors. Themes switch through a container class and may be nested. The engine does not read browser preferences or select a theme implicitly. Theme switches update variables, not component class generation. Users can override documented variables through ordinary CSS without importing compiler code.

Example API:

```ts
const tokens = defineTokens({ spacing: { 4: '16px' } });
const theme = defineThemeContract({ colors: { surface: null, text: null } });
const lightTheme = createTheme(theme, {
  colors: { surface: '#ffffff', text: '#171717' },
});
```

## Recipes

`recipe` accepts `base`, `variants`, `compoundVariants` and `defaultVariants`. It returns a small runtime selector over precompiled classes. All explicitly declared variant branches and compound styles are emitted, including branches selected only by runtime props. There is no requirement to discover every recipe invocation in consumer code.

Variant keys and values infer TypeScript types. Boolean branches support `true` and `false`. An omitted or undefined variant uses its default; null explicitly suppresses the default. Unknown values are type errors and produce descriptive errors in development for untyped callers. Production ignores an unknown branch rather than generating CSS.

Compound predicates match all their specified variants against resolved selections. A predicate may list several accepted values. Matching compounds apply in declaration order. Precedence is base, selected variants in definition order, then matching compounds. `cx(recipe(selection), css(overrides))` applies engine overrides last for equivalent property/condition declarations.

`slotRecipe` shares these semantics but returns a map of class strings for declared slots. Base, variant and compound styles are keyed by slot. Unknown slots are errors. This supports Field, Dialog and other multipart components without separate styling engines.

Initial composition is explicit through `cx` and shared style objects. Recipe inheritance and an `extend` API are deferred until concrete requirements justify their merge semantics.

## CSS composition

Use atomic declarations with deterministic identifiers and structured metadata containing property, selector and condition. Identical declarations deduplicate across compiled modules within a build. Shorthand/longhand conflicts must be resolved by normalization of the supported property set; removing a padding shorthand must not lose unrelated padding sides.

Cascade layers define engine baseline, recipes and utility overrides. Selector specificity and overlapping responsive conditions still obey CSS rules; `cx` only removes conflicts within equivalent selector/condition contexts. Explicit `style` remains an inline override under normal CSS cascade rules, including ordinary limitations around `!important`.

Version one must define and test its supported property normalization before claiming general CSS merging. Unsupported ambiguous constructs fail compilation with a location and explanation. CSS Modules and external CSS coexist without automatic conflict analysis.

## Box integration

Preserve current layout props, signal resolution, ref/render composition, hidden behavior, native DOM props and explicit style precedence. No new default visual styling is introduced.

Without a consumer plugin, Box maps finite predefined values to shipped atomic classes: spacing tokens, display, flex direction/wrap, alignment and other explicitly enumerated layout values. Generate individual property-value rules, never a Cartesian product of layouts.

Other scalar values retain current behavior through inline declarations. CSS variables can be used where a property has a safe predefined carrier rule. This fallback must not change arbitrary CSS-string handling or break existing applications. Development must not warn on supported dynamic scalar values.

With the plugin, static Box layout values can become generated classes. Responsive objects such as `padding={{ base: 'space-3', md: 'space-5' }}` require compilation. Breakpoints and named conditions are shared with `css` and recipes, provided by explicit build configuration; there are no hidden breakpoint defaults. Noncompiled responsive objects produce a descriptive error instead of being serialized into invalid styles.

Signals and values originating from measurements or requests remain runtime values. Finite token selections can choose shipped classes dynamically. Arbitrary values use the scalar fallback. Dynamic responsive objects are outside version one; use explicit CSS variables inside statically declared responsive styles instead.

## Compiler architecture

1. Shared schema defines properties, token paths, conditions, normalization and identifiers. It produces types, the finite Box class table and CSS.
2. Custom WyW processors implement build-time APIs and emit CSS plus runtime replacements/metadata.
3. A JSX prepass recognizes Box by resolved import binding, including aliases, rather than component name alone. It lowers safe static props into the styling pipeline before normal Preact JSX compilation.
4. A small browser runtime selects classes for recipes and Box, merges known declarations and preserves scalar fallbacks. It never injects stylesheet rules into the DOM.

The JSX prepass must preserve spread order. It optimizes only props whose precedence can be proven; uncertain spreads and wrappers remain runtime Box behavior. It must preserve class/className, style, signals and render-state layout. Extracting a prop must not remove information exposed through the existing Box render callback. Version one may leave render callbacks unoptimized rather than change their contract.

Styles are evaluated only from build-time-safe dependencies. Browser-dependent code is excluded from evaluation or rejected with a diagnostic. Source locations, sourcemaps, stable class names, rebuild invalidation and development CSS updates are required. Compatibility with this repository's Vite 8/Rolldown pipeline must be verified before implementation proceeds beyond the integration prototype.

## Distribution

The UI package publishes compiled JS, declarations and explicit CSS assets. Its consumers need neither WyW nor the plugin to render library components, switch shipped themes or select shipped recipe variants.

Applications using their own `css`, token definitions, themes, recipes or responsive Box extraction install the build integration. Compiler APIs must fail clearly when called untransformed, rather than silently return empty styles. Build dependencies remain separate from browser entrypoints. Existing theme/styles/reset/native-controls export contracts remain supported.

## Scope and migration

First delivery includes the shared schema, tokens/theme contracts, css/cx, recipe/slotRecipe, Vite integration and Box hybrid behavior. Migration demonstrates one component recipe and one multipart recipe; wholesale CSS Module replacement is a separate task.

No runtime stylesheet injection, automatic theme detection, general wrapper-component inference, arbitrary dynamic responsive objects or universal CSS conflict solver is promised. Additional bundlers can be supported after Vite is validated.

## Validation

- Compiler fixtures verify extracted CSS, diagnostics, aliases, spreads, normalization, conditions and deterministic output.
- Type fixtures verify token references, complete theme values, variants and slots.
- Runtime tests verify recipe defaults/compounds, composition and existing Box signals/render/style behavior.
- Packed consumer fixtures cover applications with and without the plugin, CSS imports, safe Node imports, external Preact and absence of compiler dependencies in browser bundles.
- Browser checks cover nested light/dark themes, responsive layouts, dynamic dimensions and style overrides.
- Existing library checks remain required; migrating one component must preserve its accessibility and behavioral tests.

Before implementation planning, review this spec, particularly plugin-free fallback behavior, API exports and composition semantics. The implementation plan must begin with a small WyW/Vite integration prototype and a stop condition for incompatible extraction or merge behavior.

## References

- https://wyw-in-js.dev/
- https://wyw-in-js.dev/how-it-works
- https://panda-css.com/docs/styling/style-props
- https://panda-css.com/docs/styling/dynamic-styling
