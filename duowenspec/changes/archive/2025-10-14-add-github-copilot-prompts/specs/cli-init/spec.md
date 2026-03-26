## MODIFIED Requirements

### Requirement: Slash Command Configuration
The init command SHALL generate slash command files for supported editors using shared templates.

#### Scenario: Generating slash commands for Claude Code
- **WHEN** the user selects Claude Code during initialization
- **THEN** create `.claude/commands/duowenspec/proposal.md`, `.claude/commands/duowenspec/apply.md`, and `.claude/commands/duowenspec/archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** each template includes instructions for the relevant DuowenSpec workflow stage

#### Scenario: Generating slash commands for Cursor
- **WHEN** the user selects Cursor during initialization
- **THEN** create `.cursor/commands/dwsp-proposal.md`, `.cursor/commands/dwsp-apply.md`, and `.cursor/commands/dwsp-archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** each template includes instructions for the relevant DuowenSpec workflow stage

#### Scenario: Generating slash commands for OpenCode
- **WHEN** the user selects OpenCode during initialization
- **THEN** create `.opencode/commands/dwsp-proposal.md`, `.opencode/commands/dwsp-apply.md`, and `.opencode/commands/dwsp-archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** each template includes instructions for the relevant DuowenSpec workflow stage

#### Scenario: Generating slash commands for Windsurf
- **WHEN** the user selects Windsurf during initialization
- **THEN** create `.windsurf/workflows/dwsp-proposal.md`, `.windsurf/workflows/dwsp-apply.md`, and `.windsurf/workflows/dwsp-archive.md`
- **AND** populate each file from shared templates (wrapped in DuowenSpec markers) so workflow text matches other tools
- **AND** each template includes instructions for the relevant DuowenSpec workflow stage

#### Scenario: Generating slash commands for Kilo Code
- **WHEN** the user selects Kilo Code during initialization
- **THEN** create `.kilocode/workflows/dwsp-proposal.md`, `.kilocode/workflows/dwsp-apply.md`, and `.kilocode/workflows/dwsp-archive.md`
- **AND** populate each file from shared templates (wrapped in DuowenSpec markers) so workflow text matches other tools
- **AND** each template includes instructions for the relevant DuowenSpec workflow stage

#### Scenario: Generating slash commands for Codex
- **WHEN** the user selects Codex during initialization
- **THEN** create global prompt files at `~/.codex/prompts/dwsp-proposal.md`, `~/.codex/prompts/dwsp-apply.md`, and `~/.codex/prompts/dwsp-archive.md` (or under `$CODEX_HOME/prompts` if set)
- **AND** populate each file from shared templates that map the first numbered placeholder (`$1`) to the primary user input (e.g., change identifier or question text)
- **AND** wrap the generated content in DuowenSpec markers so `duowenspec update` can refresh the prompts without touching surrounding custom notes

#### Scenario: Generating slash commands for GitHub Copilot
- **WHEN** the user selects GitHub Copilot during initialization
- **THEN** create `.github/prompts/dwsp-proposal.prompt.md`, `.github/prompts/dwsp-apply.prompt.md`, and `.github/prompts/dwsp-archive.prompt.md`
- **AND** populate each file with YAML frontmatter containing a `description` field that summarizes the workflow stage
- **AND** include `$ARGUMENTS` placeholder to capture user input
- **AND** wrap the shared template body with DuowenSpec markers so `duowenspec update` can refresh the content
- **AND** each template includes instructions for the relevant DuowenSpec workflow stage
