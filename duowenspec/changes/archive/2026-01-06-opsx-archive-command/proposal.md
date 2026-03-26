## Why

The experimental workflow (OPSX) provides a schema-driven, artifact-by-artifact approach to creating changes with `/dwsp:new`, `/dwsp:continue`, `/dwsp:ff`, `/dwsp:apply`, and `/dwsp:sync`. However, there's no corresponding archive command to finalize and archive completed changes. Users must currently fall back to the regular `duowenspec archive` command, which doesn't integrate with the OPSX philosophy of agent-driven spec syncing and schema-aware artifact tracking.

## What Changes

- Add `/dwsp:archive` slash command for archiving changes in the experimental workflow
- Use artifact graph to check completion status (schema-aware) instead of just validating proposal + specs
- Prompt for `/dwsp:sync` before archiving instead of programmatically applying specs
- Preserve `.duowenspec.yaml` schema metadata when moving to archive
- Integrate with existing OPSX commands for a cohesive workflow

## Capabilities

### New Capabilities

- `opsx-archive-skill`: Slash command and skill for archiving completed changes in the experimental workflow. Checks artifact completion via artifact graph, verifies task completion, optionally syncs specs via `/dwsp:sync`, and moves the change to `archive/YYYY-MM-DD-<name>/`.

### Modified Capabilities

(none - this is a new skill that doesn't modify existing specs)

## Impact

- New file: `.claude/commands/opsx/archive.md`
- New skill definition (generated via `duowenspec artifact-experimental-setup`)
- No changes to existing archive command or other OPSX commands
- Completes the OPSX command suite for full lifecycle management
