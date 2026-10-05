# Disclosure, loading feedback and Tooltip implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Add accessible Disclosure, Spinner, LoadingState, Button loading and Tooltip with consumer-informed styles and gallery documentation.

**Architecture:** Native details/summary provide Disclosure behavior. Spinner is shared by LoadingState and Button. Tooltip owns interaction and portal positioning, with separate internal modules for positioning and theme inheritance.

**Tech Stack:** Preact ^10.27.0, TypeScript, CSS modules, Vitest, Testing Library, Vite.

**Spec:** [Approved design](../specs/2026-10-05-disclosure-loading-tooltip-design.md)

## Global constraints

- No new runtime dependencies or consumer repository changes.
- Work in the current checkout without creating a worktree, following the established user preference. Preserve unrelated changes.
- Native attributes and refs, class/className precedence, named public Props exports and named style slots follow existing library conventions.
- Browser globals must not be read during module import or server rendering.
- Localized labels come from callers; library code contains no default operation text.
- Support inherited RTL, light/dark/custom themes, reduced motion, forced colors and native hidden attributes.
- No push, publication or dependency upgrades are part of this plan.

## Review focus

- A loading submit button receives keyboard or programmatic activation: suppress actions and submission without losing focus.
- Tooltip trigger already has descriptions, handlers and a ref: preserve all of them during mount, rerender and unmount.
- Tooltip appears inside a scrollable table or Modal with a local theme: avoid clipping, preserve theme/direction and remain visible above its owning dialog.
- Hover switches between trigger and tooltip, or Escape occurs while focused: preserve hoverability and dismissal until a new interaction.
- Components receive hidden, long content, or an RTL ancestor: preserve native visibility and avoid page overflow.

## File map

- Create `src/components/disclosure.tsx`, `disclosure.module.css`, `disclosure.test.tsx` for the three native parts.
- Create `src/components/spinner.tsx`, `spinner.module.css`, `spinner.test.tsx` for the shared indicator.
- Create `src/components/loading-state.tsx`, `loading-state.module.css`, `loading-state.test.tsx` for status composition.
- Modify `src/components/button.tsx`, `button.module.css`; create `button-loading.test.tsx` for activation and accessible state.
- Create `src/components/tooltip.tsx`, `tooltip.module.css`, `tooltip.test.tsx`; internal `tooltip-position.ts`, `tooltip-position.test.ts`, `tooltip-theme.ts` own geometry and inherited appearance.
- Extend `src/index.ts`, `scripts/check-dist.mjs`, `tests/package-consumer/src/api-contract.tsx` for exports and package contracts.
- Create `examples/gallery/src/gallery-feedback-examples.tsx`; integrate `gallery-pages.tsx`, `gallery-demos.tsx`, `code-samples.ts` and gallery tests as required by existing registry conventions.
- Update `docs/api.md`, `docs/roadmap.md`, `docs/visual-acceptance.md` and `CHANGELOG.md`.

### Task 1: Disclosure

**Interfaces:** Export Disclosure using native details attributes plus `appearance?: 'default' | 'card'`; DisclosureSummary uses summary attributes; DisclosureContent uses div attributes. Forward HTMLDetailsElement, HTMLElement and HTMLDivElement refs respectively. All return JSX.Element and export matching Props types.

- [x] Write `disclosure.test.tsx`: assert details/summary/div structure, native open/name/onToggle forwarding, changing open on rerender, exact ref targets, class precedence, hidden and long nested content. Use user-event for summary keyboard activation where jsdom supports native behavior; verify real toggling in browser acceptance.
- [x] Run `npx vitest run src/components/disclosure.test.tsx`; expect missing exports before implementation.
- [x] Implement the parts, exports and CSS: 14px semibold summary, 8px block padding, 8px content separation, compact transparent default, themed card option, focus outline and directional chevron. Do not impose scrolling on content.
- [x] Run the targeted test and `npm run typecheck`; expect passing results.
- [x] Review the task diff and commit `feat: add native disclosure components`.

### Task 2: Spinner and LoadingState

**Interfaces:** Spinner extends span attributes with `size?: 'small' | 'medium' | 'large'`, `label?: string` and root/indicator/label class slots. LoadingState extends div attributes with required `label: string`, `appearance?: 'default' | 'inline'`, optional children and root/spinner/label/content slots. Forward native span/div refs. Both return JSX.Element and export Props types.

- [x] Write spinner/loading-state tests: labeled spinner has one named status, unlabeled spinner is decorative, LoadingState has exactly one status with decorative spinner, labels/descriptions update on rerender, refs/classes/hidden are preserved. Include long localized labels.
- [x] Run `npx vitest run src/components/spinner.test.tsx src/components/loading-state.test.tsx`; expect missing exports.
- [x] Implement Spinner with 16/24/32px sizes, currentColor segment, muted track, static incomplete ring under reduced motion and distinguishable forced colors. Implement LoadingState with 48px/24px card padding and 12px gap, or horizontal borderless inline layout with 8px gap. Add public exports.
- [x] Run the targeted tests and `npm run typecheck`; expect passing results.
- [x] Review and commit `feat: add spinner and loading state`.

### Task 3: Button loading

**Consumes:** Spinner from Task 2.

**Produces:** Extend ButtonProps with `loading?: boolean`, `loadingLabel?: string`; preserve native button ref and existing variant/size API. Add content/spinner slots if necessary without changing existing class precedence.

- [x] Write `button-loading.test.tsx`: loading text button keeps accessible name by default, explicit loadingLabel replaces text, icon-only name remains unchanged, aria-busy/aria-disabled are set, native disabled takes precedence, focused button remains focused on entering loading, caller click handler and form submission are suppressed for pointer/keyboard/programmatic click. After loading ends, handler and submit work again.
- [x] Run `npx vitest run src/components/button-loading.test.tsx`; expect failures for absent loading behavior.
- [x] Implement guarded click composition and decorative small Spinner. Preserve textual children and show spinner before them; replace visible icon content for size=icon. Keep variant foregrounds and existing 32/34/36px heights. Suppress pending hover/pressed presentation without dimming all busy content.
- [x] Run `npx vitest run src/components/button-loading.test.tsx src/components/controls.test.tsx src/components/confirm-dialog.test.tsx` and typecheck; expect passes.
- [x] Review and commit `feat: support button loading state`.

### Task 4: Tooltip

**Interfaces:** Export TooltipProps with required `content: string`, `placement?: 'top' | 'bottom' | 'left' | 'right'`, `triggerProps?: JSX.HTMLAttributes<HTMLElement>`, `children: (props: TooltipTriggerProps) => VNode`, optional root/content classes. Export TooltipTriggerProps containing composed ref, pointer/focus handlers and aria-describedby. Tooltip returns JSX.Element. Caller forwards the supplied props to one interactive DOM element; triggerProps carries existing handlers/descriptions/ref for composition.

**Internal interfaces:** `getTooltipPosition(anchor: DOMRect, tooltip: {width:number;height:number}, viewport: {width:number;height:number}, placement: TooltipPlacement): {left:number;top:number;placement:TooltipPlacement}` is pure geometry. `copyTooltipTheme(trigger: HTMLElement, target: HTMLElement): void` copies computed library CSS custom properties, effective color-scheme and dir. Neither internal helper is a package-root export.

- [x] Write geometry tests for all placements, 8px gap, flipping, edge shifting and oversized content. Write interaction tests for 500ms hover delay, immediate focus, trigger-to-tooltip hover, Escape suppression, description deduplication, composed caller handlers/ref, rerendered content and unmount timer cleanup. Assert no wrapper is added around the trigger.
- [x] Run `npx vitest run src/components/tooltip-position.test.ts src/components/tooltip.test.tsx`; expect missing implementation.
- [x] Implement pure positioning with 8px viewport padding, flipping then shifting. Implement theme inheritance for all computed library variables so custom themes work. Keep tooltip max-width at min(280px, available viewport width).
- [x] Implement visibility state, useId, composed trigger props/ref, portal lifecycle and Escape listener. Focus or tooltip hover must keep it open when pointer leaves trigger. Escape clears timers and suppresses reopening until interaction ends. Remove handlers/observers/timers on teardown.
- [x] Implement resize/scroll/ResizeObserver positioning, portal above Modal, and inherited direction/theme. Inspect Modal mounting and z-index conventions before selecting the portal layer. Listen for captured scroll events so nested table scrolling repositions the tooltip.
- [x] Implement CSS with raised surface, themed border, 4px radius, subtle shadow, 12px/16px typography and 6px/8px padding. Tooltip itself receives pointer events for hoverability and contains no controls.
- [x] Run targeted tests and typecheck; expect passes. Add browser cases for custom-themed Modal, nested scrolling and viewport collisions to Task 6.
- [x] Review and commit `feat: add accessible tooltip`.

### Task 5: Public contracts and gallery documentation

**Consumes:** All public APIs from Tasks 1–4.

- [x] Extend package type-contract and DOM-free export probes with every new component and Props type. Typecheck valid native props/ref targets and reject invalid sizes/placements. Add loading Button to the packed consumer fixture.
- [x] Add gallery examples for error details, paired file disclosures, initial and inline loading, busy button variants and icon-only actions, Tooltip in TableContainer and Modal. Use localized labels and explicit icon-button aria-label.
- [x] Add family pages and code samples through the existing gallery registries; extend navigation/route tests and artifact checks for the added pages. Use Table for API tables and retain current documentation spacing conventions.
- [x] Update API, changelog, roadmap and acceptance documentation. Explain native open/onToggle, loading versus disabled, single status announcements, triggerProps composition and disabled trigger limitations.
- [x] Run `npm run check`, `npm run build`, `npm run build:gallery`, `npm run test:package:all`, `npm run test:gallery-artifact`, `npm run test:gallery-preview`; expect all checks passing. Investigate failures before proceeding.
- [x] Review and commit `docs: document disclosure loading and tooltip components`.

### Task 6: Browser acceptance and final review

- [x] Use the T3 collaborative preview: preview_status, preview_open if needed, then gallery navigation and focused interactions. If tools are absent, use the supported available browser fallback. Record what could and could not be verified.
- [x] Verify each new page at 320px and 1280px in light/dark, custom theme and global RTL. Check no page overflow, readable loading states, unchanged button heights, native disclosure keyboard toggling and focus preservation during busy transitions.
- [x] Verify Tooltip delayed hover, immediate keyboard focus, Escape, hover over tooltip, nested table scroll, every viewport edge and local-themed Modal. Assert no clipping and no focus changes; verify trigger descriptions stay associated.
- [x] Verify reduced-motion and forced-colors behavior where supported. Explicitly record unsupported platform checks instead of claiming them passed.
- [x] Fix confirmed defects, rerun the checks affected by those changes, and update acceptance evidence.
- [x] Request independent review under the selected execution workflow; address findings before completion. Use only provider/model/effort settings permitted by the parent limits.
- [x] Run final `git diff --check` and inspect repository status. Store significant completion and any resolved errors in ICM before reporting results. Do not publish or merge.
