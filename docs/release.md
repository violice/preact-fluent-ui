# Release 0.1.0

This checkout prepares `@violice/preact-fluent-ui@0.1.0`. It has no connected GitHub repository or confirmed access to the `@violice` npm scope. No npm publication has been performed. Connecting the repository, registering the package, and publishing a GitHub Release require a separate release instruction.

## Connect the repository

The owner must choose the actual GitHub owner and repository and confirm npm scope rights. Add the following metadata to `package.json`, replacing both placeholders with the connected repository, then update the lockfile and commit the metadata before creating the release tag:

```json
"repository": {
  "type": "git",
  "url": "git+https://github.com/OWNER/REPOSITORY.git"
}
```

Do not release a placeholder URL. The publish workflow compares this URL with `GITHUB_REPOSITORY` and stops if it is absent or different. npm requires the metadata to match the actual GitHub repository for trusted publishing. Use a public repository and public package for automatic provenance. See [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/).

## Register the package and configure npm

Trusted publishing is configured in the settings of an existing npm package. It cannot bootstrap a name that has no package settings. The selected strategy is an owner-authenticated bootstrap version before the OIDC release of `0.1.0`.

1. Confirm ownership or publish rights for `@violice`, and check whether the package already exists. If it does, confirm its owners and published versions before proceeding.
2. If it does not exist, the owner must separately prepare and approve an initial registration package at version `0.0.0`, with the actual repository metadata and licenses. Publish that separately reviewed archive with public access and the `bootstrap` dist-tag using the owner's interactive npm authentication and required 2FA. Keep `0.1.0` unpublished for this workflow. Do not change this checkout's version or publish its archive as part of registration.
3. In the package settings on npmjs.com, add a GitHub Actions trusted publisher. Set organization/user to the actual GitHub owner, repository to its actual name, and workflow filename to `publish.yml`, without the directory. This workflow uses no GitHub environment, so leave environment name empty. Explicitly allow direct `npm publish` in the publisher's allowed actions.
4. Confirm that `0.1.0` is still available. Review the registration result and trusted publisher settings before creating `v0.1.0`.

The bootstrap is a future owner action, not a completed release or a credential fallback. The shipped workflow uses only OIDC on a GitHub-hosted Ubuntu runner, grants `id-token: write`, and installs npm `12.1.0` on Node 24. npm requires at least npm `11.5.1` and Node `22.14.0` for trusted publishing. It does not receive `NPM_TOKEN` or `NODE_AUTH_TOKEN`. For a public repository and public package, npm trusted publishing generates provenance automatically. These requirements and the publisher fields are documented in [npm's setup guide](https://docs.npmjs.com/trusted-publishers/).

If the owner later selects token authentication, configure a separate explicit workflow branch with its own secret and authentication step. There is no hidden token fallback in this workflow. That alternative is not configured here.

## Check one archive

Run on Node 24 with `npm ci`. CI on every push and pull request runs the same checks:

```sh
npm run check
npm run build
npm run build:gallery
npm run test:package:all
```

`check` runs typecheck, lint, format checks, behavior tests, release tests, and notices checks. Individual check commands remain available. `build:gallery` consumes the library's existing `dist`, so run `build` first. `dev` still builds the library before starting the gallery.

Finish both builds before `test:package:all`. This cross-platform Node command packs the existing build once with scripts disabled, then passes the same absolute tarball path to `test-package.mjs` for the root lockfile's Preact version and minimum peer `10.27.0`. A failed pack or verification stops the command and returns the child process's exit code.

For a standalone check, `npm run test:package -- --tarball <absolute-path> --preact 10.27.0` verifies that file without rebuilding, packing again, or depending on local library graph metadata. Without `--tarball`, `test:package` still packs the existing build and checks one peer. Both peer runs install the archive in fresh temporary consumers outside the repository. They check exports, declarations, private subpaths, all four CSS imports, external Preact, bundled helpers, notices/licenses, package contents, and Button-only tree shaking.

The evidence directory `.artifacts/package/` contains the tarball, its `.sha256` checksum, `verified-10.29.8.json`, `verified-10.27.0.json`, and full/minimal consumer outputs and JSON reports. The verifier writes the locked peer's exact version into the report filename if the lockfile changes. JSON reports record the archive SHA-256, file list, published source maps/imports, module graphs, live source mappings, one resolved Preact root per installation, and emitted raw/gzip byte sizes. CI uploads this directory as an artifact, including its hidden parent directory. These baselines have no arbitrary size limit.

## Publish and verify

After a separate release instruction, create `v0.1.0` at the reviewed commit and publish a GitHub Release. `publish.yml` runs only on `release: published`, checks out that tag, and checks that its commit matches the release event's SHA. GitHub documents that SHA as the last commit in the tagged release in the [release event reference](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#release).

The workflow requires the exact `v<package.version>` tag and connected repository metadata before continuing. It runs `check`, builds the library once and then the gallery, and runs `test:package:all` to pack once and verify the same archive with both Preact versions. It uploads the evidence, checks the saved SHA-256, then publishes exactly `violice-preact-fluent-ui-0.1.0.tgz` with public access and scripts disabled. It does not rebuild or pack between verification and publication.

After the workflow succeeds, inspect the public npm version and provenance. In a new temporary consumer, install `@violice/preact-fluent-ui@0.1.0` from `https://registry.npmjs.org`, compile the public TypeScript API, and build with the CSS imports. Save the installed version and registry/integrity evidence. Only that registry check establishes publication success and permits the final application migration plan to begin. A local tarball pass alone does not establish npm publication.

Windows forced-colors and reduced-motion acceptance remains pending as recorded in [visual acceptance](visual-acceptance.md). The workflow's DOM and archive checks do not replace those manual checks.
