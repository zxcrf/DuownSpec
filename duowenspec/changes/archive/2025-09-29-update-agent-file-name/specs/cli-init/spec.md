## MODIFIED Requirements

### Requirement: Directory Creation
The command SHALL create the complete DuowenSpec directory structure with all required directories and files.

#### Scenario: Creating DuowenSpec structure
- **WHEN** `duowenspec init` is executed
- **THEN** create the following directory structure:
```
duowenspec/
├── project.md
├── AGENTS.md
├── specs/
└── changes/
    └── archive/
```

### Requirement: File Generation
The command SHALL generate required template files with appropriate content for immediate use.

#### Scenario: Generating template files
- **WHEN** initializing DuowenSpec
- **THEN** generate `AGENTS.md` containing complete DuowenSpec instructions for AI assistants
- **AND** generate `project.md` with project context template

### Requirement: AI Tool Configuration Details

The command SHALL properly configure selected AI tools with DuowenSpec-specific instructions using a marker system.

#### Scenario: Creating new CLAUDE.md
- **WHEN** CLAUDE.md does not exist
- **THEN** create new file with DuowenSpec content wrapped in markers including reference to `@duowenspec/AGENTS.md`

### Requirement: Success Output

The command SHALL provide clear, actionable next steps upon successful initialization.

#### Scenario: Displaying success message
- **WHEN** initialization completes successfully
- **THEN** include prompt: "Please explain the DuowenSpec workflow from duowenspec/AGENTS.md and how I should work with you on this project"
