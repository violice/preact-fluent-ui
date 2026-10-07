# Gallery

The English gallery has separate component pages, Overview pages for Getting Started, Changelog and About, Guides for Theming, Styles, Forms and Signals, and a 404 page. preact-iso provides gallery routing/prerendering; @preact/signals owns gallery settings and live examples. Both are devDependencies and are absent from the library runtime and peer contract.

The sidebar Appearance settings button opens a Modal with Full/Minimal CSS presets, system/light/dark appearance, and standard/green/custom palettes. Settings are saved in the URL.

Code examples are visible without opening a disclosure, use TanStack Highlight and can be copied. Components and Utils links are alphabetical. Utils documents useRender, mergeProps, cx and resolveClass; the gallery has 41 canonical documentation pages.

AppShell, Sidebar and Dialog each document their exported parts on one page with API reference tables; Utils pages include parameter tables and separate return value blocks.

Getting Started is the homepage at /; About is at /about. Changelog is at /changelog and renders the root CHANGELOG.md with the gallery-only TanStack Markdown parser.

The gallery frame uses AppShell, AppShellWorkspace and AppShellContent. Getting Started includes a local profile form, and live Sidebar demos change their own selection without navigating the gallery.

See [README development instructions](../README.md#development) for local commands, checks and repository-base previews.
