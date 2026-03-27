## MODIFIED Requirements

### Requirement: Apply Instructions Command

The system SHALL generate schema-aware apply instructions via `duowenspec instructions apply`, and include development-mode guidance when configured.

#### Scenario: Generate apply instructions

- **WHEN** user runs `duowenspec instructions apply --change <id>`
- **AND** all required artifacts (per schema's `apply.requires`) exist
- **THEN** the system outputs:
  - Context files from all existing artifacts
  - Schema-specific instruction text
  - Progress tracking file path (if `apply.tracks` is set)
  - Active development mode guidance when apply development mode is configured

#### Scenario: Apply blocked by missing artifacts

- **WHEN** user runs `duowenspec instructions apply --change <id>`
- **AND** required artifacts are missing
- **THEN** the system indicates apply is blocked
- **AND** lists which artifacts must be created first

#### Scenario: Apply instructions JSON output

- **WHEN** user runs `duowenspec instructions apply --change <id> --json`
- **THEN** the system outputs JSON with:
  - `contextFiles`: array of paths to existing artifacts
  - `instruction`: the apply instruction text
  - `tracks`: path to progress file or null
  - `applyRequires`: list of required artifact IDs
  - `developmentMode`: active apply development mode name or null

#### Scenario: Superpowers TDD mode instruction shape

- **WHEN** user runs `duowenspec instructions apply --change <id>`
- **AND** active development mode is `superpowers-tdd`
- **THEN** instruction text SHALL include explicit sequence for test-first delivery
- **AND** sequence SHALL describe: create or update failing tests, implement minimal code to pass, run verification before marking tasks complete
