# Gallery

The English gallery has separate component pages, Overview pages for Getting Started, Changelog and About, Styling pages for Configuration, Tokens, Global styles and Theming, Styles pages for css, css.dynamic, cx, cva, sva and token, and a 404 page. preact-iso provides gallery routing/prerendering; @preact/signals owns gallery settings and live examples. Both are devDependencies and are absent from the library runtime and peer contract.

The sidebar Appearance settings button opens a Modal with independent document reset and native control switches, system/light/dark appearance, and standard/green/custom palettes. Settings are saved in the URL.

Code examples are visible without opening a disclosure, use TanStack Highlight and can be copied. Components and Utils links are alphabetical. Utils documents useRender, mergeProps and resolveClass. Styles documents the style functions with live examples, parameters, returns and limitations. Copyable demo snippets come from the executable demo source files; compiler-backed tests build them and validate the configuration overview. Configuration also covers defineConfig/definePreset, and recipes include defaults, null suppression, compound matching, slot selectors and inferred variant types.

AppShell, Sidebar and Dialog each document their exported parts on one page with API reference tables; Utils pages include parameter tables and separate return value blocks.

Getting Started is the homepage at /; About is at /about. Changelog is at /changelog and renders the root CHANGELOG.md with the gallery-only TanStack Markdown parser.

The gallery frame uses AppShell, AppShellWorkspace and AppShellContent. Getting Started includes a local profile form, and live Sidebar demos change their own selection without navigating the gallery.

See [README development instructions](../README.md#development) for local commands, checks and repository-base previews.

The source is grouped by responsibility:

- `src/app` initializes browser hydration, prerenders pages and composes the gallery shell.
- `src/components` contains navigation, appearance controls and documentation primitives.
- `src/routes` owns the page catalog, routing helpers and grouped page documentation.
- `src/examples` contains live examples grouped by component family.
- `src/state` owns URL settings, signals, browser effects and gallery context.
- `src/styles` contains named engine style maps and the green theme configuration.

Each component has its own file. UI state uses signals and computed signals. Gallery rules use the generated style helpers; palettes and document defaults are generated through the engine. There are no source CSS files or CSS Modules.
