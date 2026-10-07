# Theme tokens

The generated `styled-system/theme.css`, also included in `styled-system/styles.css`, defines the core tokens below on `:root`. It sets color-scheme, follows prefers-color-scheme, and then applies forced-colors overrides. It does not style body, headings, or fields. Font stacks use system fonts. Unchanged values inherit from the light definition.

| Token | Light | Dark | Forced colors |
| --- | --- | --- | --- |
| `--pfui-fonts-body` | `'Segoe UI Variable Text', 'Segoe UI', system-ui, sans-serif` | `'Segoe UI Variable Text', 'Segoe UI', system-ui, sans-serif` | `unchanged` |
| `--pfui-fonts-display` | `'Segoe UI Variable Display', 'Segoe UI Variable Text', 'Segoe UI', system-ui, sans-serif` | `'Segoe UI Variable Display', 'Segoe UI Variable Text', 'Segoe UI', system-ui, sans-serif` | `unchanged` |
| `--pfui-fonts-mono` | `'Cascadia Code', Consolas, monospace` | `'Cascadia Code', Consolas, monospace` | `unchanged` |
| `--pfui-fontSizes-caption` | `12px` | `12px` | `unchanged` |
| `--pfui-fontSizes-body` | `14px` | `14px` | `unchanged` |
| `--pfui-fontSizes-subtitle` | `16px` | `16px` | `unchanged` |
| `--pfui-fontSizes-title` | `28px` | `28px` | `unchanged` |
| `--pfui-fontWeights-semibold` | `600` | `600` | `unchanged` |
| `--pfui-colors-canvas` | `#edf0f5` | `#1c1d20` | `Canvas` |
| `--pfui-colors-surface` | `#f9f9f9` | `#232428` | `Canvas` |
| `--pfui-colors-card` | `#ffffff` | `#2d2e33` | `Canvas` |
| `--pfui-colors-surface-raised` | `#ffffff` | `#34353b` | `Canvas` |
| `--pfui-colors-surface-muted` | `#f7f7f7` | `#292a2f` | `Canvas` |
| `--pfui-colors-surface-hover` | `#f0f0f0` | `#35373e` | `Canvas` |
| `--pfui-colors-surface-pressed` | `#e8e8e8` | `#2d2f35` | `Canvas` |
| `--pfui-colors-border` | `#e4e7ed` | `#3b3d44` | `CanvasText` |
| `--pfui-colors-border-strong` | `#bdbdbd` | `#626670` | `CanvasText` |
| `--pfui-colors-control` | `#ffffff` | `#37393f` | `Field` |
| `--pfui-colors-control-hover` | `#f7f7f7` | `#40434b` | `Field` |
| `--pfui-colors-control-pressed` | `#efefef` | `#303238` | `Field` |
| `--pfui-colors-control-border` | `#dfe2e7` | `#484b54` | `FieldText` |
| `--pfui-colors-control-bottom` | `#b6bbc3` | `#656975` | `FieldText` |
| `--pfui-colors-text` | `#1b1b1b` | `#f3f4f6` | `CanvasText` |
| `--pfui-colors-text-muted` | `#525c6c` | `#bec2cb` | `CanvasText` |
| `--pfui-colors-text-subtle` | `#616b7b` | `#a0a6b2` | `CanvasText` |
| `--pfui-colors-accent` | `#0969c6` | `#a4cafe` | `Highlight` |
| `--pfui-colors-accent-hover` | `#115ea3` | `#bad7ff` | `Highlight` |
| `--pfui-colors-accent-pressed` | `#0c3b5e` | `#8cb6ed` | `Highlight` |
| `--pfui-colors-on-accent` | `#ffffff` | `#152b46` | `HighlightText` |
| `--pfui-colors-accent-subtle` | `#e8f3fc` | `#2a3b50` | `Canvas` |
| `--pfui-colors-primary` | `var(--pfui-colors-accent)` | `var(--pfui-colors-accent)` | `Highlight` |
| `--pfui-colors-primary-hover` | `var(--pfui-colors-accent-hover)` | `var(--pfui-colors-accent-hover)` | `Highlight` |
| `--pfui-colors-primary-pressed` | `var(--pfui-colors-accent-pressed)` | `var(--pfui-colors-accent-pressed)` | `Highlight` |
| `--pfui-colors-on-primary` | `var(--pfui-colors-on-accent)` | `var(--pfui-colors-on-accent)` | `HighlightText` |
| `--pfui-colors-focus` | `#000000` | `#dceaff` | `Highlight` |
| `--pfui-colors-success` | `#0f6b47` | `#95d5b2` | `CanvasText` |
| `--pfui-colors-warning` | `#8a5b00` | `#e4c28c` | `CanvasText` |
| `--pfui-colors-danger` | `#a4262c` | `#f1a3ac` | `CanvasText` |
| `--pfui-colors-info-bg` | `#f0f6fc` | `#293544` | `Canvas` |
| `--pfui-colors-success-bg` | `#eff8f3` | `#283c34` | `Canvas` |
| `--pfui-colors-warning-bg` | `#fff8e9` | `#3d3529` | `Canvas` |
| `--pfui-colors-danger-bg` | `#fdf0f1` | `#402e33` | `Canvas` |
| `--pfui-shadows-card` | `0 1px 2px rgb(20 36 62 / 4%), 0 3px 10px rgb(20 36 62 / 2%)` | `0 1px 3px rgb(0 0 0 / 12%)` | `none` |
| `--pfui-shadows-dialog` | `0 8px 28px rgb(0 0 0 / 18%)` | `0 12px 40px rgb(0 0 0 / 40%)` | `none` |
| `--pfui-shadows-control` | `0 1px 2px rgb(0 0 0 / 4%), inset 0 1px 0 rgb(255 255 255 / 60%)` | `inset 0 1px 0 rgb(255 255 255 / 3%), 0 1px 2px rgb(0 0 0 / 10%)` | `none` |
| `--pfui-shadows-primary` | `inset 0 1px 0 rgb(255 255 255 / 18%), 0 1px 2px rgb(0 0 0 / 8%)` | `inset 0 1px 0 rgb(255 255 255 / 16%), 0 1px 2px rgb(0 0 0 / 12%)` | `none` |
| `--pfui-colors-disabled` | `#8a8e96` | `#8e939e` | `GrayText` |
| `--pfui-radii-sm` | `4px` | `4px` | `unchanged` |
| `--pfui-radii-md` | `8px` | `8px` | `unchanged` |
| `--pfui-radii-lg` | `8px` | `8px` | `unchanged` |
| `--pfui-spacing-1` | `4px` | `4px` | `unchanged` |
| `--pfui-spacing-2` | `8px` | `8px` | `unchanged` |
| `--pfui-spacing-3` | `12px` | `12px` | `unchanged` |
| `--pfui-spacing-4` | `16px` | `16px` | `unchanged` |
| `--pfui-spacing-5` | `20px` | `20px` | `unchanged` |
| `--pfui-spacing-6` | `24px` | `24px` | `unchanged` |
| `--pfui-spacing-8` | `32px` | `32px` | `unchanged` |

This table lists the core Fluent theme defaults. The preset also defines typography, motion and code syntax tokens. Configured tokens and `css.dynamic()` can introduce additional custom properties. Shadows disappear in forced colors; focus uses an outline rather than a shadow.

## Overrides

Import overrides after theme/styles and any optional global styles. Primary and accent are independent; the default primary values reference accent. Keep forced-colors rules after light/dark rules in your override file.

```css
:root {
  --pfui-colors-accent: #107c10;
  --pfui-colors-accent-hover: #0d6b0d;
  --pfui-colors-accent-pressed: #095509;
}
@media (prefers-color-scheme: dark) {
  :root {
    --pfui-colors-accent: #91d981;
    --pfui-colors-primary: #3d6b47;
    --pfui-colors-primary-hover: #497a54;
    --pfui-colors-primary-pressed: #345c3d;
    --pfui-colors-on-primary: #ffffff;
  }
}
@media (forced-colors: active) {
  :root {
    --pfui-colors-accent: Highlight;
    --pfui-colors-accent-hover: Highlight;
    --pfui-colors-accent-pressed: Highlight;
    --pfui-colors-on-accent: HighlightText;
    --pfui-colors-primary: Highlight;
    --pfui-colors-primary-hover: Highlight;
    --pfui-colors-primary-pressed: Highlight;
    --pfui-colors-on-primary: HighlightText;
  }
}
```

The complete [green theme](../examples/gallery/src/styles/green-theme.ts) preserves the Xbox DNS canvas, card, notice, accent and dark primary colors. Override at root so portaled dialogs receive the same values. Modal portals use the root theme; Tooltip inherits its trigger theme.


## Application shell layout variables

These optional CSS variables apply to AppShell and have fallback values in component styles. They are layout overrides, rather than theme color tokens.

| Variable | Default | Purpose |
| --- | --- | --- |
| `--app-shell-navigation-width` | `248px` | Expanded navigation width |
| `--app-shell-rail-width` | `64px` | Rail navigation width |
| `--app-shell-content-max-width` | `1240px` | Centered content maximum |
| `--app-shell-content-padding` | `24px` | Header, content and footer padding; toolbar inline padding |

Desktop workspace margin is 8px and radius is 12px. Horizontal navigation removes the margin and radius. Applications choose their breakpoints and set Sidebar layout to match AppShell navigationLayout.

## Code syntax colors

CodeBlock owns the `--pfui-codeColors-<kind>` palette in light and dark themes. Kinds are keyword, string, comment, function, type, property, number, literal, tag, attribute, operator, punctuation and command. Override these variables in your theme; tokenization remains external. Forced colors render tokens with CanvasText.

AppShellToolbar shares the content maximum width and inline padding variable. Its default inline padding is 24px at all viewport widths; an explicit shared padding variable overrides both defaults.
