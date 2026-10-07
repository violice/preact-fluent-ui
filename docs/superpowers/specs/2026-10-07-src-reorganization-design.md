# Src reorganization

The user approved the five recommendations in the src review and requested implementation. Preserve public package entrypoints, component behavior, theme values, generated stylesheet behavior and browser dependency isolation.

Component family indexes explicitly define exports; the root entrypoint exports through those indexes. Cross-component class tests live in components/__tests__.

Styling has runtime, shared, config, compiler and adapters directories. Runtime contains browser functions and compile-time API stubs. Shared contains pure CSS value expansion, class identities and common types. Compiler contains normalization and CSS generation. Adapters contain Vite integration and the WyW processor. The existing styling index remains the public entrypoint.

Fluent preset assembly imports concrete tokens and semantic tokens from config/fluent. Legacy aliases live separately. Generate the default runtime token references from the preset with a reproducible script and verify freshness; runtime must not import preset data. Keep the existing default token API keys and errors.

Modal delegates focus handling and page isolation to a local hook. Tooltip delegates interaction timers and geometry/theme observation to local hooks. Keep all event ordering, refs, cleanup and accessibility behavior.

Validate using the existing behavior tests, compiler integration tests, full check, build, and packed consumers. Keep the existing one-component-per-file organization.
