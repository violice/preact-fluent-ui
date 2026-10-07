# npm releases

## Published 0.6.0

`@violice/preact-fluent-ui@0.6.0` was published on 2026-10-07 from
`3b4194c70c44e8d0e4963682f96bdee5b3a1ced1`. npm's `latest` tag points to
0.6.0 and the registry records SLSA provenance. The release introduces the
generated styles engine and explicit package entries. See [the changelog](../CHANGELOG.md#060-2026-10-07)
for breaking changes and [styles setup](styles.md) for migration.

- [GitHub Release v0.6.0](https://github.com/violice/preact-fluent-ui/releases/tag/v0.6.0)
- [Successful publish workflow](https://github.com/violice/preact-fluent-ui/actions/runs/37608826308)

A registry-downloaded archive passed the isolated public TypeScript API and
consumer builds with Preact 10.29.8. Its SHA-512 matches npm metadata. Local
registry evidence is saved in `.artifacts/registry/verified-0.6.0.json`.

The first publish attempt stopped before npm because typecheck needed the gallery's
generated style bindings. The corrected workflow builds the library and gallery
before running checks. The released tag points to that correction; subsequent
changes in `main` split a slow aggregate gallery test into individual cases.

## Published 0.5.0

Version 0.5.0 adds Text, Box and CounterBadge, optional edge-to-edge Card/Table composition, explicit native typography reset and aligned AppShell content, toolbar and footer. The release was published through the existing GitHub Actions npm trusted publisher from tag `v0.5.0`.

## Published 0.4.0

`@violice/preact-fluent-ui@0.4.0` was published on 2026-10-05 from `8a50de7af34acedc2c51085dd23d5253c0cc83ee`. At publication, the npm latest tag pointed to 0.4.0 and npm recorded SLSA provenance. A registry-downloaded archive passed the isolated TypeScript, Full/Minimal build and package checks against Preact 10.29.8.

- [GitHub Release v0.4.0](https://github.com/violice/preact-fluent-ui/releases/tag/v0.4.0)
- [Successful publish workflow](https://github.com/violice/preact-fluent-ui/actions/runs/37324024516)

The release includes data components, loading feedback, Tooltip, Toolbar/AppShellToolbar, TextPreview, CodeBlock and the file-backed Changelog gallery page. Local registry evidence is saved in `.artifacts/registry/verified-0.4.0.json`.

## Published 0.1.0

`@violice/preact-fluent-ui@0.1.0` was published on 2026-10-02 from commit `6307c6b869ca41fdeb4b31fac293639a940e2234`. At that release, the public registry's `latest` tag pointed to `0.1.0`; the initial registration version `0.0.0` remains under `bootstrap`.

- [npm package](https://www.npmjs.com/package/@violice/preact-fluent-ui)
- [GitHub Release v0.1.0](https://github.com/violice/preact-fluent-ui/releases/tag/v0.1.0)
- [Successful publish workflow](https://github.com/violice/preact-fluent-ui/actions/runs/37012852879)

The workflow verified one archive against Preact `10.29.8` and `10.27.0`, then published that archive through npm OIDC. npm recorded provenance. A fresh temporary consumer installed `0.1.0` from the public registry, compiled the public TypeScript API, and built both full and minimal entries with CSS imports. Local registry evidence is saved in `.artifacts/registry/verified-0.1.0.json`.

The registry integrity is:

```text
sha512-LKZfUoIArVZVGjkHn8/0kip0xSeTfsR7zRgpdRnkiEPYssWv65DyvYjy62kOKe2jMacJ1i1lhQsvMtNj0gMavw==
```

## Repository and npm configuration

The repository is [violice/preact-fluent-ui](https://github.com/violice/preact-fluent-ui). Its `package.json` metadata is:

```json
"repository": {
  "type": "git",
  "url": "git+https://github.com/violice/preact-fluent-ui.git"
}
```

The publish workflow compares this URL with `GITHUB_REPOSITORY` and stops if it is absent or different.

Initial package registration is complete. The owner published a separately prepared `0.0.0` archive with public access and the `bootstrap` dist-tag, then configured the npm GitHub Actions trusted publisher:

| Field | Value |
| --- | --- |
| Organization or user | `violice` |
| Repository | `preact-fluent-ui` |
| Workflow filename | `publish.yml` |
| Environment name | Empty |
| Allowed actions | Direct `npm publish` allowed |

Bootstrap registration is a one-time setup step and is not repeated for future releases. Account changes and publisher settings may require the owner's 2FA confirmation.

The workflow uses OIDC on a GitHub-hosted Ubuntu runner, grants `id-token: write`, and installs npm `12.1.0` on Node 24. It receives no `NPM_TOKEN` or `NODE_AUTH_TOKEN`. npm requires at least npm `11.5.1` and Node `22.14.0` for trusted publishing. For a public repository and public package, provenance is generated automatically. See [npm's setup guide](https://docs.npmjs.com/trusted-publishers/).

## Check one archive

Run on Node 24 with `npm ci`. CI on every push and pull request runs the same checks:

```sh
npm run build
npm run build:gallery
npm run check
npm run test:package:all
```

`check` runs typecheck, lint, format checks, behavior tests, release tests, and notices checks. Individual check commands remain available. Run `build` and `build:gallery` before `check` on a clean checkout because gallery compilation generates its style bindings and consumes the built library declarations. `build:gallery` also consumes the library's existing `dist`. `dev` still builds the library before starting the gallery.

Finish both builds before `test:package:all`. This cross-platform Node command packs the existing build once with scripts disabled, then passes the same absolute tarball path to `test-package.mjs` for the root lockfile's Preact version and minimum peer `10.27.0`. A failed pack or verification stops the command and returns the child process's exit code.

For a standalone check, `npm run test:package -- --tarball <absolute-path> --preact 10.27.0` verifies that file without rebuilding, packing again, or depending on local library graph metadata. Without `--tarball`, `test:package` still packs the existing build and checks one peer. `test:styles-package` separately packs and installs the library to verify generated bindings, static and dynamic styles, recipes, custom tokens, theme scopes and config reloads through the published Vite adapter.

`test:package:all` also runs this styles consumer check after both peer checks.

Both peer runs install the archive in fresh temporary consumers outside the repository. They check exports, declarations, private subpaths, generated CSS and the component stylesheet, external Preact, bundled helpers, notices/licenses, package contents, and Button-only tree shaking.

The evidence directory `.artifacts/package/` contains the tarball, its `.sha256` checksum, `verified-10.29.8.json`, `verified-10.27.0.json`, and full/minimal consumer outputs and JSON reports. The verifier writes the locked peer's exact version into the report filename if the lockfile changes. JSON reports record the archive SHA-256, file list, published source maps/imports, module graphs, live source mappings, one resolved Preact root per installation, and emitted raw/gzip byte sizes. CI uploads this directory as an artifact, including its hidden parent directory. These baselines have no arbitrary size limit.

## Future releases

Before the next release, update `package.json`, `package-lock.json`, and the changelog to a new unpublished version. The workflow obtains the archive filename from `npm pack`; no workflow filename changes are needed for a new version. Version `0.1.0` is already published and must not be reused.

Create `v<package.version>` at the reviewed commit, push the tag, and publish a GitHub Release. Pushing a tag alone does not trigger npm publication. `publish.yml` runs only on `release: published`, checks out that tag, and checks that its commit matches the release event's SHA. GitHub documents that SHA as the last commit in the tagged release in the [release event reference](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#release).

The workflow requires the exact `v<package.version>` tag and connected repository metadata before continuing. It builds the library once, runs `check`, builds the gallery, and runs `test:package:all` to pack once and verify the same archive with both Preact versions. After both checks pass, the command writes the archive filename to the step's `archive` output through `GITHUB_OUTPUT`. The workflow uploads the evidence, checks the saved SHA-256, then publishes that archive with public access and scripts disabled. It does not rebuild or pack between verification and publication.

After the workflow succeeds, inspect the public npm version and provenance. In a new temporary consumer, install the exact newly released version of `@violice/preact-fluent-ui` from `https://registry.npmjs.org`, compile the public TypeScript API, and build with the CSS imports. Save the installed version and registry/integrity evidence. Only that registry check establishes publication success. npm may report that the package is still being processed for a few minutes after a successful publish; wait for registry availability rather than publishing the same version again. A local tarball pass alone does not establish npm publication.

Windows forced-colors and reduced-motion acceptance remains pending as recorded in [visual acceptance](visual-acceptance.md). The workflow's DOM and archive checks do not replace those manual checks.

## Public gallery

The [GitHub Pages gallery](https://violice.github.io/preact-fluent-ui/) displays the latest stable GitHub release using its exact npm package version. The Gallery workflow runs after a successful Publish workflow and can also be started manually. It installs the published package, uses its JavaScript, declarations and CSS, and displays the version in the page heading. It retries installation while npm processes a new release.

Gallery page sources, compiler and theme configuration come from the matching release tag; the showcased component JavaScript, declarations and precompiled rules come from the exact npm version. Changes to `main` do not automatically redeploy the public gallery. Local `npm run dev` continues to build and use the library sources in the checkout.

## Gallery route artifacts and Sidebar release guard

The English gallery prerenders 45 known pages and 404.html. Build locally with `GALLERY_BASE=/preact-fluent-ui/ npm run build:gallery` for repository hosting. The build runs `check:gallery`; rerun it with the same GALLERY_BASE after inspecting or changing the artifact. `test:gallery-artifact` checks rejection of missing pages, relative nested assets, unresolved templates and wrong titles. `test:gallery-preview` checks the real preview server's handling of malformed requests and missing fallback HTML.

The Pages workflow checks out the matching release tag, supplies the repository base and clears local dist before copying the exact installed release. It then requires all seven Sidebar exports. If the published package lacks them, the workflow fails with a diagnostic requiring publication of a Sidebar-capable release. The published 0.1.0 package predates Sidebar; do not expect the new gallery to deploy against that package. The workflow does not substitute local unpublished Sidebar code. Publish a reviewed new library version before requesting deployment of this gallery.

The gallery's preact-iso and @preact/signals dependencies are development-only. They are not library runtime dependencies or peers. Unknown preview routes return the prerendered 404 with HTTP 404; known nested routes serve their own HTML under the configured base.
