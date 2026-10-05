# Data components design

## Purpose and scope

Add Table, Pagination, DataToolbar, DataList, and Separator to the existing
Preact library. These components cover repeated presentation patterns in
RouteVPN, Port Proxy, XBOX DNS, and Hosts Editor. Filtering, sorting, data
slicing, network operations, and domain validation remain consumer-owned.

The user approved the component families and requested DataList direction and
a separate Separator. This document specifies the proposed API for review.
Consumer migration, publication, and dependency updates are outside this task.

## Shared conventions

Follow existing named exports, typed native attributes, native element refs,
class/className merging, CSS modules, and theme tokens. Components accept
children rather than domain-specific item arrays. Preserve native semantics
and caller-provided ARIA attributes. Layout uses logical CSS properties and
supports inherited HTML dir. No new runtime dependencies.

## Table

Export Table, TableHeader, TableBody, TableFooter, TableRow, TableHeaderCell,
TableCell, and TableCaption. Their elements are table, thead, tbody, tfoot, tr,
th, td, and caption respectively. TableFooter represents table summary rows,
not the external pagination bar.

Table accepts density='regular' | 'compact', default regular. Style header
backgrounds, row separators, cell spacing, and body row hover through existing
tokens. Preserve native colSpan, rowSpan, scope, headers, and aria-sort.
TableHeaderCell defaults scope to col, while allowing scope='row' and other
native values. Cells support align='start' | 'center' | 'end', default start.
TableCaption remains visible unless consumers explicitly style it otherwise.

Table itself forwards its ref to the table without an implicit wrapper.
Horizontal overflow is provided by an additional TableContainer div with a
native div ref. Consumers can label and focus that scroll region through
native attributes. TableContainer is optional and introduces no automatic
tab stop. Consumer-specific column hiding and mobile card transformations are
not automatic. No grid keyboard model, selection engine, or sorting engine.

## Pagination

Use a controlled component with page, pageCount, and onPageChange(page).
Public page numbers start at 1. pageCount is a nonnegative integer; pageCount=0
represents no results and displays 0 / 0 with both buttons disabled. For a
positive pageCount, callers supply a page between 1 and pageCount. Rendering
clamps a stale page into the valid range without calling onPageChange during
render or through an effect. Button actions use the displayed page and never
emit a page outside the valid range.

Required previousLabel, nextLabel, and aria-label localize navigation.
An optional formatPageLabel(page, pageCount) customizes the visible indicator;
the default is 'page / pageCount'. disabled disables both actions. Preserve
native button focus, including after page changes. Use a nav root with a
native HTMLElement ref and ordinary HTML attributes. Do not include numbered
page buttons, page-size selection, item slicing, or a total-record counter in
the initial API. Counter text composes separately in DataToolbar.

## DataToolbar

Export DataToolbar and DataToolbarGroup, both div-based containers with native
refs and attributes. DataToolbar provides wrapping horizontal layout;
DataToolbarGroup keeps related content together while permitting wrapping.
Group align='start' | 'end', default start, supports opposite-side actions or
pagination. Use logical spacing, min-width: 0, and narrow-screen wrapping.

Compose Input, Select, buttons, counters, Separator, and Pagination through
children. The same family can sit above or below a data view. No automatic
role='toolbar': its composite keyboard semantics are not appropriate for a
generic container of independently focusable search and filtering controls.
No automatic roles, accessible names, filter state, or focus management.

## DataList

Export DataList, DataListItem, DataListLabel, and DataListValue with elements
dl, div, dt, and dd respectively and matching native refs/attributes.

DataList.direction='horizontal' | 'vertical', default horizontal, controls
each item's label/value layout. Horizontal places the label beside the value;
vertical places the label above the value. It does not mean LTR/RTL and does
not control the arrangement of separate items. HTML dir continues to control
text direction. In horizontal mode all rows share a label column; values can
wrap, and the layout stacks below 600px to avoid cramped narrow layouts.
Vertical mode stays stacked at every viewport size. Remove native dl/dd
margins and use muted labels and normal value text. Children support rich
content, links, badges, and long identifiers without overflow. Item boundaries
do not insert separators automatically.

## Separator

Export a div-based Separator with a native HTMLDivElement ref and attributes.
orientation='horizontal' | 'vertical', default horizontal. decorative=true
by default produces role='none' and aria-hidden=true. decorative=false produces
role='separator' and explicit aria-orientation matching orientation. These
semantic attributes are derived from those props; omit role, aria-hidden, and
aria-orientation from the public native-attribute extension to prevent
conflicting states. Callers may label a semantic separator through aria-label
or aria-labelledby.

Use a theme border token, a one-pixel horizontal line spanning available
inline size, or a vertical line stretching across a flex parent's available
cross size. A vertical separator in a parent without a defined height can be
sized using native style/class props. It is never focusable by default and
has no keyboard interaction. Support forced colors and avoid arbitrary margins
so surrounding layout owns spacing.

## Documentation and verification

Add one canonical gallery page per family: Table, Pagination, DataToolbar,
DataList, and Separator. Show native semantics, public props, composition,
horizontal/vertical variants, and localization where applicable. The Table
page documents TableContainer and all table parts; avoid separate part routes.
Update public API documentation and the changelog using existing conventions.

Behavior tests cover table element/ref/attribute forwarding, pagination
boundaries and empty/disabled states, callback values and localization,
DataList semantics/direction, and Separator semantic/decorative states.
Layout-only coverage should check contracts without mirroring CSS details.
Verify library checks, build, dist and package exports, gallery artifacts,
and browser rendering at 320px and desktop widths in both themes. Exercise
pagination with keyboard focus and data rows containing long values. Verify
RTL composition and forced colors where the available browser supports them.
