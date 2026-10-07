# Src reorganization implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement the approved src organization review without changing public behavior.
**Architecture:** Explicit component exports; styling runtime/shared/config/compiler/adapters boundaries; separate preset data and generated runtime token bindings; local behavior hooks.
**Tech Stack:** Preact, TypeScript, Vite, Vitest, Node.
**Spec:** docs/superpowers/specs/2026-10-07-src-reorganization-design.md

## Global constraints

- Preserve all package exports, default token keys, styles and component behavior.
- Browser graphs must not include preset, compiler or adapter dependencies.
- Work on the current feature branch after the authorized baseline commit; keep changes reviewable in this workspace.
- Reuse existing behavioral coverage for mechanical moves; add a meaningful token-binding freshness test.

## Review focus

- Vite processor resolution from source and packed builds.
- Generated token keys and spacing compatibility names.
- Browser module graph and declaration dependency isolation.
- Modal focus restoration, inert and body overflow cleanup.
- Tooltip timer cleanup, modal portal selection and theme/geometry observation.

## Task 1: component exports and tests

- [x] Replace wildcard family exports with explicit runtime/type exports.
- [x] Route root component exports through family indexes; move multipart tests to __tests__.
- [x] Run component tests and typecheck.

## Task 2: styling boundaries and preset

- [x] Move runtime/shared/adapters files and rewrite import paths, build entries and declaration exports.
- [x] Split normalize CSS values from compiler selector traversal.
- [x] Split concrete tokens, semantic tokens and legacy aliases from fluent preset assembly.
- [x] Generate default runtime token references from preset, retaining the existing public key categories.
- [x] Add/run binding freshness and unknown-token behavior tests; run styling tests and build.

## Task 3: component behavior

- [x] Extract Modal focus/page lifecycle into use-modal-focus.ts.
- [x] Extract Tooltip interaction and geometry/theme observation into local hooks.
- [x] Run existing Modal/Tooltip behavior tests.

## Task 4: verification and review

- [x] Run full check, build and packed component/styling consumers.
- [x] Request an independent review of changes since ef1da63, address material findings.
- [x] Commit the verified refactor and store project context.
