## ADDED Requirements

### Requirement: Scaffold places tests directory at project root
When initializing a project with `init --scaffold`, the generated project structure SHALL include a `tests/` directory at the project root, not under `src/`.

#### Scenario: Root tests directory is generated
- **WHEN** a user runs project initialization with scaffold enabled
- **THEN** the generated project contains `tests/` at the top level
- **THEN** the generated project does not contain `src/tests/`
