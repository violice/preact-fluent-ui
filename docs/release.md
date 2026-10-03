# npm releases

## Published 0.1.0

`@violice/preact-fluent-ui@0.1.0` was published on 2026-10-02 from commit `6307c6b869ca41fdeb4b31fac293639a940e2234`. The public registry's `latest` tag points to `0.1.0`; the initial registration version `0.0.0` remains under `bootstrap`.

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
npm run check
npm run build:gallery
npm run test:package:all
```

`check` runs typecheck, lint, format checks, behavior tests, release tests, and notices checks. Individual check commands remain available. Run `build` before `check` on a clean checkout because the gallery imports the built library and its declarations. `build:gallery` also consumes the library's existing `dist`. `dev` still builds the library before starting the gallery.

Finish both builds before `test:package:all`. This cross-platform Node command packs the existing build once with scripts disabled, then passes the same absolute tarball path to `test-package.mjs` for the root lockfile's Preact version and minimum peer `10.27.0`. A failed pack or verification stops the command and returns the child process's exit code.

For a standalone check, `npm run test:package -- --tarball <absolute-path> --preact 10.27.0` verifies that file without rebuilding, packing again, or depending on local library graph metadata. Without `--tarball`, `test:package` still packs the existing build and checks one peer. Both peer runs install the archive in fresh temporary consumers outside the repository. They check exports, declarations, private subpaths, all four CSS imports, external Preact, bundled helpers, notices/licenses, package contents, and Button-only tree shaking.

The evidence directory `.artifacts/package/` contains the tarball, its `.sha256` checksum, `verified-10.29.8.json`, `verified-10.27.0.json`, and full/minimal consumer outputs and JSON reports. The verifier writes the locked peer's exact version into the report filename if the lockfile changes. JSON reports record the archive SHA-256, file list, published source maps/imports, module graphs, live source mappings, one resolved Preact root per installation, and emitted raw/gzip byte sizes. CI uploads this directory as an artifact, including its hidden parent directory. These baselines have no arbitrary size limit.

## Future releases

Before the next release, update `package.json`, `package-lock.json`, and the changelog to a new unpublished version. The workflow obtains the archive filename from `npm pack`; no workflow filename changes are needed for a new version. Version `0.1.0` is already published and must not be reused.

Create `v<package.version>` at the reviewed commit, push the tag, and publish a GitHub Release. Pushing a tag alone does not trigger npm publication. `publish.yml` runs only on `release: published`, checks out that tag, and checks that its commit matches the release event's SHA. GitHub documents that SHA as the last commit in the tagged release in the [release event reference](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#release).

The workflow requires the exact `v<package.version>` tag and connected repository metadata before continuing. It builds the library once, runs `check`, builds the gallery, and runs `test:package:all` to pack once and verify the same archive with both Preact versions. After both checks pass, the command writes the archive filename to the step's `archive` output through `GITHUB_OUTPUT`. The workflow uploads the evidence, checks the saved SHA-256, then publishes that archive with public access and scripts disabled. It does not rebuild or pack between verification and publication.

After the workflow succeeds, inspect the public npm version and provenance. In a new temporary consumer, install the exact newly released version of `@violice/preact-fluent-ui` from `https://registry.npmjs.org`, compile the public TypeScript API, and build with the CSS imports. Save the installed version and registry/integrity evidence. Only that registry check establishes publication success. npm may report that the package is still being processed for a few minutes after a successful publish; wait for registry availability rather than publishing the same version again. A local tarball pass alone does not establish npm publication.

Windows forced-colors and reduced-motion acceptance remains pending as recorded in [visual acceptance](visual-acceptance.md). The workflow's DOM and archive checks do not replace those manual checks.

## Public gallery

The [GitHub Pages gallery](https://violice.github.io/preact-fluent-ui/) displays the latest stable GitHub release using its exact npm package version. The Gallery workflow runs after a successful Publish workflow and can also be started manually. It installs the published package, uses its JavaScript, declarations and CSS, and displays the version in the page heading. It retries installation while npm processes a new release.

Gallery page sources come from `main`; the showcased library comes from npm. Changes to `main` do not automatically redeploy the public gallery. Local `npm run dev` continues to build and use the library sources in the checkout.
