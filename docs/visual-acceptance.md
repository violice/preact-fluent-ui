# Visual acceptance

## Disclosure, loading and Tooltip integration, 2026-10-05

The gallery now includes Disclosure error/file previews, labeled Spinner sizes,
initial/inline LoadingState, a focus-retaining interactive Button refresh, busy
variants and named icon actions. Tooltip examples cover scrolling
TableContainer, a local dark token scope and Modal. Global Appearance settings
continue to control RTL and theme presets. API references use the Table family
and existing documentation spacing.

Automated integration verification and packed-consumer checks are recorded in
the Task 5 report. Native keyboard disclosure behavior, tooltip clipping and
positioning, Modal Escape/focus, themes, narrow layouts and RTL require the
Task 6 browser pass. No new browser acceptance is claimed here. Windows forced
colors and real screen-reader announcements remain manual checks.

## Data components and gallery spacing, 2026-10-05

Checked the current gallery in T3 native Chromium after migrating component
and utility API tables to the public Table family.

| Check | Result |
| --- | --- |
| All 31 routes at 320px and 1280px, light and dark | 124 page checks passed. One main and one h1 per route; no document horizontal overflow. All documentation and demo tables have accessible names and scoped column headers. |
| Documentation spacing | 32px between page sections, 16px inside documentation sections, and 40px between component family members. AppShell API geometry and visual inspection confirm the member separation. Shared containers cover component, utility, overview and guide pages; example component descendants retain their own spacing. |
| DataList layout | Desktop horizontal labels and values share aligned columns. Selecting vertical stacks each label above its value. RTL and 320px long identifiers wrap inside the example. |
| Table and DataToolbar | Search and pagination update visible rows. Regular rows measure 53.5px and compact rows 41.5px in the desktop fixture. Top and bottom toolbars wrap within narrow examples. The example table has a consumer-owned 480px minimum width and scrolls inside its 221px container at 320px, with document width 305px. API references use the public Table family while retaining heading-based names. |
| Pagination | Empty/disabled controls cannot navigate. Native button activation updates the controlled page; focus remains on a still-enabled activated button. At a boundary Chromium blurs a button when it becomes disabled. Independent review accepted this as native behavior; no focus relocation is added. |
| Separator | Decorative and semantic states and both orientations are covered by DOM tests. Native browser inspection confirms horizontal and vertical line sizing. |
| Forced colors | Pending Windows manual acceptance. The preview does not expose forced-colors emulation; matchMedia remained false. System-color rules are present but this is not a browser acceptance claim. |

The packed artifact compiles against Preact 10.29.8 and 10.27.0. Production
gallery artifacts include 31 pages and 404 at both root and repository base.
Browser snapshots after development builds required a reload because Vite
observed transient missing dist CSS while the library build replaced dist.

Independent review found no Critical, Important, or Minor issues and ran all
14 new component tests successfully. Implementation stays on the feature
branch in the existing checkout, without filesystem isolation. Pagination
expects integer pages and nonnegative integer pageCount; invalid caller state
is outside its input contract. Filtering and sorting remain consumer-owned.
DataList uses CSS subgrid in current browsers; historical engines were not
part of the supplied support requirement. Real screen-reader output remains
a manual acceptance check alongside forced colors.

Checked on 2026-10-02 through T3 native preview tools, tab_1, at http://localhost:5173. The browser was T3Code Nightly 0.0.45-nightly.20261002.2572, Chromium 152.0.7977.130 / Electron 44.4.2 on Windows 10. The build shell was WSL2 Linux, Node 24.15.0, npm 12.1.0. Native preview_status initially reported an available blank tab; preview_open opened the gallery successfully. No alternate browser was used.

## Results

| Check | Result |
| --- | --- |
| Full, minimal, green pages; light/dark; 1280, 720, 320 CSS pixel widths at 800 height | Passed all 18 combinations. No horizontal overflow: document widths 1265, 705, 305 with the 15px browser scrollbar. |
| Minimal CSS isolation | Passed. Exactly three stylesheets: theme, component styles, scoped gallery layout. Body retains 8px margin and Times New Roman. Card, PageHeader, EmptyState, Select and Button supply Segoe/system font at 14px and border-box; Button is 36px, Select 38px; field/card borders remain 1px. Dark component text is rgb(243,244,246). |
| Green dark theme | Passed. Accent #91d981; primary #3d6b47, hover #497a54, pressed #345c3d, on-primary #ffffff. Card rgb(45,51,46). |
| Text wrapping and icons | Passed layout/visual inspection. Long notice values, status text, empty-state descriptions and dialog values fit at 320px. Gallery contains all 22 names at 16/20/24 sizes. |
| Keyboard forms and visible focus | Passed. Native Tab skips disabled Select. ArrowDown chooses Manual; submit reports Saved manual. Keyboard focus on Select and dialog Buttons has a solid 2px outline. Browser select popup can change focus-visible heuristics while open; checks were taken after Tab navigation. |
| Standard dialogs on all three pages at 320px | Passed. Dialog width 280px, internal scroll width 278px, correct root font/color. Tab focuses Try action, Shift+Tab and wrap stay inside. Escape closes and returns focus. |
| Hidden, display:none, visibility:hidden, disabled, inert and hidden-input controls | Passed on minimal dark. Tab cycles only Close dialog and Try action. Background root is inert while open and restored after close. |
| No-controls dialog | Passed on minimal dark. Tab and Shift+Tab keep focus on the dialog; it shows a solid 2px focus outline; Escape dismisses. |
| Removed opener | Passed. Closing returns focus to Reset samples; the opener is absent. |
| Busy confirmation | Passed. Both actions disabled; Tab stays on dialog; Escape and backdrop cannot close it. After five seconds the sample enables actions again. |
| ConfirmDisabled | Passed. Apply changes disabled, Cancel enabled; Tab stays on Cancel; Escape still closes. |
| Native overflow restoration | RED exposed mixed-priority loss, then GREEN after the separate fix. Exact overflow-x clip !important and overflow-y scroll normal values/priorities survive open/close. Body computes hidden overflow while open. |
| Forced colors | Pending manual acceptance on Windows. Current native preview tools expose only colorScheme system/light/dark, with no forced-colors emulation. matchMedia('(forced-colors: active)') was false. Static system-color rules and override order were reviewed; this does not count as browser acceptance. |
| Reduced motion | Pending manual acceptance on Windows. Native tools expose no prefers-reduced-motion control; matchMedia('(prefers-reduced-motion: reduce)') was false. Local transition:none rules were reviewed; this does not count as browser acceptance. |

The initial light 1280 minimal computed sample caught a control background mid-transition after changing appearance. The subsequent light 720/320 samples and a settled 1280 retry show white control backgrounds. The screenshots represent the actual saved viewport, not full-page stitched captures. Native select popup Home/Enter commands briefly returned client errors; state inspection and ArrowDown confirmed selection. A click call that mixed a selector with coordinates was rejected and retried with coordinates alone. These tool errors did not indicate a product failure. A library rebuild while the dev server was active briefly removed dist/theme.css and produced an HMR 404; a full reload recovered and a fresh fetch returned 200 with all three minimal stylesheets present.

## Final focused native regressions

Checked again in T3 native Chromium on 2026-10-02 at 1280×800. These are focused checks after the final review, not a repeat of the 18-page matrix. The earlier hidden-controls row established keyboard exclusion only; the final review exposed missing native hidden layout behavior. The stopped gallery server was restarted against the existing pre-fix dist for RED. After the one library rebuild, a reload used the new dist and cleared transient HMR errors.

| Check | RED | GREEN |
| --- | --- | --- |
| Native hidden layout | Reviewer Button clone: hidden=true, inline-flex, one rect. Final fixture authored footer root: flex, one rect. | Real Preact renders of Button, InfoBar, StatusBadge, PageHeader, EmptyState, DialogBody, DialogFooter and Select with hidden=true produce display:none and zero rects. Rerender hidden=false gives one rect each. Select wrapper is also zero then one. Passed on full and theme/styles-only minimal pages. |
| Closed disclosure | In actual gallery Modal, Tab from summary targets concealed input, focus fails and lands on dialog. | Concealed initialFocusRef falls back to Before. Closed forward traversal: Before → summary → After → Footer → End → Before. Reverse: End → Footer → After → summary → Before → End. Enter opens disclosure; Tab enters input. Enter closes it; Tab reaches After. |
| Native radios | Checked a → Tab focuses unchecked b without selecting it. | Before → Tab enters checked a. ArrowRight focuses/selects b. Tab exits to After; Shift+Tab enters checked b and exits to Before. Checked updates enter the new checked a. With neither checked, native forward and reverse entry/exit leave both unchecked; Chromium remembers a on reverse entry in this sequence. Unnamed radios, distinct names and same-name radios in separate forms remain separate stops in both directions. |
| Updated fallback identity | Focused DOM tests fail with body focused after old target detaches. | Native Modal and ConfirmDialog rerender with replacement fallback ref, detach old target, keep inert and overflow while open, then restore new target on unmount. |

Fixtures used the actual built components with the gallery's Preact runtime. Temporary roots, controls and refs were removed; final inspection found no dialog, fixture or inert elements and restored empty body overflow. Reproduction expressions and measured JSON are retained in `.superpowers/sdd/2026-10-02-preact-fluent-ui/scratch/final-native-evidence.json`. Focused DOM tests also cover an explicitly declining focus method, group boundary wrapping, checked updates and separate form owners; native keyboard results above supply browser semantics that jsdom cannot establish.

Saved native screenshot evidence (local T3 artifacts):

- RED disclosure/radio probe: `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqw9kbb-a0003f12.png`
- Full hidden true/false render fixture: `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqwefln-08e36257.png`
- Minimal hidden true/false render fixture: `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqwegql-159d694c.png`
- Disclosure navigation: `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqwfegp-3f049d2a.png`
- Radio identity/navigation: `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqwgien-fba2be86.png`

Forced-colors and reduced-motion manual acceptance remain pending as described below.

## Saved screenshots

Paths are local T3 artifacts from this session. They are not packaged npm files.

| Page | Appearance | Width | Section | Screenshot path |
| --- | --- | --- | --- | --- |
| index.html | light | 1280 | header/buttons | `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqt6s8r-0011f635.png` |
| index.html | light | 720 | header/buttons | `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqt6sl2-faed3717.png` |
| index.html | light | 320 | header/buttons | `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqt6sv5-a298c99c.png` |
| index.html | dark | 1280 | header/buttons | `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqt6tv0-12a8a081.png` |
| index.html | dark | 720 | header/buttons | `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqt6u6k-7313710e.png` |
| index.html | dark | 320 | header/buttons | `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqt6uhm-75732dfb.png` |
| minimal.html | light | 1280 | header/buttons | `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqt6vlc-67dc3132.png` |
| minimal.html | light | 720 | header/buttons | `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqt6vx5-6cb41c5c.png` |
| minimal.html | light | 320 | header/buttons | `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqt6w80-c4990b78.png` |
| minimal.html | dark | 1280 | header/buttons | `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqt6x7u-ef00f578.png` |
| minimal.html | dark | 720 | header/buttons | `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqt6xin-16d7e9ec.png` |
| minimal.html | dark | 320 | header/buttons | `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqt6xt9-f0130dcc.png` |
| green.html | light | 1280 | header/buttons | `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqt6ywg-7d801b72.png` |
| green.html | light | 720 | header/buttons | `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqt6z8d-e7fed9b9.png` |
| green.html | light | 320 | header/buttons | `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqt6zjf-ddfa3a80.png` |
| green.html | dark | 1280 | header/buttons | `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqt70ju-e77574cc.png` |
| green.html | dark | 720 | header/buttons | `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqt70uz-77d4f954.png` |
| green.html | dark | 320 | header/buttons | `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqt71s4-bbc2809e.png` |
| index.html | dark | 320 | forms | `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqteq0a-2ccdf12a.png` |
| index.html | dark | 320 | icons | `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqteq6t-792313ad.png` |
| index.html | dark | 320 | dialog | `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqtercu-aa3d8fe1.png` |
| minimal.html | dark | 320 | forms | `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqtervj-aed64a19.png` |
| minimal.html | dark | 320 | icons | `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqtes20-d51e33d6.png` |
| minimal.html | dark | 320 | dialog | `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqtetz8-7191af1f.png` |
| green.html | dark | 320 | forms | `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqtev87-05b035f4.png` |
| green.html | dark | 320 | icons | `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqtevff-5f9dbaec.png` |
| green.html | dark | 320 | dialog | `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqtexbx-fb2dec3f.png` |
| minimal.html | dark | 720 | hidden controls | `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqt9tu8-aa1c02c7.png` |
| minimal.html | dark | 720 | empty dialog | `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqt9ukv-6da6a377.png` |
| minimal.html | dark | 720 | busy confirmation | `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqta7bt-2141fb67.png` |
| minimal.html | dark | 720 | Select keyboard focus | `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqtdn7v-0e850287.png` |

A light-theme 320px minimal dialog also opened through keyboard Space after Tab navigation. It retained its 1px border, rgb(255,255,255) raised background and rgb(27,27,27) text. Screenshot: `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muqtjuvn-0b2e8e0e.png`.

## Pending Windows checks

Enable a Windows contrast theme and reload each gallery page at 1280, 720 and 320 widths. Confirm Canvas/CanvasText surfaces, Highlight/HighlightText primary and accent, GrayText disabled states, visible borders and keyboard outlines. Verify Select uses the native arrow and dialogs remain readable. Include green.html to check that its later overrides do not undo system colors. Save screenshots and record the selected contrast theme.

Turn off Windows animation effects, reload the three pages, and verify matchMedia('(prefers-reduced-motion: reduce)').matches. Inspect Button, Select and ordinary fields: their computed transition duration should be 0s. App animations outside these controls must remain under the app's own policy. Record these results before treating visual acceptance as fully complete.

## Unified gallery checks, 2026-10-03

Checked through T3 native preview at localhost:5173 and the production build at localhost:5174. Full and Minimal are now CSS presets; Green is a palette. Old page links select the corresponding preset on the unified gallery.

- Switching to Minimal removes both optional stylesheet links. Native fields regain browser defaults; body margin is 8px and font is Times New Roman. Full loads reset and native-controls successfully; body margin is 0 and the text field is 36px high.
- Production custom colors restore from the URL: accent `#008080`, primary `#663399`. Explicit dark on a light OS and explicit light on a dark OS select the appropriate component and syntax colors. System appearance responds to browser color-scheme changes. Reset restores the default settings and clears their URL parameters.
- At 320px, with all code examples expanded, document scroll width and client width are both 305px. Code blocks scroll internally. Green dark uses accent `#91d981` and primary `#3d6b47`.
- The portaled dialog inherits the selected dark scheme and green primary; opening focuses Close dialog. Closing and copying an installation example through the native browser report Copied.
- Automated coverage includes URL validation/round-trip/navigation, actual optional link changes, source copying and clipboard refusal, minified token-block declaration boundaries, and contrast-preserving custom interaction shades.

Screenshot of the unified gallery: `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muspzmwq-d3caffa9.png`.

The Windows forced-colors and reduced-motion checks above remain pending. This focused pass does not replace the earlier full component acceptance matrix.

## Form controls phase 1, 2026-10-04

The Forms gallery now contains Field, Input, Textarea, Checkbox and Switch, a custom noValidate port/adapter submission example, readOnly/disabled/error/checked/mixed states, long labels, an RTL switch, and hidden roots/wrappers. Existing native fields remain available for comparing Full and Minimal presets. Automated gallery coverage checks empty required submission, inline error correction, adapter selection, and checked Checkbox/Switch values in the submitted result.

Checked through T3 native preview at localhost:5173 on Windows 10, T3Code Nightly 0.0.46-nightly.20261004.2652, Chromium 152.0.7977.130. Full/Minimal × light/dark at 1280px and 320px had no document horizontal overflow. Input remained 36px high, Checkbox 18px, and Switch 36×20px in both presets. Long labels fitted their containers, hidden roots/wrappers had zero layout size, and the checked RTL switch moved its thumb to the left.

Label click and keyboard Space changed native Checkbox/Switch values in the submitted result. Clicking the mixed checkbox cleared its indeterminate state. Tab skipped disabled controls, reached readOnly controls, and showed a 2px focus outline. Empty submission connected the inline error through aria-describedby and set aria-invalid; correction removed the error association while retaining the hint. Actual hover retained the danger border on invalid Input, Textarea, Checkbox and Switch.

CSS zoom 2 at 1280px passed the Full/Minimal × light/dark layout checks without horizontal overflow. The native browser zoom shortcut did not change the preview scale, so actual browser 200% zoom remains pending. Windows forced colors, reduced motion and screen reader checks also remain pending. The preview reported forced-colors and prefers-reduced-motion as inactive; this does not verify their active states.

Final review reproduced a Full-only invalid hover override from the later optional native stylesheet. Its hover selector now keeps disabled filtering inside :where, so component error styles take precedence. After rebuilding, actual hover on Input and Textarea retained danger borders in all four Full/Minimal × light/dark combinations, rgb(164,38,44) in light and rgb(241,163,172) in dark.

Narrow Minimal dark RTL screenshot: `/home/violice/.t3/userdata/browser-artifacts/browser-screenshot-localhost-muu9887n-40fbb0dc.png`.

## Documentation gallery navigation, 2026-10-05

The gallery now uses English component pages and guides with a persistent Sidebar and appearance controls. Task 4 checked a production repository-base Button entry and reload with Dark/Full query settings, successful base-prefixed assets, an unknown Light/Minimal route returning 404, and narrow active-link keyboard selection moving focus to the heading. Evidence is in `.superpowers/sdd/2026-10-04-gallery-navigation/task-4-report.md`.

The parent task's T3 production checks confirmed actual Signals input updates and disabled behavior, form submission with port 8080, scrolling through narrow navigation and heading focus after route selection, Light/Full dialog Escape dismissal and opener focus restoration, and Back restoring Dark/Minimal with zero optional stylesheet links. Expanded code at 320px in RTL had no document horizontal overflow. Foreground Copy reported Copied; browser automation denied clipboard reading, so clipboard contents were not independently verified.

Automated routing, store, Sidebar and artifact tests do not establish real screen-reader behavior, active Windows forced colors/reduced motion or native browser 200% zoom. Forced colors and a real screen reader were unavailable in this pass. The pending Windows checks above still apply; substitute the current component and guide URLs for the old gallery entries. Final diff review and scoped rereview passed. At 320px the compact appearance disclosure starts collapsed and content begins at approximately 124px; real Enter/Space toggle it, and Tab skips hidden controls while closed. Native settings nodes remain mounted across navigation.


The gallery refinement request supersedes the compact disclosure result above. Appearance settings now open from a native sidebar action in the library Modal. The persistent store remains in the shell, and controls mount while the dialog is open. Code examples render directly. The sidebar groups are Overview, Guides and Components, with a separate Styling guide. The current browser acceptance results are recorded by the refinement audit.

## Gallery refinements, 2026-10-05

The parent checked all 30 documentation routes at 1280px and 320px, in light and dark appearance, with Full and Minimal CSS: 240 route/configuration cases. All 237 initially passing cases remained clear. The three initial 320px/dark/Minimal overflow cases on Getting Started, Forms and Signals passed after the scoped preview border-box correction. Each recheck had document scrollWidth 305px in a 320px viewport and preview right edge 285px. No global Minimal reset was added.

Desktop and mobile settings dialogs focus the CSS preset SELECT initially. Escape restores the desktop Appearance settings action or the visible mobile Navigation toggle. Custom primary #8b3366 survives route changes; About documentation links compute to rgb(139, 51, 102), matching that primary value. Clipboard permission and unavailable assistive/environment checks retain their earlier stated limits.

Current navigation has Overview with Getting Started and About, Guides with Theming, Styling, Forms and Signals, and all 24 component pages. The root URL is About, the existing setup/guide/component URLs remain, and Styling adds the 30th route. Code examples remain visible. Appearance settings use the library Modal and a persistent shell store.

A further PageHeader ordering correction moves its sole demonstration h1 before the purpose paragraph and documentation sections. Its ordering regression passed and the repository artifact rebuilt. Parent browser confirmation at desktop and narrow widths passed: exactly one h1, its title leads the document, and no horizontal overflow.


## Application sidebar acceptance pending

The unreleased gallery has 40 documentation routes: the previous 30, SidebarBrand, five AppShell parts and four Utils pages. Navigation order is Overview, Guides, Components, Utils; the last two groups are alphabetical. Shell examples load a separate preview document so Workspace never nests a main inside the gallery main. Preview URLs carry the selected base, theme, palette and CSS preset.

Task 7 must verify the new pages in the native browser with light/dark and Full/Minimal, narrow and desktop widths, keyboard rail label discovery, tooltip visibility across scroll boundaries, long-menu header/footer placement, horizontal navigation, custom Link ref forwarding and local demo URL isolation. Existing historical checks above do not establish acceptance for the new API. Forced-colors, reduced motion and screen-reader checks remain pending where unavailable.
