## MODIFIED Requirements

### Requirement: Directory Creation

The command SHALL create the DuowenSpec directory structure with config file.

#### Scenario: Creating DuowenSpec structure

- **WHEN** `duowenspec init` is executed
- **THEN** create the following directory structure:
```
duowenspec/
├── config.yaml
├── specs/
└── changes/
    └── archive/
```

#### Scenario: Creating scaffold tests directory at project root

- **WHEN** `duowenspec init <path> --scaffold` is executed
- **THEN** the generated project at `<path>` SHALL include a top-level `tests` directory
- **AND** the generated project at `<path>` SHALL NOT include `src/tests`
- **AND** path resolution for these checks SHALL behave consistently across macOS, Linux, and Windows
