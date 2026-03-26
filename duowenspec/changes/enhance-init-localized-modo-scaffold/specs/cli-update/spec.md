## ADDED Requirements

### Requirement: Localized Artifact Refresh
The update command SHALL preserve the Chinese-first generated descriptions and guidance introduced by this fork.

#### Scenario: Updating localized skill files
- **WHEN** a configured supported tool already contains DuowenSpec-managed skill files
- **THEN** refresh the managed content using the current Chinese-first descriptions and guidance
- **AND** preserve any unmanaged content outside the DuowenSpec-managed sections when the tool format supports it

#### Scenario: Updating localized command files
- **WHEN** a configured supported tool already contains DuowenSpec-managed command or prompt files
- **THEN** refresh the managed content using the current Chinese-first descriptions and guidance
- **AND** preserve command IDs, path conventions, and `/dwsp:*` workflow names unchanged

### Requirement: Scaffold Instruction File Refresh
The update command SHALL preserve scaffold instruction-file conventions for projects created by this fork.

#### Scenario: Preserving scaffold AGENTS/CLAUDE files
- **WHEN** a project initialized by this fork contains `AGENTS.md` and a `CLAUDE.md` symlink
- **THEN** preserve the localized `AGENTS.md` content expected by the scaffold workflow
- **AND** preserve the `CLAUDE.md` symlink relationship instead of replacing it with an independent file
