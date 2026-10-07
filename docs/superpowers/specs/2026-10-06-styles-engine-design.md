# Styles engine for Preact Fluent UI

Status: approved by the user on 2026-10-06, including cva/sva, Panda-like theme configuration and RecipeVariant/RecipeVariantProps. Implementation authorized inline after the prototype; user revisions remove Box and add css.dynamic.

## Purpose

Provide a shared styles foundation for the UI library and consumer applications. Use css() on native elements and components; remove Box from the target public API. Support typed tokens, scoped themes, variants, compound variants and recipes from the outset.

The selected direction is a hybrid engine using WyW-in-JS for build-time evaluation and extraction. It must preserve the current package's explicit CSS imports, Preact externalization and safe Node imports. Existing CSS Modules can coexist during migration.

## Public surface

Proposed styles exports are `css`, `cx`, `token`, `cva`, `sva`, `RecipeVariant` and `RecipeVariantProps`. Configuration helpers are build-only exports from a config subpath; browser styles exports contain css/cx, token, cva/sva and the type-only helpers RecipeVariant/RecipeVariantProps. A separate Vite subpath exposes the compiler integration. The existing class-variance-authority dependency is unrelated to this new cva API; no automatic implementation reuse is implied. Export names are part of this proposal, not existing APIs.

`css(styleObject)` returns an opaque class string after compilation. Style objects support typed CSS properties, token references, nested selectors and configured conditions. Numeric lengths follow existing Box conventions; unitless properties remain unitless. Token references are symbolic CSS-variable references, not theme values evaluated at runtime.

`cx` merges engine-generated classes using metadata about property conflicts and conditions. External class strings are retained verbatim; their declarations cannot be inferred. Class order alone does not promise precedence over external CSS.

## Tokens and themes

Use a Panda-like declarative configuration instead of the previously proposed defineThemeContract/createTheme API. Public configuration helpers are defineConfig and definePreset. The library supplies a Fluent preset; applications extend it without copying the full token catalog.

The configuration contains:

- `theme.tokens`: primitive values grouped by category, with `{ value, description? }` leaves.
- `theme.semanticTokens`: role-based values, optionally conditional with `base`, `_light` and `_dark` keys.
- `theme.extend`: deep additions/overrides to the inherited theme.
- `themes`: named token overrides for alternative brand palettes, independent from light/dark mode.
- `conditions`: selector or at-rule definitions shared with css and cva/sva.
- `presets`: ordered build-time configuration inputs, with application configuration applied last.

Direct token categories replace that inherited category; `extend` deep-merges leaves and preserves siblings. Merge order is presets in order, direct application replacements, then application extensions. Arrays replace rather than concatenate. Token aliases use `{colors.gray.50}` notation, including inside composite strings. Unknown references, incompatible leaf shapes and alias cycles are build errors.

Example proposed configuration:

```ts
export default defineConfig({
  presets: [fluentPreset],
  conditions: {
    light: '[data-color-mode="light"] &',
    dark: '[data-color-mode="dark"] &',
  },
  theme: {
    extend: {
      tokens: {
        colors: {
          brand: { value: '#0067c0' },
        },
        spacing: {
          4: { value: '16px' },
        },
      },
      semanticTokens: {
        colors: {
          surface: {
            value: {
              base: '{colors.white}',
              _dark: '{colors.gray.950}',
            },
          },
          accent: { value: '{colors.brand}' },
        },
      },
    },
  },
  themes: {
    green: {
      tokens: {
        colors: { brand: { value: '#237b46' } },
      },
    },
  },
});
```

Color values are examples, not changes to the library's current palette. Styles reference token names in category-aware properties: `css({ backgroundColor: 'surface', color: 'accent', gap: '4' })`. Composite values accept explicit full-path aliases. Existing Box values such as `space-4` remain supported through compatibility aliases. Explicit raw CSS values remain supported, with a documented token-first resolution rule when a name is also a configured token. `token.var('colors.surface')` returns a variable reference outside style objects. There is no API promising the current computed theme value synchronously in JavaScript.

Types are generated from the fully resolved preset/config, including custom tokens, conditions and theme names. Compiled library declarations must not depend on the consumer having that generated module. The consumer integration exposes generated bindings for its configuration and validates token references during compilation. Exact generated-file plumbing is an implementation-plan concern; this typed contract is required.

Emit CSS variables scoped by `[data-pfui-theme="green"]` for named palettes and `[data-color-mode="dark"]` for mode. The preset includes a default palette and mode declarations; themes are partial overrides of its resolved token shape, not independent complete contracts. A brand scope emits the full resolved values needed to avoid inheriting a different ancestor brand accidentally. Mode-dependent semantic aliases are redeclared on theme/mode scope roots so nested scopes resolve local primitive values. Test the theme and mode attribute on the same element as well as nested containers. Only parent/scope selector conditions and at-rules are valid semantic-token conditions; element states such as hover belong in styles.

The compiler must implement scope selectors including the scope root itself, not merely descendants. The example condition notation is an authoring shorthand, not the final emitted variable selector. Mode and brand override precedence is deterministic and must preserve local scope inheritance; nested explicit mode/brand scopes must override outer values. This is a required prototype validation, not something left to incidental selector ordering.

Names are deterministic and namespaced to avoid collisions between packages. Existing public variables such as `--space-4` retain their names through a compatibility mapping. Components use semantic tokens for theme-dependent colors. Theme and mode changes update attributes and variables, not component class generation. The engine never automatically reads browser preferences. Existing library theme selectors remain supported during migration. Applications can override documented variables through ordinary CSS without compiler code.

## Recipes

`cva` accepts `base`, `variants`, `compoundVariants` and `defaultVariants`. It returns a small runtime selector over precompiled classes. All explicitly declared variant branches and compound styles are emitted, including branches selected only by runtime props. There is no requirement to discover every recipe invocation in consumer code.

`RecipeVariant<typeof definition>` extracts variant keys as required properties. `RecipeVariantProps<typeof definition>` extracts optional properties for component props. Both helpers work with cva and sva and are type-only exports, with no runtime code. Required selections use the inferred branch values; optional props also admit undefined and null according to the default-suppression semantics below. This follows Panda's helper names.

```ts
type ButtonVariants = RecipeVariant<typeof button>;
// { size: 'small' | 'medium' }
type ButtonVariantProps = RecipeVariantProps<typeof button>;
// { size?: 'small' | 'medium' | null | undefined }
```

Variant keys and values infer TypeScript types. Boolean branches support `true` and `false`. An omitted or undefined variant uses its default; null explicitly suppresses the default. Unknown values are type errors and produce descriptive errors in development for untyped callers. Production ignores an unknown branch rather than generating CSS.

Compound predicates match all their specified variants against resolved selections. A predicate may list several accepted values. Matching compounds apply in declaration order. Precedence is base, selected variants in definition order, then matching compounds. `cx(cvaDefinition(selection), css(overrides))` applies engine overrides last for equivalent property/condition declarations.

`sva` shares these semantics but returns a map of class strings for declared slots. Base, variant and compound styles are keyed by slot. Unknown slots are errors. This supports Field, Dialog and other multipart components without separate styles engines.

Initial composition is explicit through `cx` and shared style objects. Recipe inheritance and an `extend` API are deferred until concrete requirements justify their merge semantics.

## CSS composition

Use atomic declarations with deterministic identifiers that carry property and selector/condition identity. cx decodes these without a mutable global runtime registry. Identical declarations deduplicate across compiled modules within a build. Physical and logical spacing cannot be mixed within equivalent composition contexts; reject this ambiguity. Shorthand/longhand conflicts must be resolved by normalization of the supported property set; removing a padding shorthand must not lose unrelated padding sides.

Cascade layers define engine baseline, recipes and utility overrides. Selector specificity and overlapping responsive conditions still obey CSS rules; `cx` only removes conflicts within equivalent selector/condition contexts. Explicit `style` remains an inline override under normal CSS cascade rules, including ordinary limitations around `!important`.

Version one must define and test its supported property normalization before claiming general CSS merging. Unsupported ambiguous constructs fail compilation with a location and explanation. CSS Modules and external CSS coexist without automatic conflict analysis.

## Dynamic css.dynamic and Box removal

User revision on 2026-10-06: remove Box and its layout props/render API in favor of native elements or existing components styled with css(). Remove Box exports, source, gallery page and package-consumer contracts. This is a breaking change; document migration. Consumer application migrations are outside the current repository task.

`css(style)` returns a class string for build-time styles. `css.dynamic(style)` returns `{ class, style }` for spreading onto a native element or a component that forwards those props. A pre-transform compiler pass extracts statically known property paths and substitutes automatically named element-local custom properties for nonliteral values. The resulting static style object goes through the same WyW processor. Dynamic expressions remain runtime expressions evaluated once, in source order.

Numeric dynamic lengths receive px; unitless properties retain unitless values. Signal values are resolved when css.dynamic runs during a component render, preserving render subscription behavior. Null/undefined values omit their variable. Named tokens are resolved using the active compiled configuration. Nested statically declared selector/condition objects may contain dynamic leaves. Dynamic object shapes, spreads, computed keys and methods are rejected with actionable diagnostics rather than losing declarations.

The early pass resolves imported css bindings, including aliases, and respects lexical shadowing. It does not require JSX and can transform css.dynamic in ordinary TypeScript. Spread/class/style ordering on the element follows normal JSX semantics; callers use cx or explicitly merge style objects when overriding the returned props.

## Compiler architecture

1. Shared schema defines properties, token paths, conditions, normalization and identifiers. It produces token types and atomic CSS.
2. Custom WyW processors implement build-time APIs and emit CSS plus runtime replacements/metadata.
3. An early css.dynamic pass recognizes css by its import binding and lowers dynamic leaves before WyW extraction and Preact compilation.
4. A small browser runtime selects recipe classes and resolves dynamic props, merges known declarations and preserves scalar fallbacks. It never injects stylesheet rules into the DOM.

Styles are evaluated only from build-time-safe dependencies. Browser-dependent code is excluded from evaluation or rejected with a diagnostic. Source locations, sourcemaps, stable class names, rebuild invalidation and development CSS updates are required. Compatibility with this repository's Vite 8/Rolldown pipeline must be verified before implementation proceeds beyond the integration prototype.

## Distribution

The UI package publishes compiled JS, declarations and explicit CSS assets. Its consumers need neither WyW nor the plugin to render library components, switch shipped themes or select shipped recipe variants.

Applications using their own `css`, token definitions, themes, recipes or dynamic css.dynamic compilation install the build integration. Compiler APIs must fail clearly when called untransformed, rather than silently return empty styles. Build dependencies remain separate from browser entrypoints. Existing theme/styles/reset/native-controls export contracts remain supported.

## Scope and migration

First delivery includes the shared schema, configuration-driven tokens/themes, css/cx, cva/sva, Vite integration and dynamic css.dynamic behavior. Migration demonstrates one component recipe and one multipart recipe; wholesale CSS Module replacement is a separate task. However, complete replacement of the standalone clsx and class-variance-authority helpers is part of this delivery: migrate every production import, route legacy class joining through the engine, remove both direct dependencies, and prove neither package remains in published JavaScript or the dependency graph. Existing CSS Modules may remain as foreign class strings handled by cx.

No runtime stylesheet injection, automatic theme detection, general wrapper-component inference, dynamic style object shapes or universal CSS conflict solver is promised. Additional bundlers can be supported after Vite is validated.

## Validation

- Compiler fixtures verify extracted CSS, diagnostics, aliases, spreads, normalization, conditions and deterministic output.
- Type fixtures verify token references, preset merges, conditional semantic tokens, partial named-theme overrides, variants and slots.
- Runtime tests verify recipe defaults/compounds, composition and css.dynamic signals/unit behavior.
- Packed consumer fixtures cover applications with and without the plugin, CSS imports, safe Node imports, external Preact and absence of compiler dependencies in browser bundles.
- Browser checks cover nested light/dark modes and brand themes, responsive layouts, dynamic dimensions and style overrides.
- Artifact and dependency checks reject clsx/class-variance-authority imports or bundled modules after migration; license notices are regenerated.
- Existing library checks remain required; migrating one component must preserve its accessibility and behavioral tests.

Before implementation planning, review this spec, particularly plugin-free fallback behavior, API exports and composition semantics. The implementation plan must begin with a small WyW/Vite integration prototype and a stop condition for incompatible extraction or merge behavior.

## References

- https://wyw-in-js.dev/
- https://wyw-in-js.dev/how-it-works
- https://panda-css.com/docs/styles/style-props
- https://panda-css.com/docs/styles/dynamic-styles

- https://panda-css.com/docs/theming/tokens
- https://panda-css.com/docs/theming/presets
- https://panda-css.com/docs/guides/multiple-themes


## API revision after first delivery

User requests the `pfui` namespace for classes, custom properties, layers and data attributes; `css.dynamic()` replaces `css.props()` without a compatibility alias. `css()` still returns a string. InfoBar uses sva slots root/title/content. Remove mergeClasses source/export/docs and call cx directly throughout the library; cx reads Signalish values during tracked render calls and accepts nested ClassValue arrays. cx and ClassValue are exported from the root and styles entries.
