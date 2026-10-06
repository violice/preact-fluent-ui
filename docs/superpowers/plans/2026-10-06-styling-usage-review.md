# Styling usage revision

User brief: inspect every component and choose styling primitives deliberately. Select multipart variants once in the owning parent and pass resulting slot classes to children through context; preserve public API, class aliases/signals/refs, nested component independence and visual behavior.

Execute inline on current feature branch. No new public APIs or dependency changes.

1. Audit every recipe/component: css for invariant single roots, cva for single-element variants, sva for multipart variants. Record cases retained and changed.
2. Sidebar: replace layout/scrollable attribute styling with sva variants. Parent computes slots once and provides layout plus styles. All parts consume inherited slots; standalone parts use expanded fallback. Conditional icon/logo slots selected locally without recipe calls. Preserve native aria-current/disabled/focus/hidden selectors.
3. AppShell: navigationLayout variant selected once; context passes workspace styles. Keep direct-child Sidebar geometry selectors because it belongs to another independent family. Convert their layout condition to recipe variants.
4. Table: root selects density/dividers; pass selected slots through context. Density styles go on heading/cell slots. Keep structural section/visible-row divider selectors and native hover states.
5. Other families: distribute LoadingState appearance styles to affected slots; split ToolbarGroup into cva since align belongs to that element. Avoid contexts for families whose variants affect only the root. Keep static sva for parts requiring shared selector markers, css for independent invariant roots. Remove redundant default recipe calls where unused.
6. Regression tests: variant slot propagation, signal changes, nested roots, standalone fallbacks, class aliases. Run meaningful failing tests before changes. Full checks/build/package/gallery and browser states, then one independent whole-change review; fix substantive findings and commit with docs/audit.
