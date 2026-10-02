# Theme tokens

`theme.css` defines all public tokens below on `:root`. It sets color-scheme, follows prefers-color-scheme, and then applies forced-colors overrides. It does not style body, headings, or fields. Font stacks use system fonts. Unchanged values inherit from the light definition.

| Token | Light | Dark | Forced colors |
| --- | --- | --- | --- |
| `--font-body` | `'Segoe UI Variable Text', 'Segoe UI', system-ui, sans-serif` | `'Segoe UI Variable Text', 'Segoe UI', system-ui, sans-serif` | `unchanged` |
| `--font-display` | `'Segoe UI Variable Display', 'Segoe UI Variable Text', 'Segoe UI', system-ui, sans-serif` | `'Segoe UI Variable Display', 'Segoe UI Variable Text', 'Segoe UI', system-ui, sans-serif` | `unchanged` |
| `--font-mono` | `'Cascadia Code', Consolas, monospace` | `'Cascadia Code', Consolas, monospace` | `unchanged` |
| `--type-caption` | `12px` | `12px` | `unchanged` |
| `--type-body` | `14px` | `14px` | `unchanged` |
| `--type-subtitle` | `16px` | `16px` | `unchanged` |
| `--type-title` | `28px` | `28px` | `unchanged` |
| `--weight-semibold` | `600` | `600` | `unchanged` |
| `--color-canvas` | `#edf0f5` | `#1c1d20` | `Canvas` |
| `--color-surface` | `#f9f9f9` | `#232428` | `Canvas` |
| `--color-card` | `#ffffff` | `#2d2e33` | `Canvas` |
| `--color-surface-raised` | `#ffffff` | `#34353b` | `Canvas` |
| `--color-surface-muted` | `#f7f7f7` | `#292a2f` | `Canvas` |
| `--color-surface-hover` | `#f0f0f0` | `#35373e` | `Canvas` |
| `--color-surface-pressed` | `#e8e8e8` | `#2d2f35` | `Canvas` |
| `--color-border` | `#e4e7ed` | `#3b3d44` | `CanvasText` |
| `--color-border-strong` | `#bdbdbd` | `#626670` | `CanvasText` |
| `--color-control` | `#ffffff` | `#37393f` | `Field` |
| `--color-control-hover` | `#f7f7f7` | `#40434b` | `Field` |
| `--color-control-pressed` | `#efefef` | `#303238` | `Field` |
| `--color-control-border` | `#dfe2e7` | `#484b54` | `FieldText` |
| `--color-control-bottom` | `#b6bbc3` | `#656975` | `FieldText` |
| `--color-text` | `#1b1b1b` | `#f3f4f6` | `CanvasText` |
| `--color-text-muted` | `#525c6c` | `#bec2cb` | `CanvasText` |
| `--color-text-subtle` | `#616b7b` | `#a0a6b2` | `CanvasText` |
| `--color-accent` | `#0969c6` | `#a4cafe` | `Highlight` |
| `--color-accent-hover` | `#115ea3` | `#bad7ff` | `Highlight` |
| `--color-accent-pressed` | `#0c3b5e` | `#8cb6ed` | `Highlight` |
| `--color-on-accent` | `#ffffff` | `#152b46` | `HighlightText` |
| `--color-accent-subtle` | `#e8f3fc` | `#2a3b50` | `Canvas` |
| `--color-primary` | `var(--color-accent)` | `var(--color-accent)` | `Highlight` |
| `--color-primary-hover` | `var(--color-accent-hover)` | `var(--color-accent-hover)` | `Highlight` |
| `--color-primary-pressed` | `var(--color-accent-pressed)` | `var(--color-accent-pressed)` | `Highlight` |
| `--color-on-primary` | `var(--color-on-accent)` | `var(--color-on-accent)` | `HighlightText` |
| `--color-focus` | `#000000` | `#dceaff` | `Highlight` |
| `--color-success` | `#0f6b47` | `#95d5b2` | `CanvasText` |
| `--color-warning` | `#8a5b00` | `#e4c28c` | `CanvasText` |
| `--color-danger` | `#a4262c` | `#f1a3ac` | `CanvasText` |
| `--color-info-bg` | `#f0f6fc` | `#293544` | `Canvas` |
| `--color-success-bg` | `#eff8f3` | `#283c34` | `Canvas` |
| `--color-warning-bg` | `#fff8e9` | `#3d3529` | `Canvas` |
| `--color-danger-bg` | `#fdf0f1` | `#402e33` | `Canvas` |
| `--shadow-card` | `0 1px 2px rgb(20 36 62 / 4%), 0 3px 10px rgb(20 36 62 / 2%)` | `0 1px 3px rgb(0 0 0 / 12%)` | `none` |
| `--shadow-dialog` | `0 8px 28px rgb(0 0 0 / 18%)` | `0 12px 40px rgb(0 0 0 / 40%)` | `none` |
| `--shadow-control` | `0 1px 2px rgb(0 0 0 / 4%), inset 0 1px 0 rgb(255 255 255 / 60%)` | `inset 0 1px 0 rgb(255 255 255 / 3%), 0 1px 2px rgb(0 0 0 / 10%)` | `none` |
| `--shadow-primary` | `inset 0 1px 0 rgb(255 255 255 / 18%), 0 1px 2px rgb(0 0 0 / 8%)` | `inset 0 1px 0 rgb(255 255 255 / 16%), 0 1px 2px rgb(0 0 0 / 12%)` | `none` |
| `--color-disabled` | `#8a8e96` | `#8e939e` | `GrayText` |
| `--radius-sm` | `4px` | `4px` | `unchanged` |
| `--radius-md` | `8px` | `8px` | `unchanged` |
| `--radius-lg` | `8px` | `8px` | `unchanged` |
| `--space-1` | `4px` | `4px` | `unchanged` |
| `--space-2` | `8px` | `8px` | `unchanged` |
| `--space-3` | `12px` | `12px` | `unchanged` |
| `--space-4` | `16px` | `16px` | `unchanged` |
| `--space-5` | `20px` | `20px` | `unchanged` |
| `--space-6` | `24px` | `24px` | `unchanged` |
| `--space-8` | `32px` | `32px` | `unchanged` |

All component `var(--...)` references resolve to this table. Components and gallery introduce no local custom property contracts. Shadows disappear in forced colors; focus uses an outline rather than a shadow.

## Overrides

Import overrides after theme/styles and any optional global styles. Primary and accent are independent; the default primary values reference accent. Keep forced-colors rules after light/dark rules in your override file.

```css
:root {
  --color-accent: #107c10;
  --color-accent-hover: #0d6b0d;
  --color-accent-pressed: #095509;
}
@media (prefers-color-scheme: dark) {
  :root {
    --color-accent: #91d981;
    --color-primary: #3d6b47;
    --color-primary-hover: #497a54;
    --color-primary-pressed: #345c3d;
    --color-on-primary: #ffffff;
  }
}
@media (forced-colors: active) {
  :root {
    --color-accent: Highlight;
    --color-accent-hover: Highlight;
    --color-accent-pressed: Highlight;
    --color-on-accent: HighlightText;
    --color-primary: Highlight;
    --color-primary-hover: Highlight;
    --color-primary-pressed: Highlight;
    --color-on-primary: HighlightText;
  }
}
```

The complete [green theme](../examples/gallery/src/green-theme.css) preserves the Xbox DNS canvas, card, notice, accent and dark primary colors. Override at root so portaled dialogs receive the same values. Do not rely on a nested container theme in version 0.1.0.
