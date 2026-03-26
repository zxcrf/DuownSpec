## MODIFIED Requirements
### Requirement: AI Tool Configuration Details

The command SHALL properly configure selected AI tools with DuowenSpec-specific instructions using a marker system.

#### Scenario: Configuring Claude Code

- **WHEN** Claude Code is selected
- **THEN** create or update `CLAUDE.md` in the project root directory (not inside duowenspec/)
- **AND** populate the managed block with a short stub that points teammates to `@/duowenspec/AGENTS.md`

#### Scenario: Configuring CodeBuddy Code

- **WHEN** CodeBuddy Code is selected
- **THEN** create or update `CODEBUDDY.md` in the project root directory (not inside duowenspec/)
- **AND** populate the managed block with a short stub that points teammates to `@/duowenspec/AGENTS.md`

#### Scenario: Configuring Cline

- **WHEN** Cline is selected
- **THEN** create or update `CLINE.md` in the project root directory (not inside duowenspec/)
- **AND** populate the managed block with a short stub that points teammates to `@/duowenspec/AGENTS.md`

#### Scenario: Creating new CLAUDE.md

- **WHEN** CLAUDE.md does not exist
- **THEN** create new file with stub instructions wrapped in markers so the full workflow stays in `duowenspec/AGENTS.md`:
```markdown
<!-- DUOWENSPEC:START -->
# DuowenSpec Instructions

This project uses DuowenSpec to manage AI assistant workflows.

- Full guidance lives in '@/duowenspec/AGENTS.md'.
- Keep this managed block so 'duowenspec update' can refresh the instructions.
<!-- DUOWENSPEC:END -->
```

### Requirement: Slash Command Configuration
The init command SHALL generate slash command files for supported editors using shared templates.

#### Scenario: Generating slash commands for Claude Code
- **WHEN** the user selects Claude Code during initialization
- **THEN** create `.claude/commands/duowenspec/proposal.md`, `.claude/commands/duowenspec/apply.md`, and `.claude/commands/duowenspec/archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** each template includes instructions for the relevant DuowenSpec workflow stage

#### Scenario: Generating slash commands for CodeBuddy Code
- **WHEN** the user selects CodeBuddy Code during initialization
- **THEN** create `.codebuddy/commands/duowenspec/proposal.md`, `.codebuddy/commands/duowenspec/apply.md`, and `.codebuddy/commands/duowenspec/archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** each template includes instructions for the relevant DuowenSpec workflow stage

#### Scenario: Generating slash commands for Cline
- **WHEN** the user selects Cline during initialization
- **THEN** create `.clinerules/dwsp-proposal.md`, `.clinerules/dwsp-apply.md`, and `.clinerules/dwsp-archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** include Cline-specific Markdown heading frontmatter
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
