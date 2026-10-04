# Gallery navigation implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Build an English documentation gallery with composable Sidebar components, preact-iso routes and Signals state.

**Architecture:** Export independent Sidebar parts from the library. A gallery-owned registry supplies navigation and routes; a gallery-owned Signals store supplies appearance settings. Prerender the pages for GitHub Pages.

**Tech stack:** Preact, TypeScript, CSS modules, preact-iso, @preact/signals, Vite, Vitest, TanStack Highlight.

**Spec:** [Approved design](../specs/2026-10-04-gallery-navigation-design.md).

## Global constraints

- Work only in this repository; do not migrate consumer applications.
- All gallery UI, examples, comments, data, messages, titles and accessibility labels are English.
- preact-iso and @preact/signals are gallery devDependencies, never mandatory library peers or bundled library dependencies.
- Sidebar has no router dependency. Standard native props and refs remain usable.
- Single-element components have no classes prop. Multipart slots accept JSX.Signalish values; class has priority with className fallback.
- Preserve Minimal/Full, theme URL settings, TanStack Highlight and existing demonstrations.
- Support direct nested URLs under a GitHub Pages repository base using prerender.

## Review focus

1. Query settings on a prerendered nested page must hydrate without mismatches and preserve the requested appearance.
2. External links, modifier clicks and native anchor refs must retain browser behavior.
3. Long labels and many navigation items must remain reachable at narrow widths and in RTL.
4. Browser Back/Forward must synchronize appearance and route, without accumulating theme stylesheets.
5. Release-triggered gallery builds must not require Sidebar exports absent from the published package used by that workflow.

## Files and responsibilities

- `src/components/sidebar.tsx`, `sidebar.module.css`, `sidebar.test.tsx`: composable public components and their behavior.
- `src/index.ts`, `tests/package-consumer/src/api-contract.tsx`: exports and published API contracts.
- `examples/gallery/src/gallery-store.ts`, `gallery-store.test.ts`: settings signals and browser lifecycle.
- `examples/gallery/src/gallery-controls.tsx`: controls consuming the shared store.
- `examples/gallery/src/page-registry.ts`, `gallery-routing.ts`, `gallery-routing.test.ts`: page metadata and base-aware URL helpers.
- `examples/gallery/src/gallery.tsx`, `gallery.module.css`, `main.tsx`, `gallery.test.tsx`: persistent shell, routes, hydration and accessibility.
- `examples/gallery/src/pages/`: focused component and guide pages extracted from the existing gallery.
- `examples/gallery/vite.config.ts`, `.github/workflows/pages.yml`: prerender and hosting base configuration.
- `scripts/check-gallery.mjs`, `package.json`, `package-lock.json`: artifact verification and gallery dependencies.
- `README.md`, `docs/api.md`: public Sidebar documentation; use existing roadmap file for completion tracking.

### Task 1: Composable Sidebar

**Interfaces:** Export Sidebar, SidebarHeader, SidebarNav, SidebarGroup, SidebarItem, SidebarFooter and their Props types. Structural components use native HTMLAttributes and forwardRef. SidebarNav requires either aria-label or aria-labelledby. SidebarGroup adds label?: ComponentChildren and classes root/label/content. SidebarItem uses anchor attributes with required href, icon?: ComponentChildren, active?: JSX.Signalish<boolean> and classes root/icon/content.

- [x] Add tests rendering a composed Sidebar and asserting aside/nav semantics, group labels with unique IDs, aria-current only when active, native click modifiers and forwarded anchor ref.
- [x] Add tests asserting signal-like active/class updates, class fallback, additive slots and no classes/active/icon leakage to DOM.
- [x] Run `npx vitest run src/components/sidebar.test.tsx`; confirm failure from missing components.
- [x] Implement components and token-based styles. Sidebar remains position/width independent. Support focus-visible, wrapping, RTL logical properties and forced colors. Footer uses margin-top: auto.
- [x] Export components/types and add packed API positive examples and negative cases for missing href, missing nav label, unknown slots and root-only classes on structural parts.
- [x] Run focused tests and `npm run build`; run `npm run test:package:all` and confirm both peer versions pass.

### Task 2: Signals settings store

**Interfaces:** `createGalleryStore(initial?: GallerySettings)` returns settings Signal<GallerySettings>, systemDark Signal<boolean>, update(next: GallerySettings): void and connectBrowser(): () => void. The gallery creates one store per application instance; SSR instances do not share mutable settings. Existing readSettings/settingsUrl/themeOverrides remain the serialization boundary.

- [x] Add @preact/signals as a devDependency and regenerate third-party notices.
- [x] Add tests for deterministic defaults without window, query initialization on connect, invalid query fallback, replaceState preserving path/hash/unrelated params, popstate synchronization and cleanup of media/history listeners.
- [x] Run `npx vitest run examples/gallery/src/gallery-store.test.ts`; confirm failure before implementing the store.
- [x] Implement store and adapt GalleryControls/useGallerySettings. Browser effects own theme style and optional CSS links; only one owner mounts in the persistent shell.
- [x] Test Full/Minimal transitions and repeated Back/Forward produce exactly the expected style/link nodes and remove them on unmount.
- [x] Run gallery store/settings tests and typecheck; confirm all pass.

### Task 3: Documentation pages and shell

**Interfaces:** `galleryPages` entries have path: string, title: string, group: 'Start' | 'Components' | 'Guides', component: ComponentType. `galleryHref(path: string, settings: GallerySettings, base: string): string` produces a same-origin, base-aware URL. `normalizeGalleryPath(pathname: string, base: string): string` removes only the configured base and normalizes a trailing slash.

- [x] Add preact-iso as a devDependency and regenerate notices. Read the installed router/prerender APIs before implementation.
- [x] Add routing tests for root and repository bases, trailing slashes, current settings in links and unknown routes.
- [x] Add shell tests for navigation, one main/h1 per page, skip-link, active link, document.title, focus after client transitions and narrow menu aria-expanded/aria-controls.
- [x] Run focused tests and observe failures before creating routing helpers and the shell.
- [x] Create page registry and LocationProvider/Router/ErrorBoundary shell. Keep appearance controls mounted across routes. Close narrow navigation on route change; retain normal anchor behavior.
- [x] Extract all existing demonstrations into focused pages. Give every existing public component and Sidebar part a /components/<slug> page with purpose, live example, CodeExample, own props table and accessibility notes.
- [x] Create overview, getting-started, forms, theming, signals and 404 pages. Use actual signals in examples for value, disabled and class. Keep form/dialog scenarios and focus restoration functional on their pages.
- [x] Update old gallery tests for their destination routes; test keyboard navigation, Back/Forward with settings, external/modifier clicks and unmounting an open dialog during navigation.
- [x] Run all gallery tests, typecheck and lint; confirm success. Remove obsolete entries only after checking whether legacy entry URLs need redirect compatibility.

### Task 4: Prerender and GitHub Pages

**Interfaces:** main.tsx exports `prerender(data)` using the installed preact-iso contract and hydrates in the browser. `GALLERY_BASE` is the build-time root or repository prefix; page registry supplies all prerender paths. `check-gallery.mjs` checks the resulting artifact without importing browser-only modules.

- [x] Add artifact assertions for every registered page index.html, 404.html, English lang/title, nested asset URLs and absence of unresolved template content. Run against current build and confirm expected failures.
- [x] Configure Vite preset prerender and explicit base-aware routes. Remove import-time browser access and hydrate from deterministic server defaults before applying query settings.
- [x] Configure Pages workflow to pass repository base. Preserve its release-package demonstration intent: when building from an older published package without Sidebar, do not silently mix unpublished components with its version. Show an explicit workflow failure until a Sidebar-capable package is available, with a clear diagnostic.
- [x] Build library then gallery at root and `/preact-fluent-ui/` bases; run artifact checks for each.
- [x] Serve production output. Verify direct nested reload, 404, query-selected theme hydration and all assets under the repository base in the T3 browser. Confirm no console hydration errors.

### Task 5: Documentation and final validation

- [x] Document Sidebar composition, props, slots and router independence in README/API; update the existing roadmap to reflect verified status.
- [x] Run `npm run build`, `npm run check`, `npm run build:gallery`, `npm run test:package:all`, artifact checks and `git diff --check`. Investigate failures before claiming completion.
- [x] In the T3 browser verify light/dark, Minimal/Full, narrow menu and long-label scrolling, keyboard focus, copy, dialogs, forms, Signals examples and history with settings. Check RTL and forced-colors where supported.
- [x] Review final diff against the spec and record limitations for real screen readers or unavailable platform checks.
- [x] Record significant outcomes in ICM. Commit only within session authorization; do not push, publish or migrate applications as part of this plan.


The gallery refinement brief in `.superpowers/sdd/gallery-refinements/brief.md` supersedes the original Start group and appearance disclosure. Current groups are Overview, Guides and Components; settings open in the library Modal, and source examples remain visible. The registry has 30 documentation routes including the added Styling guide.
