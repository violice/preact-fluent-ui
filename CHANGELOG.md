# Changelog

## Unreleased

- Make application styles the Sidebar default and add expanded/rail/horizontal layouts, scrollable navigation, SidebarBrand and button/custom rendered SidebarItem roots.
- Add five composable AppShell parts and public useRender, mergeProps, mergeClasses and resolveClass utilities.
- Organize the gallery into 26 canonical documentation pages with grouped component API references, alphabetical Utils navigation, local utility demonstrations and isolated application shell previews.
- Document render forwarding, refs, style and handler composition, shell layout variables and local archive installation before release.

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
