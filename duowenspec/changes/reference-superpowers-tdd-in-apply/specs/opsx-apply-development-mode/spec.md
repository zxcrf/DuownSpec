## ADDED Requirements

### Requirement: Apply supports selectable development mode
The system SHALL allow the apply instruction flow to expose a selected development mode so implementation guidance can be standardized per team policy.

#### Scenario: Superpowers TDD mode is selected
- **WHEN** apply development mode is configured as `superpowers-tdd`
- **THEN** `duowenspec instructions apply` SHALL identify the active mode as `superpowers-tdd`
- **AND** returned guidance SHALL include a test-first workflow with explicit sequence: fail test, minimal code, full verification

#### Scenario: Unknown mode value
- **WHEN** apply development mode is configured with an unsupported value
- **THEN** the system SHALL fail with a clear validation error
- **AND** the error SHALL list allowed mode names

### Requirement: Default behavior remains unchanged without mode selection
The system SHALL keep existing apply guidance behavior when no development mode is configured.

#### Scenario: No development mode configured
- **WHEN** a project does not define apply development mode
- **THEN** `duowenspec instructions apply` SHALL continue to return current default guidance
- **AND** no additional mode-specific steps SHALL be injected
