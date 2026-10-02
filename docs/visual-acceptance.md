# Visual acceptance

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
