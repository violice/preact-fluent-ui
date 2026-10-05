# App Sidebar and Route VPN Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship composable Preact utilities and application navigation, documented in the gallery and exercised by a full Route VPN migration.

**Architecture:** Preserve default Sidebar behavior. Add explicit anchor/button semantics, optional render composition, and independent shell parts. Route VPN owns routing, responsive state and Windows operations.

**Tech Stack:** Preact 10, TypeScript, CSS modules, Vitest, Testing Library, existing package and gallery artifact scripts.

**Spec:** `docs/superpowers/specs/2026-10-05-app-sidebar-design.md`

## Global Constraints

- Work in current checkouts on local feature branches from main; no worktrees. Preserve user changes. Use the user's established subagent execution method after plan review.
- Only preact-fluent-ui and route-vpn change. No publishing, push, release or version bump.
- No React/Base UI dependency, router dependency or Signals dependency in production library code.
- Existing class/className precedence, Signalish support, refs, hidden, Minimal/Full and default Sidebar remain compatible.
- Sidebar layouts expanded/rail/horizontal; AppShell widths 248px/64px, content maximum 1240px, desktop workspace margin 8px and radius 12px.
- Route VPN breakpoints max-width:992px and max-width:640px. Preserve URLs/query, duplicate errors, successful add then close then refresh, and focus on interactive elements.
- Gallery group order Overview, Guides, Components, Utils. Alphabetical English Components/Utils, local examples and InfoBar after Example before code.
- Validate one archive in Route VPN with no tracked absolute file dependencies. Restore tracked package manifest/lock after temporary installation. Until release, migrated source requires the local archive.

## Review Focus

- Custom router component forwards ref/props and receives composed children; no nested interactive element. Task 2.
- Signal changes, callback refs and unmount do not lose updates or call a handler twice. Tasks 1–2.
- Keyboard-only rail users can identify each link; tooltip remains visible across scroll boundaries. Task 3 and browser acceptance.
- Route VPN dialog mutation errors and removed opener elements retain accessible controls and focus. Task 6.
- Packed types reject invalid element props/ref combinations, not just source types. Task 7.

## Task 1: Props and class utilities

**Files:** create `src/utils/merge-props.ts`, `src/utils/merge-props.test.ts`; modify `src/classes.ts`, create `src/classes.test.ts`; modify `src/index.ts`.

**Interfaces:** export existing `mergeClasses(...classes: JSX.Signalish<string | undefined>[]): string` and `resolveClass(classProp, className): string | undefined` without changing contracts. Export `mergeProps<P extends object>(...sources: (Partial<P> | null | undefined)[]): P`. Consumers select P for their DOM attributes. ref is excluded from composition and documented as useRender's responsibility; an encountered ref follows ordinary right precedence.

- [ ] Write tests pinning `resolveClass('', 'fallback') === ''`, nullish fallback, Signalish values, ordered classes, untouched input objects, ordinary right precedence and null sources.
- [ ] Test `{onClick: internal}` then `{onClick: external}` calls external then internal exactly once; external preventDefault suppresses internal. Native events and custom no-event callbacks must not throw.
- [ ] Test class/className resolution per source, object style merge, object→string and string→object replacement.
- [ ] Run `npx vitest run src/classes.test.ts src/utils/merge-props.test.ts` and observe missing API failures, then implement and rerun green. Run `npm run typecheck`.
- [ ] Commit only utility files/exports and tests.

## Task 2: Preact useRender

**Files:** create `src/utils/use-render.ts`, `src/utils/use-render.test.tsx`; modify `src/index.ts` and `tests/package-consumer/src/api-contract.tsx`.

**Interfaces:** define `RenderProp<P, S> = VNode | ((props: P, state: S) => VNode)` and `UseRenderOptions<Tag extends keyof JSX.IntrinsicElements, S extends object = Record<string, never>>` with defaultTagName:Tag, render?:RenderProp<JSX.IntrinsicElements[Tag], S>, props?:JSX.IntrinsicElements[Tag], ref?:Ref<HTMLElement> | readonly Ref<HTMLElement>[], state?:S. Export `useRender<Tag, S>(options: UseRenderOptions<Tag, S>): VNode`. Internal ref casts may bridge Preact types; public SidebarItem must separately keep precise refs. Callback state defaults to an empty object. state is callback data only, no automatic data-* mapping in v1.

- [ ] Test default element/props/children, VNode replacement without wrapper, and callback receiving state and final props including composed ref.
- [ ] Test a forwardRef custom Link: incoming href and ref reach its anchor; component children remain when template children absent; explicit template children win.
- [ ] Test ref arrays plus template ref receive the same node and null on unmount, ref identity changes clear old refs. Use stable composed callback and preserve cleanup behavior.
- [ ] Test template props override source props using Task 1's merge rules, one invocation per handler and preventDefault. Test Signalish class and state updates through a rendered component.
- [ ] Observe red with `npx vitest run src/utils/use-render.test.tsx`, implement via Preact createElement/cloneElement and hook ref composition, rerun green and typecheck. Document that callbacks must forward props/ref.
- [ ] Add compile examples for native root and custom Link and commit.

## Task 3: Application Sidebar

**Files:** modify `src/components/sidebar.tsx`, `src/components/sidebar.module.css`, `src/components/sidebar.test.tsx`, `src/index.ts`; create `src/components/sidebar-item.tsx` and `src/components/sidebar-brand.tsx` if needed to keep files focused; modify `tests/package-consumer/src/api-contract.tsx`.

**Interfaces:** export `SidebarLayout = 'expanded' | 'rail' | 'horizontal'`. Sidebar props add Signalish layout/scrollable and appearance default/app. SidebarBrand props title:string, description?:string, logo?:ComponentChildren and slots root/logo/content/title/description. SidebarItem common icon/children/description/label/slots root/icon/content/description, optional render from Task 2. Discriminant as?:'a' versus as:'button'; anchor href required unless render supplied, button href/target/download/active prohibited. Anchor disabled prohibited. Public overloads accept Ref<HTMLAnchorElement> or Ref<HTMLButtonElement> respectively, with element-specific event types. Existing SidebarItemProps export remains the union.

- [ ] Extend tests for old anchor API/ref, button type/disabled/click/ref, current page only on anchor, description, slots and class precedence, layout/scrollable Signal changes, Brand without logo, and hidden on every new root.
- [ ] Add type contracts rejecting button href/active, anchor disabled, missing href without render, and mismatched ref. Valid custom Link render with URL in template passes.
- [ ] Implement using useRender for item root; resolve semantic defaults before rendering. Use sidebar context for presentation only, with sensible defaults for standalone items.
- [ ] Add appearance app with 44px rows and four specified CSS variables. Keep default CSS unchanged. Implement rail visually hidden names, no-icon fallback, group naming, horizontal nav/groups and bottom active marker.
- [ ] Implement keyboard/hover rail hints through a portal outside nav overflow; keep hint aria-hidden and noninteractive, track trigger rect on scroll/resize and clean listeners. Test Escape dismissal and no duplicate accessible name; no public Tooltip export.
- [ ] Implement scrollable nav min-height:0/flex:1/overflow with nonshrinking header/footer. Use logical properties, scoped hidden, forced-colors, border-box and reduced-motion.
- [ ] Run sidebar/utils tests and typecheck green after observing the new tests fail, then commit.

## Task 4: AppShell

**Files:** create `src/components/app-shell.tsx`, `src/components/app-shell.module.css`, `src/components/app-shell.test.tsx`; modify `src/index.ts`, `tests/package-consumer/src/api-contract.tsx`.

**Interfaces:** AppShell div has Signalish navigationLayout default expanded. AppShellWorkspace main, AppShellHeader/Content/Footer div each accept native attributes and appropriate ref. Export matching props types following existing library convention. Consume Task 3 SidebarLayout.

- [ ] Test div/main semantics, one main, ref, class precedence, all scoped hidden roots, attributes and Signal layout updates.
- [ ] Observe red, implement five parts and CSS geometry from spec. AppShell styles only direct Sidebar/Workspace children, using explicit component data attributes rather than relying on hashed class names.
- [ ] Add no-reset verification to consumer example. Variables control navigation widths and content padding/max-width; no media queries or matchMedia in library shell.
- [ ] Run focused tests and typecheck, commit.

## Task 5: Gallery and public docs

**Files:** create `examples/gallery/src/gallery-utils.tsx`, `examples/gallery/src/gallery-app-shell-examples.tsx`; modify `gallery-sidebar-examples.tsx`, `gallery-pages.tsx`, `gallery.tsx`, `gallery-routing.test.tsx` in that directory; modify `README.md`, `docs/api.md`, `docs/tokens.md`, `docs/visual-acceptance.md`, `CHANGELOG.md` and artifact fixtures where routes are enumerated.

**Interfaces:** four Utils pages from spec, new component pages SidebarBrand and five AppShell parts; existing six Sidebar pages gain the new API. Export utility page registry from gallery-utils and component demo metadata from focused example modules.

- [ ] Add route/group tests expecting Utils last, alphabetical utilities and reachability of all new pages with base-aware links. Existing route list is derived, not hardcoded to old counts.
- [ ] Build isolated useRender custom Link/native root examples, mergeProps cancellation example, Signals class helpers examples and Sidebar layouts/long menu/application shell. No hooks at module scope, no nested main inside an existing gallery main: shell demo uses a separate preview document when it includes Workspace.
- [ ] Keep preview→InfoBar→code order and spacing. Document render forwarding, as semantics, ref responsibility, merger ordering/style rules and local archive requirement.
- [ ] Run gallery tests, `npm run build:gallery`, `npm run test:gallery-artifact`, `npm run test:gallery-preview`; fix actual failures and commit.

## Task 6: Route VPN migration

**Files under `/home/violice/dev/route-vpn`:** modify `src/shared/ui/index.ts`, `src/app/routes/app-navigation.tsx`, `src/app/routes/app-shell.tsx`, `src/app/routes/app-shell.module.css`; create `src/app/routes/use-navigation-layout.ts` and test. Modify `src/entities/vpn/ui/vpn-picker.tsx`, `src/features/add-vpn-route/ui/route-prefix-input.tsx`, `route-form.tsx`, `route-form-feedback.tsx`, `route-form.module.css`; modify `src/pages/profile/ui/split-tunneling-switch.tsx`, `split-tunneling-control.module.css`, `src/pages/routes/ui/remove-route-dialog.tsx`, its CSS, `src/widgets/vpn-overview/ui/workspace-state.tsx`. Extend existing app/form/profile/workflow tests.

**Interfaces:** local `useNavigationLayout(): SidebarLayout` returns horizontal <=640px, rail <=992px, otherwise expanded, initial SSR expanded and mount listener cleanup. Import library shell as FluentAppShell to preserve local name. Re-export used library components through shared/ui.

- [ ] Record baseline checks and tracked manifests/lock; build library and `npm pack --pack-destination <temporary-directory>`, install archive with `npm install --no-save --package-lock=false <archive>`. Restore any tracked manifests altered by npm without discarding unrelated changes. Check 0.2 Select migration immediately.
- [ ] Test layout boundaries 640/641/992/993px and subscriptions removed on unmount. Navigation preserves query, active link, anchor ref, settings callback and keyboard button behavior.
- [ ] Replace navigation and shell with library parts; preserve all context providers/routes, use main only at Workspace, configure local existing palette through variables. Hide brand at horizontal only; settings action remains available.
- [ ] Replace prefix field with Field/Input. Move all field validation messages and normalized-prefix hint into Field props; retain alert announcements in message content. Remove duplicates from RouteFormFeedback; keep its InfoBar warning. Test input label, describedby, invalid states, duplicate/server conflict/save errors and opener focus.
- [ ] Replace split switch with Switch; keep state label and accessible name. Inspection shows no persistent confirmation checkbox in current app, so add none. Keep SplitConfirmationDialog because it exposes confirm/cancel refs and existing focus behavior.
- [ ] Migrate removal to ConfirmDialog danger/cancel-first/fallback. During busy both actions and Escape close are disabled by ConfirmDialog, preventing dismissal of an in-flight mutation; add a test for this explicit behavior. Preserve errors and restore interactive focus.
- [ ] Replace error/empty profile cards with EmptyState and actions, retaining loading role=status and Russian copy. Audit remaining Button/Card/InfoBar/PageHeader/StatusBadge/Icon use and delete only obsolete duplicated styles.
- [ ] Run `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm test`, `npm run check:fsd`, `npm run test:fsd`, `npm run build` and `npm run licenses:check`. Commit source migration only after passing; tracked dependency files remain unchanged until a separately authorized release.

## Task 7: Packed contracts and browser acceptance

**Files:** modify `scripts/check-dist.mjs`, `scripts/check-release.mjs` only where public export assertions require it; extend package consumer examples/contracts, create `.superpowers/sdd/app-sidebar/acceptance.md` recording evidence.

- [ ] Run `npm run build`, `npm run check`, `npm run test:package:all`, gallery artifact and preview tests. Verify public Utils imports stay DOM-free and Button-only tree shaking still omits Sidebar/utility hooks.
- [ ] Build a final archive after all library fixes, reinstall the same archive into Route VPN and rerun its checks after any final changes.
- [ ] Use T3 preview tools first for browser checks. Record 320/640/768/1280px, light/dark and Minimal/Full gallery demos, rail tooltip focus, long menu at short height, horizontal scroll, RTL, 200% zoom and forced-colors/reduced-motion. Record any platform checks genuinely unavailable rather than treating them as passed.
- [ ] Exercise Route VPN demo routes, profile selection, Windows settings callback in mocked/demo environment, invalid/duplicate/wide route form, success close-before-refresh, removal, profile switch confirmation and errors. Verify navigation/query/focus after responsive transitions.
- [ ] Independent final review checks spec coverage and regressions; fix findings and rerun affected checks. Record archive path/hash and the dependency on future package release. No push/publication.

## Self-review

Tasks 1–2 cover composition contracts, Task 3 Sidebar semantics/accessibility,
Task 4 shell geometry, Task 5 docs, Task 6 real consumer and Task 7 packaged
and browser evidence. Existing focus-specific split dialog stays composed;
no artificial checkbox is introduced. Exact generic contracts above are
the v1 scope, not a promise of arbitrary element inference from opaque VNodes.
