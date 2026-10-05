# Changelog

## 0.4.0 (2026-10-05)

- Add a Changelog gallery page sourced from this Markdown file, with safe Preact rendering through the gallery-only TanStack Markdown parser.

- Add TextPreview for literal text, wrapping and bounded scrolling.
- Add CodeBlock with generic syntax tokens, themed colors and optional exact-source copying. Use it throughout the gallery with external TanStack tokenization.
- Add AppShellToolbar as the sixth AppShell part, sharing content width and padding variables.
- Expand the gallery to 38 canonical documentation pages.

- Add native Disclosure parts for error details and file previews.
- Add labeled/decorative Spinner and single-status LoadingState with inline presentation.
- Add Button loading with focus retention, guarded activation and localized replacement labels.
- Add composed render-function Tooltip triggers with viewport positioning, scrolling/Modal portals and inherited local themes.
- Add four canonical gallery pages, interactive loading examples and packed public API contracts.

- Add native Table parts and an optional TableContainer, with regular and compact density.
- Add controlled one-based Pagination with localized labels and empty-result handling.
- Replace DataToolbar and DataToolbarGroup with Toolbar and ToolbarGroup, and add AppShellToolbar application chrome. Old exports are removed.
- Add Toolbar and ToolbarGroup for controls, counters and pagination above or below data views.
- Add DataList parts with horizontal and vertical label/value layouts, responsive stacking and native definition-list semantics.
- Add decorative and semantic Separator with horizontal and vertical orientation.
- Add five canonical gallery pages, public API documentation and package contracts for the new families.
- Use the public Table family for the gallery's component and utility API references.

## 0.3.0 (2026-10-05)

- Make application styles the Sidebar default and add expanded/rail/horizontal layouts, scrollable navigation, SidebarBrand and button/custom rendered SidebarItem roots.
- Add five composable AppShell parts and public useRender, mergeProps, mergeClasses and resolveClass utilities.
- Organize the gallery into 26 canonical documentation pages with grouped component API references, alphabetical Utils navigation, local utility demonstrations and isolated application shell previews.
- Document render forwarding, refs, style and handler composition, shell layout variables and local archive installation.
- Fix SidebarItem title and description alignment beside centered icons.

### Migration from 0.2.0

- Remove Sidebar `appearance`; application styling is now the default. Use `layout` for expanded, rail and horizontal navigation.

## 0.2.0 (2026-10-05)

- Add native Input, Textarea, Field, Checkbox and Switch components with labels, validation, refs and form integration.
- Add composable Sidebar, SidebarHeader, SidebarNav, SidebarGroup, SidebarItem and SidebarFooter components.
- Expose named class slots on multipart components; single-element controls use class or className.
- Rebuild the English gallery with Preact ISO routing, Signals appearance settings and 30 prerendered documentation pages.
- Add Getting Started, About, Theming and Styling guides, alphabetical component navigation, visible code and isolated interactive examples.
- Present example feedback below previews and provide responsive appearance settings with custom palettes.
- Verify repository-base gallery artifacts and serve malformed requests and unknown routes safely.

### Migration from 0.1.0

- Replace Select's `wrapperClassName` with `classes={{ wrapper: 'your-class' }}`.
- Select, Modal, PageHeader, DialogHeader and EmptyState now give `class` precedence over `className` instead of merging both. Use one combined `class` value when both sets of classes are needed. New form controls and Sidebar parts use the same precedence.

## 0.1.0 (2026-10-02)

- Initial ESM library with 13 components and exported TypeScript props.
- Decorative Fluent icons with 22 names and 16/20/24 sizes.
- Controlled native props, DOM refs, class merging, and accessible dialogs.
- Explicit theme/styles CSS and optional reset/native-controls entry points.
- System light/dark themes, primary/accent tokens, forced-colors rules, and local reduced-motion rules.
- Full, minimal, and Xbox DNS green gallery pages with usage and token documentation.
- Packed ESM/declaration/CSS/license verification in isolated consumers on Preact 10.27.0 and locked 10.29.8.
- Button-only JavaScript tree shaking removes live dialog and SVG catalog code; consumer size baselines are recorded in README.
- Push/PR package checks and release tag/version guards, with artifacts for the archive, SHA-256, and emitted sizes.
- Published the same checked archive to npm through GitHub Actions trusted publishing with public access and provenance.

Manual Windows forced-colors and reduced-motion acceptance is pending. GitHub repository metadata, npm scope access, bootstrap registration, and trusted publisher configuration are complete. Registry installation, TypeScript API compilation, and full/minimal consumer builds with CSS passed.

Before 1.0, incompatible props or token changes will be recorded in this file. Version 0.1.0 is published on npm.
