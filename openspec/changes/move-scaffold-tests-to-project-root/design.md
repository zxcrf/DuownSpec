## Context

`init --scaffold` is expected to create a project structure that can be used directly. The current scaffold places `tests/` under `src/`, while users expect `tests/` to be a top-level folder. This is a small but visible behavior mismatch in generated project layout.

## Goals / Non-Goals

**Goals:**
- Ensure scaffolded projects place `tests/` at the project root.
- Remove generation of `src/tests/` from scaffold output.
- Keep scaffold generation deterministic and consistent with documented structure.

**Non-Goals:**
- Redesigning the full scaffold layout beyond test directory placement.
- Changing test framework choices or test file naming conventions.

## Decisions

- Update scaffold path mapping so test assets resolve to `tests/**` from project root.
  - Rationale: this directly aligns generated output with expected layout and minimizes downstream confusion.
  - Alternative considered: keep `src/tests/` and update docs only. Rejected because it preserves the mismatch users already identified.
- Enforce behavior with scaffold initialization tests that assert directory placement.
  - Rationale: prevents regression in future scaffold updates.
  - Alternative considered: rely on manual verification. Rejected because this behavior is easy to regress silently.

## Risks / Trade-offs

- [Risk] Existing assumptions in tests or template logic may reference `src/tests/` paths.
  → Mitigation: update affected assertions and fixtures together with scaffold path change.
- [Risk] Edge cases in template copy logic could leave stale directories.
  → Mitigation: verify generated tree in scaffold tests and ensure only root `tests/` is present.
