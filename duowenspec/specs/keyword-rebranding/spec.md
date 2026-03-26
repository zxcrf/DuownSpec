# keyword-rebranding Specification

## Purpose
TBD - created by archiving change rename-opsx-duowenspec-to-dwsp-duowenspec. Update Purpose after archive.
## Requirements
### Requirement: Binary command uses dwsp as the primary executable name
The system SHALL expose `dwsp` as the primary binary command name in package metadata and executable entry points.

#### Scenario: Running the binary help command
- **WHEN** a user runs the binary help command from this package
- **THEN** the usage output identifies the command as `dwsp`

#### Scenario: Global install command mapping
- **WHEN** the package is installed globally
- **THEN** the installed executable name for this fork is `dwsp`

### Requirement: Generated workflow commands use dwsp keyword
Generated workflow command assets SHALL use `dwsp` as the command keyword instead of `opsx` for core operations.

#### Scenario: Command generation during init
- **WHEN** a project runs initialization and command assets are generated
- **THEN** generated core workflow commands are named with `dwsp` keyword

#### Scenario: Command regeneration during update
- **WHEN** a project runs update and command assets are regenerated
- **THEN** regenerated core workflow commands continue to use `dwsp` keyword

### Requirement: Core operation guidance uses duowenspec naming
Core operation user-facing guidance SHALL use `duowenspec` naming instead of `duowenspec` where product keyword is presented.

#### Scenario: Init success guidance
- **WHEN** initialization completes
- **THEN** core operation guidance text uses `duowenspec` naming consistently

#### Scenario: Update success guidance
- **WHEN** update completes
- **THEN** core operation guidance text uses `duowenspec` naming consistently

### Requirement: Renamed keyword behavior is cross-platform stable
Keyword renaming SHALL preserve path-safe and platform-safe generation behavior on macOS, Linux, and Windows.

#### Scenario: Command and skill path generation
- **WHEN** command and skill paths are generated for supported tools
- **THEN** path construction uses explicit path handling compatible with Windows and POSIX separators

#### Scenario: Cross-platform verification
- **WHEN** tests assert generated command names and locations
- **THEN** assertions remain valid without relying on hardcoded path separators

