# SDD ledger — plan: docs/superpowers/plans/2026-10-05-app-sidebar.md

User approved execution 2026-10-05. Branches feat/app-sidebar and RouteVPN feat/fluent-ui-adaptation; no worktrees. Initial tracked trees clean.

## Preflight
| Task/pair | Check | Result |
|---|---|---|
| 1 | class and props rules versus tests | coherent |
| 2 | refs, generic DOM props and clone rules | callback must forward props; broad utility ref corrected below |
| 3 | union types, render, old anchor API | coherent |
| 4 | shell semantics/CSS and tests | coherent |
| 5 | gallery route/docs tests | coherent |
| 6 | migration focus and dependencies | busy removal blocks dismissal explicitly |
| 7 | packed/browser checks | coherent |
| 1/2 | mergeProps composition consumed by render | refs handled by useRender |
| 1/3/4/5 | index exports shared | sequential edits |
| 2/3 | render types consumed by SidebarItem | precise overloads retained |
| 3/4 | SidebarLayout used by shell | same type |
| 3/5 | Sidebar metadata/examples | sequential |
| 4/5 | AppShell examples | iframe avoids nested main |
| 1–5/7 | packed contracts shared | sequential |
| 3/4/6 | library API consumed by RouteVPN | archive after build |
| 5/7 | route fixtures/artifacts | derive counts |
| 6/7 | archive installation/checks | final archive after fixes |

Ruling: useRender ref should be generic over selected tag's DOM element rather than Ref<HTMLElement> only, allowing SVG/native refs and preventing incompatible public refs. Plan broad signature is illustrative; preserve typed root refs. Cost if wrong: type rework.
Ruling: Model cap overrides skill most-capable reviewer request; all workers/reviewers at parent gpt-6.1-sol low or cheaper.

Task 1: in progress

Baseline: library npm test 208/208, RouteVPN npm test 126/126. Browser preview_open created tab_1 but available=false; try navigation after dev server starts.
Browser recovered: preview_navigate to environment port 1420 succeeds; tab_1 RouteVPN baseline available.

Task 1: complete — d649492; RED11/GREEN11 full219, type/lint/format pass. Independent spec/quality approved.
Task 2: in progress — base d649492.
Task2 interim: focused7 green, type/build pass; Preact clone template className alias must be cleared after class normalization to avoid overwriting merged class. Packed contracts/full verification in progress.
Ruling: Task2 may narrowly update both sourcemap whitelist guards for utils and Button-only renderedExports to allow mergeClasses, already an existing Button dependency newly exported in Task1. Component tree shaking guards remain. Cost if wrong: consumer regression, covered by packed checks.

Task 2: complete — 7550363; focused7/full226, type/lint/format/build/packed pass, independent spec/quality approved.
Task 3: in progress — base7550363.
Task3 interim focused10 green, type/build/lint pass, packed native-ref contracts pass. Narrow viewport hint clamp RED reproduced and fixed. Ruling: Button-only renderedExports compares sorted exact membership rather than unstable bundler order; expected members unchanged.

Task3 ruling: compare sorted exact renderedExports membership ['Button', 'mergeClasses'] in package guard. Build export iteration order changed with identical tree-shaken membership; parent approved, all absence checks retained.
Task3 implementation: full232/focused10, type/lint/format/build/dual-peer packed pass. Report task-3-report.md. Independent review pending.
