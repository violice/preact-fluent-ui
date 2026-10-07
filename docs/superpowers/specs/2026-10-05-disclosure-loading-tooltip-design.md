# Disclosure, loading feedback and Tooltip

Status: approved by the user on 2026-10-05 and implemented. Automated and browser layout checks pass; foreground input, screen-reader and unavailable media-mode checks are recorded in docs/visual-acceptance.md.

## Goal and scope

Add Disclosure, Spinner, LoadingState, Button loading and Tooltip to the public Preact library. Match the actual consumer layouts and existing theme tokens. Add gallery documentation, examples, behavior tests and package export checks. Consumer repositories are evidence for design; their migration is a separate task.

## Consumer evidence

Inspected current source in `/home/violice/dev/route-vpn`, `port-proxy`, `xbox-dns` and `hosts-editor`. All four declare `@violice/preact-fluent-ui`; Route VPN uses 0.3.0 and the other three use 0.1.0.

- Route VPN `widgets/vpn-overview/ui/message-details.tsx` uses native details/summary for error details. Its overview CSS adds an 8px top gap and wraps diagnostic text at 12px.
- Hosts Editor `shared/ui/text-comparison.tsx` uses two disclosures, with the proposed file initially open. Its CSS uses 8px summary block padding, semibold text and a 12px gap between disclosures. The preformatted file viewer has its own scrolling and 220px maximum height.
- Hosts Editor `widgets/hosts-overview/ui/workspace-notices.tsx` discloses ambiguous entries inside a warning.
- Route VPN `widgets/vpn-overview/ui/workspace-state.tsx` renders loading text with role=status inside Card. Port Proxy `pages/rules/ui/rules-page.tsx` and Hosts Editor entries/backups reuse EmptyState for loading. XBOX DNS connection/adapter pages combine loading and empty presentation.
- Hosts Editor apply/backup actions and XBOX DNS refresh/diagnostics actions replace labels while busy. Actions use disabled separately to enforce domain restrictions.
- Port Proxy rule rows and Hosts Editor entry/backup rows have compact icon actions with explicit aria-label and native title. Tooltip must preserve those accessible names.

## Approach

Use native details/summary for Disclosure, CSS for the indeterminate spinner, and composition for LoadingState and Button. Tooltip needs managed visibility and viewport positioning. Keep native props, refs, class/className and named style slots consistent with existing components.

Alternatives: a fully scripted accordion introduces unnecessary state and keyboard management for the existing disclosure scenarios. A CSS-only tooltip would be simpler but would be clipped by scrolling tables and would not support Escape and viewport collision handling reliably. Neither is recommended.

## Disclosure

Export Disclosure, DisclosureSummary and DisclosureContent with their prop types. Root is details, summary is its first child, content is a div. Support native open, name and onToggle rather than inventing a second controlled-state API. Consumers read currentTarget.open in onToggle when synchronizing state.

Default appearance is compact and transparent for InfoBar and dialog content. An appearance=card option adds a themed border, card background and radius. Summary has 8px block padding, 14px semibold text, a directional chevron and a visible keyboard focus outline. Content has an 8px top separation. Do not impose typography or maximum height on file/diagnostic content. Native keyboard behavior and grouping remain browser-owned. Use logical spacing and an RTL-aware chevron.

## Spinner and LoadingState

Spinner supports small/medium/large sizes of 16/24/32px and an optional localized label. A labeled standalone spinner is a status; an unlabeled spinner is decorative and aria-hidden. The ring uses currentColor with a muted track. Reduced motion shows a static incomplete ring. Forced colors preserves a distinguishable track and segment.

LoadingState requires a localized label, accepts optional descriptive children and uses a decorative Spinner inside one role=status container. Default presentation matches EmptyState: centered card, 48px block and 24px inline padding, 12px internal gap. An inline appearance has no card or large padding and uses a horizontal 8px gap for compact sections. Avoid implicit page headings and focus changes. The owning application controls when the state appears and whether existing results remain visible during refresh.

## Button loading

Add loading?: boolean and loadingLabel?: string. Retain the existing label unless loadingLabel is supplied. Put a decorative 16px Spinner before textual content; an icon-only button replaces its visible icon with the spinner while retaining its accessible name. Preserve the existing 32/34/36px button heights and all variants.

Loading sets aria-busy and aria-disabled, suppresses click activation including form submission, and retains focus. Explicit disabled continues to use native disabled and takes precedence. Loading alone does not turn on native disabled. Guard programmatic click and pointer/keyboard activation through the button click handler. Keep busy styles readable using the variant's foreground color. Do not add a separate live region to every button; application status or LoadingState can announce an operation.

## Tooltip

Require localized content and a render-function child which receives trigger ref, handlers and aria-describedby. This follows the explicit prop wiring used by Field and avoids a new wrapper affecting table cells and toolbars. Compose caller handlers, refs and existing description IDs rather than overwrite them. The trigger retains its own aria-label.

Show after a 500ms hover delay and immediately on keyboard focus. Hide on pointer/focus departure and Escape. Hovering the tooltip keeps it visible; no interactive content is allowed. Escape keeps it dismissed until the next interaction. Render role=tooltip with a stable useId identifier.

Prefer top placement with bottom/left/right options, an 8px anchor gap, viewport edge padding, flipping and shifting. Reposition on scrolling, resizing and element size changes; remove timers/listeners/observers on unmount. Render in a portal so TableContainer does not clip it. Handle modal stacking and copy the trigger's effective theme tokens and direction to the portal so local/custom themes remain correct. Browser globals are accessed only after mounting.

Use raised surface, text color, themed border, 4px radius, subtle shadow, 12px text, 16px line height and 6px/8px padding. Limit width to 280px and available viewport width, wrap long content. Add no focusable wrapper to disabled controls; document the trigger's native disabled limitations.

## Verification and documentation

Test native disclosure toggling and refs, spinner/status labeling, LoadingState's single announcement container, Button repeated activation suppression and form behavior, tooltip handler/ref composition, delayed visibility, Escape, description merging and cleanup. Verify DOM-free package import and public types/exports.

Gallery examples cover error details, paired file previews, initial list loading, inline refresh, all busy button variants including icon actions, and tooltips in a scrolling table and Modal. Document API tables with the existing Table family. Verify light/dark/custom themes, global RTL, narrow layouts, keyboard focus, tooltip clipping and modal placement in the browser. Run repository typecheck, lint, formatting, tests, build and package checks before completion.
