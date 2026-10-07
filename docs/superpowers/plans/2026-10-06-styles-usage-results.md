# Styles usage audit

Sidebar, AppShell and Table now select `sva` once at their root. Context passes ready slot classes to separately exported parts; nested roots establish independent selections. Cached defaults support standalone parts. Public props, signals, refs and `resolveClass` precedence remain intact.

| Component family | Styles choice |
| --- | --- |
| Sidebar, AppShell, Table | Parent-selected `sva` with context |
| Field, InfoBar, Spinner, LoadingState | `sva`, selected once for internal parts |
| Checkbox, Switch, Select | Static `sva` with native state selectors |
| Modal, PageHeader, EmptyState, Pagination, AppShellToolbar, DialogHeader, CodeBlock | Static multipart `sva` |
| Button, Card, Text, Separator, StatusBadge | Single-element `cva` |
| DataList | Root direction `cva`; invariant parts use `css` |
| Toolbar | `css`; independently owned ToolbarGroup alignment uses `cva` |
| Input, Textarea, CounterBadge, Tooltip, Icon, DialogBody, DialogFooter, TextPreview | Invariant `css` |
| Disclosure | Root appearance `sva`; invariant child slots are cached; native open state stays CSS |
| Code tokens, Table cell alignment | Independently selected `cva` |

LoadingState appearance now styles its slots directly. Sidebar layout and scrollability no longer style parts through ancestor attributes. AppShell retains direct-child Sidebar geometry because Sidebar is an independent component. Table retains DOM selectors for dividers and header/body semantics. Native checked, hover, focus, hidden and open states remain CSS.

PageHeader title/description and EmptyState title receive their own classes. Content paragraph selectors remain scoped to user content. TextPreview and CodeBlock retain the existing style adapter to preserve wrap precedence for object and string styles. `cx` composes classes; `resolveClass` retains alias precedence.

## Validation

Regression tests cover signal updates and nested isolation for Sidebar and AppShell, nested Table density, explicit owned heading slots and the emitted Table header rule. Browser inspection caught a specificity tie after moving Table header padding; the direct `thead > tr > &` selector preserves regular 12px and compact 8px padding.

Browser fixture checked compact outer/regular nested table padding (8/14px), headings (8/12px), expanded/horizontal AppShell workspace margins (8/0px) and radii (12/0px), nested expanded workspace stability and standalone defaults. Sidebar signal updates select different slot classes; unit coverage checks nested class isolation. Browser checks used the normal color mode; Windows forced colors were not emulated.

Final independent review found no actionable issues. Full build/check passed 407 tests. Packed consumers passed with Preact 10.29.8 and 10.27.0, including the styles consumer. Gallery build verified 41 pages and 404; 11 artifact tests passed.
