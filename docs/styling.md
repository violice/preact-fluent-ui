# Styling engine

Components arrive precompiled. Keep importing the package’s `theme.css` and `styles.css`; the styling compiler is needed only for your own `css`, `cva` and `sva` calls.

## Setup

Install the optional build peers:

```sh
npm install -D vite @wyw-in-js/vite @wyw-in-js/processor-utils oxc-parser magic-string
```

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import { fluentStyles } from '@violice/preact-fluent-ui/vite';

export default defineConfig({
  plugins: fluentStyles({ configFile: './fluent.config.ts' }),
});
```

```ts
// fluent.config.ts
import { defineConfig, fluentPreset } from '@violice/preact-fluent-ui/config';

export default defineConfig({
  presets: [fluentPreset],
  conditions: { md: '@media (min-width: 800px)' },
  theme: {
    extend: {
      tokens: { colors: { brand: { value: '#005fb8' } } },
      semanticTokens: {
        colors: { action: { value: { base: '{colors.brand}', _dark: '#60cdff' } } },
      },
    },
  },
  themes: {
    green: { tokens: { colors: { brand: { value: '#107c10' } } } },
  },
});
```

The plugin generates `styled-system/css.ts` and `styled-system/theme.css` when Vite starts. Import the generated theme after the package theme. Generated token paths reflect the resolved configuration. Changes to the configuration or its imported dependencies restart the dev server and regenerate these files. Add `styled-system/` to your application’s ignore list.

## Static and dynamic styles

```tsx
import { css, cx, token } from './styled-system/css';
import './styled-system/theme.css';

const panel = css({ display: 'grid', gap: '4', color: 'action', _md: { gap: '6' } });

export function Panel({ width }: { width: number }) {
  const dynamic = css.dynamic({ width, padding: width / 10 });

  return (
    <section
      class={cx(panel, dynamic.class)}
      style={dynamic.style}
    />
  );
}
```

Pass both values explicitly: `dynamic.class` contains the extracted CSS rules, and `dynamic.style` assigns their local CSS variables. Compose static and dynamic classes with `cx()`. If you also need inline styles, merge them with `dynamic.style`.

You can also spread the result with `<section {...dynamic} />`. Ordinary JSX prop order applies; a later `class` or `style` replaces the corresponding spread value.

`css()` returns a class string. Its style objects must be evaluable at build time. `css.dynamic()` returns `{ class, style }`: static declarations become extracted CSS, while each dynamic scalar becomes a local custom property. Expressions run once, in source order. Numbers receive units for lengths; unitless properties retain numbers. Strings can name category tokens or contain `{full.token.path}` aliases. `token.var('colors.action')` supplies an explicit variable reference.

Dynamic inputs may be strings, numbers, null/undefined or Preact signals. Read signals through `css.dynamic()` inside a component render to subscribe to updates. Null removes the inline variable. Nested selectors and configured conditions require explicit objects; spreads, computed keys and dynamic nested objects are rejected. No runtime stylesheet insertion is used.

`cx()` retains foreign classes and selects the last engine declaration for the same property, selector and condition. Supported shorthands expand into independently composable declarations. Overlapping unexpanded shorthands and longhands are rejected; use explicit longhands for those combinations. Mixing logical and physical spacing in the same context is rejected because direction and writing mode make their overlap ambiguous.

## Recipes

```ts
import { cva, sva, type RecipeVariantProps } from './styled-system/css';

const button = cva({
  base: { borderRadius: 'md' },
  variants: {
    size: { sm: { height: 24 }, lg: { height: 40 } },
    disabled: { true: { opacity: 0.5 } },
  },
  defaultVariants: { size: 'sm' },
  compoundVariants: [{ size: 'lg', disabled: true, css: { opacity: 0.3 } }],
});

type ButtonVariants = RecipeVariantProps<typeof button>;
button({ size: 'lg', disabled: false });

const field = sva({
  slots: ['root', 'label'],
  base: { root: { display: 'grid' }, label: { fontWeight: 600 } },
  variants: { invalid: { true: { label: { color: 'danger' } } } },
});
field({ invalid: true }).label;
```

All declared branches are extracted even when selection occurs at runtime. Undefined preserves a default; null suppresses it. Matching compounds apply in declaration order. `RecipeVariantProps` describes optional call props; `RecipeVariant` makes the same variant keys required and excludes null/undefined.

## Theme scopes

Use `data-pfui-theme="green"` for a named palette and `data-color-mode="light"` or `"dark"` for explicit mode. Both attributes can sit on the same root or on separate nested elements; nested scopes inherit the current palette and can change mode independently. A nested named theme replaces its palette with the resolved named theme. Generated mode boundaries use native CSS `@scope`, so the target browser must support it. Portals must receive the desired theme attributes on their destination container.

This is the first implementation. CSS types permit arbitrary property strings; they do not yet constrain each property to its token category. Only Vite integration is provided. Positional source-map accuracy and native Windows forced-colors behavior still need separate verification.

## Component recipes

All library components use the style engine. Each component lives in its own TSX file inside a family directory; recipes, helpers and tests are colocated. Public imports from the package root remain unchanged.

Use `css` for an invariant element, `cva` for variants of one element and `sva` for component parts. Select multipart variants once in the parent and pass the returned slot classes to children, through context when parts are separate components. Sidebar, AppShell and Table use this pattern; nested roots establish their own selection and standalone parts use cached defaults. Do not select the same recipe again in each child.

Keep CSS selectors for native state (`:checked`, `:hover`, `open`) and DOM structure, such as table dividers. A parent prop that changes several parts belongs in `sva.variants`; a prop owned by an independent child, such as ToolbarGroup alignment, belongs in its own `cva`. Use `cx` to compose ready classes and conditional modifiers; retain `resolveClass` for the public `class`/`className` precedence.

An `sva` selector can reference another slot with `$slotName`:

```ts
const checkbox = sva({
  slots: ['input', 'indicator'],
  base: {
    input: { '&:checked + $indicator': { backgroundColor: 'accent' } },
    indicator: { borderRadius: 2 },
  },
});
```

The compiler adds stable slot markers, including to slots without base declarations. Apply every returned slot class to its corresponding element; selectors need those markers.

Top-level `@keyframes name` definitions are extracted with the stylesheet. Frames accept `from`, `to`, percentages and comma-separated percentages; nested selectors and scoped keyframes are rejected. Choose unique animation names.

Generated CSS declares the layer order `pfui.reset, pfui.native, pfui.utilities` before emitting utility rules. The optional reset and native-control styles use the first two layers. Unlayered application CSS can still override normal utility declarations.

Tooltip and Sidebar hints use `css.dynamic` for measured geometry. Native `style` props remain available. TextPreview/CodeBlock retain their style adapter to preserve existing `wrap` precedence for both object and string styles.

Fluent components continue reading public `--color-*`, `--font-*` and `--radius-*` variables, so local overrides retain their behavior. Configured themes also update these variables when overriding the corresponding semantic tokens. Default aliases remain one-way to avoid cycles. Local `--pfui-*` overrides affect styles that read those tokens directly; use the public Fluent variables for local component overrides or `data-pfui-theme` for configured themes.
