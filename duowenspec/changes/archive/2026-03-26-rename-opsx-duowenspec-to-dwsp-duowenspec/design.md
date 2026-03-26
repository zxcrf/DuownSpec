## Context

This fork already renamed part of the public surface from `duowenspec`/`opsx`, but naming is still mixed across binary command entry points, generated command files, templates, and user-facing output.

The change is cross-cutting because naming appears in:

- binary/package metadata
- command-generation templates
- init/update/getting-started output
- docs and agent-facing instruction templates
- tests that validate command names and guidance text

The target is a single coherent public naming policy:

- workflow command keyword: `dwsp`
- product keyword in core operations: `duowenspec`

## Goals / Non-Goals

**Goals:**

- Ensure new and updated projects use `dwsp` command keyword consistently.
- Ensure core user-facing operation text uses `duowenspec` instead of `duowenspec`.
- Keep compatibility behavior explicit and test-covered.
- Remove mixed-keyword output from init/update and generated workflow assets.

**Non-Goals:**

- Changing workflow stage semantics or gates.
- Refactoring unrelated modules while touching keyword text.
- Rebranding every historical archived artifact under `duowenspec/changes/archive`.

## Decisions

1. Use one canonical command keyword for generated operations: `dwsp`.
Alternatives considered:
- Keep both `opsx` and `dwsp` in generated output: rejected because it preserves ambiguity.
- Fully remove old alias at runtime immediately: deferred until compatibility impact is evaluated.
Decision for this change:
- Keep `opsx` as a compatibility alias in package bin mapping, but make `dwsp` the primary executable and the only keyword shown in generated workflow operations.

2. Use one canonical product keyword for core operation messaging: `duowenspec`.
Alternatives considered:
- Keep `DuowenSpec` in user-facing messaging while changing only command keyword: rejected because naming remains inconsistent.

3. Apply rename through explicit template/constants updates first, then flow-specific text.
Alternatives considered:
- Broad regex-only replacement: rejected due to high risk of corrupting paths, schema IDs, and historical references.
- Piecemeal flow-by-flow edits without central keyword map: rejected because drift likely returns.

4. Guard behavior with targeted tests for:
- generated command file names/paths
- init/update output text
- workflow guidance references in generated artifacts

## Risks / Trade-offs

- [Risk] Incomplete replacement leaves mixed naming in edge adapters.
  → Mitigation: add grep-based verification checks and adapter-level tests.

- [Risk] Over-replacement changes internal identifiers that should stay stable.
  → Mitigation: scope rename to public/binary/operation text surfaces and keep schema/internal IDs unchanged unless explicitly required.

- [Risk] Breaking existing scripts that invoke old command names.
  → Mitigation: document compatibility behavior and add migration note in release guidance.

- [Risk] Cross-platform path assertions fail if command directory naming logic changes.
  → Mitigation: keep path construction via `path.join` and update tests for Windows-safe expectations.
