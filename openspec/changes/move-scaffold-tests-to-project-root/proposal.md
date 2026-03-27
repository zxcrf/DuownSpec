## Why

The scaffold created by `init --scaffold` currently places the `tests` directory under `src`, which does not match the expected project layout. This mismatch causes confusion and unnecessary manual restructuring immediately after initialization.

## What Changes

- Update scaffold behavior so `tests/` is generated at the project root level.
- Stop generating `src/tests/` in scaffolded projects.
- Define this expected layout as a documented requirement so future scaffold changes keep the same structure.

## Capabilities

### New Capabilities
- `scaffold-project-layout`: Defines required top-level directory layout produced by `init --scaffold`, including placement of `tests` at project root.

### Modified Capabilities

## Impact

- Affected command flow: project initialization with `init --scaffold`.
- Affected code area: scaffold template generation and path mapping logic.
- Affected outputs: newly generated project directory structure.
