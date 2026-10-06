# WyW/Vite styling prototype

## Outcome

The basic approach works with the current toolchain: a custom object-call processor converts `css({ display: 'flex', color: 'red', gap })` into an exported class name and a separate CSS asset, resolving gap from an imported TypeScript module. The fixture also compiles styles inside a Preact TSX component. No downgrade or replacement of Vite was required.

This is a throwaway feasibility fixture, not a production styling API. Only implementation-plan Task 1 was authorized; Tasks 2–9 remain unimplemented.

## Toolchain

- Node 24.15.0; npm 12.2.0.
- Vite 8.3.1 with its existing Rolldown build pipeline.
- `@wyw-in-js/vite` 2.5.1 and `@wyw-in-js/processor-utils` 2.5.0, pinned as dev dependencies.
- Existing Preact preset and Preact remain unchanged. Installing the prototype dependencies changed no existing locked package versions; npm audit reported zero vulnerabilities.

## Registration and ordering

`tests/styling-consumer/prototype/processor.mjs` extends BaseProcessor, accepts callee/call params, registers the object expression as an evaluation dependency, emits a CSS artifact and replaces the call with a string literal.

`vite.config.mjs` registers it using the plugin's tagResolver for the fixture's `./api` css export. The plugin array lists WyW before the Preact preset and includes both TS and TSX, but WyW declares enforce: post. Its extraction runs in the post-transform phase, after ordinary Preact transforms; the TSX check proves interoperability with that actual sequence, not pre-JSX extraction. No Linaria runtime or custom replacement bundler is used.

The fixture accepts only flat string-valued style objects. It deliberately does not implement tokens, conditions, numeric units, atomic normalization, class merging, cva/sva, theme scopes or Box extraction. Those features still require their planned implementation and tests.

## Evidence

Run `npx vitest run src/styling/compiler/prototype.test.ts` to reproduce five integration checks:

1. A static object referencing an imported gap emits CSS with gap:16px and color:red. Importing emitted JS produces a class name found in that CSS. Two clean builds return identical CSS, JS and module identities.
2. Editing the imported token to 24px changes the next production build's CSS.
3. A function parameter in the style object rejects compilation, identifying entry.ts and explaining that a function parameter cannot be evaluated.
4. A real Vite dev HTTP server serves extracted CSS and updates it after an imported token changes, with no manual cache invalidation.
5. A Preact TSX component's style definition compiles successfully with the Preact preset and emits padding:12px.

The browser module graph contains neither WyW packages, the custom processor nor the throwing API stub. The emitted JS does not contain the uncompiled-API marker. The ordinary library build still passes its existing external-Preact, explicit-CSS, safe-Node-import and package-artifact checks; prototype fixture code is not connected to published entrypoints.

Tests first failed because processor integration did not exist. The additional TSX test first failed without Preact integration and passed after configuring the preset and TSX inclusion.

Validation completed: 5 focused integration tests, npm run check (366 tests plus 2 release tests, typecheck/lint/format/notices), npm run build and focused fixture lint/format. The author also checked that no pre-existing dependency versions changed. Independent read-only review ran the focused suite and found no extraction/toolchain/dependency-isolation blocker.

## Limits and next decision

WyW's runtime-parameter rejection includes the input filename but no precise line/column or code frame on this path. Record this as a Task 1 diagnostic limitation; production integration must add or recover precise source attribution instead of claiming that the upstream error already provides it.

Dev verification covers HTTP-serving and dependency/cache invalidation. It does not verify WebSocket HMR delivery, browser application of refreshed styles, or a visual browser workflow. Source maps are enabled, but positional accuracy has not been separately asserted. The future Box JSX prepass must have its own pre-transform hook: the standard WyW plugin alone runs too late for inspecting original JSX.

The feasibility result supports proceeding to shared normalization/schema and configuration work. It does not yet establish correctness of atomic overrides, nested themes, recipes or JSX spread handling. No product component was migrated and clsx/CVA remain until the later removal stage. No push, publication or application changes were performed.

## References

- https://wyw-in-js.dev/how-to/custom-tagged-template
- https://wyw-in-js.dev/bundlers/vite
