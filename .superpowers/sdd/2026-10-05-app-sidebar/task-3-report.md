# Task 3 report

Implemented application Sidebar in the current `feat/app-sidebar` checkout.

## Changes

- Added exported SidebarLayout, Signalish layout/scrollable and opt-in app appearance. Existing aside/nav/group/header/footer landmarks remain.
- Added SidebarBrand with native div ref/hidden, decorative logo, title/description and five slots. Rail keeps the title visible without a logo.
- SidebarItem is a single overloaded anchor/button component. Native button type defaults to button. Anchor href is required unless render is supplied. Native refs/events stay tied to the discriminant; packed contracts reject href/target/download/active/current-page on buttons, disabled on anchors and mismatched refs.
- Item root uses useRender, preserves composed children, slots/classes and custom Link/template composition without nested controls.
- Added app rows at 44px and four local color variables. Expanded default rules remain; rail preserves accessible item/group names and no-icon labels, horizontal uses row groups/navigation and a bottom active marker.
- Scrollable nav uses flex:1/min-height:0/overflow; header/footer do not shrink. New roots have scoped hidden rules. Logical indicators, border-box, forced colors and reduced motion are included.
- Rail hints are private aria-hidden, noninteractive portals outside nav overflow. Hover and focus-visible open them, Escape dismisses, blur/mouseleave close them, and scroll/resize update their geometry. Position respects RTL and viewport edges. Effects remove subscriptions on unmount.
- Split root/item/brand/context/hint files to keep each focused. No gallery files changed.

## TDD and validation

Observed three expected initial Sidebar failures for missing native button, layout/brand/hint and custom-root behavior. Added a narrow-viewport case, observed 72px versus required 8px, then clamped geometry. Packed new contracts failed against Task2 declarations for unsupported button refs/events and render, then passed against this build.

- Sidebar focused: 10/10.
- Full npm test: 232/232 in 20 files.
- npm run typecheck, lint, format:check and build: passed.
- npm run test:package:all: passed with Preact 10.29.8 and 10.27.0, one archive SHA256 d22f06bce7cc6df6b56a48811fdb8d9ce585ec10f9d35eedbacf491dc78a43d1. Both full/minimal builds and packed negative contracts passed.
- git diff --check: passed.

Intermediate issues were fixed: component context helper must use .tsx for the existing sourcemap whitelist; real HTMLElement.focus()/blur() in act exercises compat keyboard focus reliably, unlike the synthetic focus tests. A packed guard compared rendered export order, which changed despite identical membership. Parent approved comparing sorted exact membership ['Button', 'mergeClasses']; all absence guards remain.

Browser acceptance remains scheduled in Task7; this task used DOM/CSS and packed validation. No publish, push, branch switch or worktree creation.

## Review fix: Escape dismissal persists

Added a dismissal latch for the current hover/focus interaction. Escape keeps the portal closed until both pointer hover and native focus have ended. Focus-visible is tracked separately from native focus so a pointer-focused trigger does not prematurely clear the latch. A new interaction can open the hint normally.

TDD regression cases both failed before the fix: Escape then mouseleave while focused, and Escape then blur while hovered. Both now pass, including re-entry while the other interaction remains and reopening after both have ended. The test supplies the browser's focus-visible match because jsdom does not consistently retain keyboard modality; actual focus/blur events and portal behavior remain real.

Covering validation:
- `npm test -- src/components/sidebar.test.tsx src/utils`: 26/26 in three files, including 12 Sidebar tests.
- `npm test`: 234/234 in 20 files.
- `npm run typecheck`, `npm run lint`, `npm run format:check`: passed.
- `git diff --check`: passed.

Only item implementation, Sidebar tests and this report changed for the fix. Public types and CSS unchanged.
