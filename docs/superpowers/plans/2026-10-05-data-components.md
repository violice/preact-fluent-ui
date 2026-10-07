# Data components implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Add reusable Table, Pagination, DataToolbar, DataList, and Separator families with documentation and verified package exports.

**Architecture:** Native semantic elements and controlled pagination follow existing forwardRef and CSS module conventions. Data operations remain in consumers; layout containers compose through children. Each family ships independently before the integrated gallery and package acceptance task.

**Tech stack:** Preact ^10.27.0, TypeScript, CSS modules, Vitest, Testing Library, Vite.

**Spec:** [Data components design](../specs/2026-10-05-data-components-design.md)

## Global constraints

- No new runtime dependencies.
- Preserve native attributes, native element refs, inherited HTML dir, and existing class/className precedence via resolveClass and mergeClasses.
- Use named component and Props exports consistent with the existing library.
- Filtering, sorting, data slicing, network operations, and domain validation remain consumer-owned.
- Consumer migration, publication, and dependency updates are outside this task.
- Do not create worktrees unless the user chooses isolation. Execution workspace and branch are resolved at execution time; do not change branches while planning.
- Test observable behavior and accessibility contracts; verify visual layout in the browser rather than asserting CSS implementation details.

## Review focus

- Pagination receives a stale page after results shrink: display a valid page without emitting an unsolicited callback.
- Tables contain row headers and spanning cells: native scope, headers, colSpan, and rowSpan remain intact.
- Controls and metadata contain long values or RTL text: preserve reading order and avoid page-level horizontal overflow.
- Native hidden, class, and ref attributes are used: styles must not override hidden and refs must target the documented elements.
- Separators appear among keyboard controls: decorative elements remain unannounced and unfocusable; semantic orientation is accurate.

## File map

Create component, CSS module, and behavior test files under src/components for
table, pagination, data-toolbar, data-list, and separator. Each family owns its
parts in one TSX module. Extend src/index.ts, scripts/check-dist.mjs, and
tests/package-consumer/src/api-contract.tsx for the public contract.

Create examples/gallery/src/gallery-data-examples.tsx for demos and snippets;
integrate family documentation in gallery-pages.tsx. Modify gallery.test.tsx,
scripts/check-gallery.mjs and scripts/check-gallery.test.mjs where route and
artifact assertions require new families. Update docs/api.md, docs/roadmap.md,
docs/visual-acceptance.md and CHANGELOG.md. Do not restructure unrelated docs.

### Task 1: Table family

**Files:** Create src/components/table.tsx, table.module.css, table.test.tsx; modify src/index.ts.

**Interfaces:** Export Table(table), TableContainer(div), TableHeader(thead),
TableBody(tbody), TableFooter(tfoot), TableRow(tr), TableHeaderCell(th),
TableCell(td), TableCaption(caption), and matching Props types. Extend native
element attribute types; Table accepts density?: 'regular' | 'compact'; cells
accept align?: 'start' | 'center' | 'end'. Components return JSX.Element and
forward refs to the indicated native element.

- [x] Write tests rendering a labelled table with all parts. Assert caption association, exact element/ref targets, default scope='col', explicit scope='row', preserved headers and spanning attributes, native event handlers, and hidden forwarding. Include class/className precedence using the existing convention.
- [x] Run `npx vitest run src/components/table.test.tsx`; confirm failure because the family is absent.
- [x] Implement parts and exports. Default density is regular, alignment start, header scope col. Table has no wrapper. TableContainer supplies optional horizontal overflow without automatic tabindex. Use logical spacing, theme backgrounds and borders, and body-row hover. Do not impose mobile column hiding or grid roles.
- [x] Run the focused tests and `npm run typecheck`; expect success. Verify regular/compact styles manually during Task 6.
- [x] Commit the family with `feat: add semantic table components`.

### Task 2: Pagination

**Files:** Create src/components/pagination.tsx, pagination.module.css, pagination.test.tsx; modify src/index.ts.

**Interfaces:** Export Pagination and PaginationProps. Props extend nav HTML
attributes with required page: number, pageCount: number,
onPageChange: (page: number) => void, previousLabel: string, nextLabel: string,
and 'aria-label': string; optional disabled: boolean and
formatPageLabel: (page: number, pageCount: number) => ComponentChildren.
Forward an HTMLElement ref to nav. Reuse existing Button.

- [x] Write behavior tests: page=1/pageCount=3 disables previous, next emits 2; page=3 disables next, previous emits 2; pageCount=0 renders '0 / 0' with both buttons disabled; disabled blocks both callbacks. Rerender page=8/pageCount=3 and assert '3 / 3', no callback during rerender, previous emits 2. Assert custom labels/formatter, nav accessible name, ref, hidden, and keyboard focus retention on rerender.
- [x] Run `npx vitest run src/components/pagination.test.tsx`; confirm missing-component failures.
- [x] Implement controlled one-based navigation. Clamp stale page for rendering and button callbacks only; no state synchronization effect or callback during render. Default formatter outputs 'page / pageCount'. pageCount is a nonnegative integer by API contract. No numbered buttons, page-size select, record counting, or slicing.
- [x] Run focused tests and `npm run typecheck`; expect success.
- [x] Commit with `feat: add controlled pagination`.

### Task 3: DataList

**Files:** Create src/components/data-list.tsx, data-list.module.css, data-list.test.tsx; modify src/index.ts.

**Interfaces:** Export DataList(dl), DataListItem(div), DataListLabel(dt),
DataListValue(dd), and matching Props types. DataList accepts
direction?: 'horizontal' | 'vertical', default horizontal. Use native
attributes and refs; direction describes each label/value pair, not HTML dir.

- [x] Write tests asserting dl > div > dt/dd composition, native ref targets, rich value children including links and badges, native attributes/hidden, and class precedence. Render horizontal/default/vertical roots and verify direction is consumed rather than forwarded as an invalid HTML attribute; inherited dir='rtl' remains intact.
- [x] Run `npx vitest run src/components/data-list.test.tsx`; confirm failure.
- [x] Implement exports and styles. Horizontal items share a label column, using a layout that preserves item wrappers and semantic markup; stack below 600px. Vertical stays stacked. Reset dl/dd margins, use muted labels, and allow long values to wrap. No implicit separators.
- [x] Run focused tests and `npm run typecheck`; expect success. Cover shared label alignment, both directions, long values, and RTL in Task 6 browser verification.
- [x] Commit with `feat: add directional data lists`.

### Task 4: Separator

**Files:** Create src/components/separator.tsx, separator.module.css, separator.test.tsx; modify src/index.ts.

**Interfaces:** Export Separator and SeparatorProps. Props extend native div
attributes excluding role, aria-hidden, and aria-orientation, plus
orientation?: 'horizontal' | 'vertical' and decorative?: boolean.
Defaults are horizontal and true. Ref is HTMLDivElement.

- [x] Write tests asserting default role='none'/aria-hidden='true', semantic role='separator' and both aria-orientation values, semantic labels, native ref/class/style/hidden forwarding, and no default tabindex. Assert semantic mode does not retain decorative aria-hidden.
- [x] Run `npx vitest run src/components/separator.test.tsx`; confirm failure.
- [x] Implement derived semantic attributes and exports. Use theme border color and one-pixel logical sizing. Vertical stretches in flex layout; allow consumer sizing. Do not add margins or focus handling; include forced-colors styles.
- [x] Run focused tests and `npm run typecheck`; expect success. Verify vertical sizing and forced colors during Task 6.
- [x] Commit with `feat: add decorative and semantic separators`.

### Task 5: DataToolbar

**Files:** Create src/components/data-toolbar.tsx, data-toolbar.module.css, data-toolbar.test.tsx; modify src/index.ts.

**Interfaces:** Export DataToolbar and DataToolbarGroup, matching Props types,
native div attributes and HTMLDivElement refs. Group accepts
align?: 'start' | 'end', default start. Consume existing controls and Task 2/4
components through children; there is no mandatory dependency on those parts.

- [x] Write tests for native refs, attributes, hidden and class precedence, preservation of children/control handlers, no implicit role='toolbar', and groups preserving DOM order in dir='rtl'. Confirm align is consumed rather than forwarded to div.
- [x] Run `npx vitest run src/components/data-toolbar.test.tsx`; confirm failure.
- [x] Implement wrapping flex layout with logical spacing, min-width: 0, opposite-side end groups, and narrow-screen wrapping. Leave roles, labels, filter state, and focus behavior to callers. Reuse the family above and below a data view.
- [x] Run focused tests and `npm run typecheck`; expect success.
- [x] Commit with `feat: add composable data toolbars`.

### Task 6: Public package, documentation, and acceptance

**Files:** Modify scripts/check-dist.mjs, tests/package-consumer/src/api-contract.tsx,
examples/gallery/src/gallery-pages.tsx, gallery.test.tsx,
scripts/check-gallery.mjs, scripts/check-gallery.test.mjs,
docs/api.md, docs/roadmap.md, docs/visual-acceptance.md, CHANGELOG.md;
create examples/gallery/src/gallery-data-examples.tsx.

**Interfaces:** Consume every export from Tasks 1–5. Add canonical family slugs
table, pagination, data-toolbar, data-list, separator following existing
gallery routing. TableContainer and other parts appear on their family's
page, not individual routes. Gallery copy and documentation remain English.

- [x] Extend existing export/package contract checks with every component and Props type. Add compile-time rejection examples for Separator's reserved semantic props and DataList invalid direction. Extend gallery route tests for five family pages and alphabetical navigation. Run the relevant checks before integration and confirm the new expectations fail for the missing docs/contract wiring.
- [x] Add package probes and gallery pages. Each family's API tables describe all public parts and exact defaults. Show a controlled table example with search/filter controls, Pagination, and counter in DataToolbar; a bottom toolbar composition; horizontal/vertical DataList; and decorative/semantic Separator. Show long values and usable localized pagination labels. Keep TableCaption visible in its demo; label API tables by existing headings.
- [x] Update API docs, roadmap completion state, visual acceptance checklist, and unreleased changelog. Do not bump versions or publish.
- [x] Run `npm run build`, then `npm run check`, `npm run test:package:all`, `npm run build:gallery`, `npm run test:gallery-artifact`, and `npm run test:gallery-preview`. Inspect every result. Build runs first because gallery and package checks consume dist. Fix failures within this scope and rerun only affected checks before the final full verification.
- [x] Use T3 preview_status/preview_open and its browser tools when available. At 320px and desktop widths in light/dark themes inspect all five pages, both DataList directions, Table density, optional scroll container, toolbar wrapping and vertical separators. Check keyboard pagination focus, RTL composition, and forced colors if supported. Record unavailable checks explicitly rather than claiming success.
- [x] Review the complete diff against the spec, run `git diff --check`, and record actual check results. If execution method includes independent review, resolve its material findings before completion; do not exceed parent model/effort limits when selecting a reviewer.
- [x] Commit with `docs: document and verify data component families`. Store completed task context in ICM before reporting the result. No push, PR, publication, or consumer changes are required.

## Plan self-review

The five families, optional TableContainer, exact pagination boundaries,
direction/orientation distinction, native refs and attributes, semantic and
decorative behavior, canonical gallery pages, package exports, and browser
acceptance all have owning tasks. The review-focus conditions are assigned to
Task 1 native table tests, Task 2 stale-page and focus tests, Tasks 3–5 contract
tests, and Task 6 visual verification. No additional runtime dependencies or
domain behavior are introduced.
