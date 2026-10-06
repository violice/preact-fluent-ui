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
  return <section {...css.props({ width, padding: width / 10 })} class={cx(panel, css({ borderRadius: 'lg' }))} />;
}
```

Ordinary JSX prop order applies: the explicit `class` above replaces the spread’s class. To retain both, compose them explicitly:

```tsx
const dynamic = css.props({ width, padding: width / 10 });
return <section {...dynamic} class={cx(panel, dynamic.class)} />;
```

`css()` returns a class string. Its style objects must be evaluable at build time. `css.props()` returns `{ class, style }`: static declarations become extracted CSS, while each dynamic scalar becomes a local custom property. Expressions run once, in source order. Numbers receive units for lengths; unitless properties retain numbers. Strings can name category tokens or contain `{full.token.path}` aliases. `token.var('colors.action')` supplies an explicit variable reference.

Dynamic inputs may be strings, numbers, null/undefined or Preact signals. Read signals through `css.props()` inside a component render to subscribe to updates. Null removes the inline variable. Nested selectors and configured conditions require explicit objects; spreads, computed keys and dynamic nested objects are rejected. No runtime stylesheet insertion is used.

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

Use `data-fui-theme="green"` for a named palette and `data-color-mode="light"` or `"dark"` for explicit mode. Both attributes can sit on the same root or on separate nested elements; nested scopes inherit the current palette and can change mode independently. A nested named theme replaces its palette with the resolved named theme. Generated mode boundaries use native CSS `@scope`, so the target browser must support it. Portals must receive the desired theme attributes on their destination container.

This is the first implementation. CSS types permit arbitrary property strings; they do not yet constrain each property to its token category. Only Vite integration is provided. Positional source-map accuracy and native Windows forced-colors behavior still need separate verification.
