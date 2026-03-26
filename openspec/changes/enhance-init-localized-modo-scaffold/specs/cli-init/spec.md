## MODIFIED Requirements

### Requirement: AI Tool Configuration

The command SHALL configure the fork's supported AI coding assistants with skills and slash commands using a searchable multi-select experience.

#### Scenario: Prompting for AI tool selection

- **WHEN** run interactively
- **THEN** display animated welcome screen with OpenSpec logo
- **AND** present a searchable multi-select that shows only these available tools: Claude Code, OpenCode, Trae, Qoder, CodeBuddy Code (CLI), and Codex
- **AND** mark already configured tools with a localized configured indicator
- **AND** pre-select configured tools for easy refresh
- **AND** sort configured tools to appear first in the list
- **AND** allow filtering by typing to search

#### Scenario: Selecting tools to configure

- **WHEN** user selects tools and confirms
- **THEN** generate skills in `.<tool>/skills/` directory for each selected tool
- **AND** generate slash commands for each selected tool that has a registered command adapter
- **AND** create `openspec/config.yaml` with default schema setting

### Requirement: Interactive Mode
The command SHALL provide an interactive menu for AI tool selection with clear localized navigation instructions.

#### Scenario: Displaying interactive menu
- **WHEN** run in fresh or extend mode
- **THEN** present a looping select menu that lets users toggle tools with Space and review selections with Enter
- **AND** when Enter is pressed on a highlighted selectable tool that is not already selected, automatically add it to the selection before moving to review so the highlighted tool is configured
- **AND** label already configured tools with localized text while keeping unsupported states out of the visible list
- **AND** change the prompt copy in extend mode to a Chinese description of adding or refreshing tools
- **AND** display inline Chinese instructions clarifying that Space toggles tools and Enter selects the highlighted tool before reviewing selections

### Requirement: Success Output

The command SHALL provide clear, Chinese-first next steps upon successful initialization.

#### Scenario: Displaying success message

- **WHEN** initialization completes successfully
- **THEN** display categorized summary lines in Chinese for created and refreshed tools
- **AND** display the count of generated skills and commands
- **AND** display Chinese getting-started guidance while keeping the actual command names unchanged
- **AND** display links to documentation and feedback

#### Scenario: Displaying restart instruction

- **WHEN** initialization completes successfully and tools were created or refreshed
- **THEN** display a Chinese instruction to restart the IDE for slash commands to take effect

### Requirement: Non-Interactive Mode

The command SHALL support non-interactive operation through command-line options for only the fork's supported tools.

#### Scenario: Select all tools non-interactively

- **WHEN** run with `--tools all`
- **THEN** automatically select every supported AI tool without prompting
- **AND** proceed with skill and command generation

#### Scenario: Select specific tools non-interactively

- **WHEN** run with `--tools claude,opencode` or any subset of the supported tool IDs
- **THEN** parse the comma-separated tool IDs
- **AND** generate skills and commands for specified tools only

#### Scenario: Invalid tool specification

- **WHEN** run with an unsupported tool ID
- **THEN** fail with exit code 1
- **AND** display an error listing only `all`, `none`, and the six supported tool IDs

#### Scenario: Missing --tools in non-interactive mode

- **GIVEN** prompts are unavailable in non-interactive execution
- **WHEN** user runs `openspec init` without `--tools`
- **THEN** fail with exit code 1
- **AND** instruct to use `--tools all`, `--tools none`, or explicit supported tool IDs

## ADDED Requirements

### Requirement: Chinese-First Generated Metadata
The command SHALL generate Chinese-first descriptive metadata while preserving stable workflow command IDs.

#### Scenario: Generating skill metadata
- **WHEN** initialization writes a `SKILL.md` file for a supported tool
- **THEN** the YAML `description` field SHALL be written in Chinese
- **AND** the skill body instructions SHALL use Chinese for descriptive guidance by default
- **AND** the skill `name` field SHALL remain the same workflow ID

#### Scenario: Generating command metadata
- **WHEN** initialization writes a slash command or prompt file for a supported tool
- **THEN** the human-readable `description` metadata SHALL be written in Chinese
- **AND** the command body SHALL use Chinese for descriptive guidance by default
- **AND** the command ID, file path convention, and `/opsx:*` workflow names SHALL remain unchanged

### Requirement: Scaffold Initialization
The command SHALL support generating a MODO-compatible empty scaffold project when `--scaffold` is provided.

#### Scenario: Generating scaffold project structure
- **WHEN** user runs `openspec init <path> --scaffold`
- **THEN** create the standard `openspec/` directory structure
- **AND** generate a business-empty scaffold project rooted at `<path>`
- **AND** include runtime/config files aligned with the `modo-frame` technical baseline
- **AND** include adapter-required assets, templates, and business components aligned with the `b-end-design-pro` modo adapter
- **AND** create empty placeholder directories for framework areas that must exist without business logic
- **AND** exclude business actions, database schemas, migrations, production ACL logic, and project-specific icon inventories from the scaffold

#### Scenario: Generating scaffold instruction files
- **WHEN** scaffold generation completes
- **AND** the generated project does not already contain `AGENTS.md` or `CLAUDE.md`
- **THEN** create `AGENTS.md` in the scaffold root
- **AND** create `CLAUDE.md` as a symlink that points to `AGENTS.md`

#### Scenario: Preserving existing instruction files during scaffold init
- **WHEN** scaffold generation targets a project that already contains `AGENTS.md` or `CLAUDE.md`
- **THEN** preserve the existing instruction files
- **AND** avoid overwriting them with scaffold defaults
