# CLI Reference

The DuowenSpec CLI (`dwsp`) provides terminal commands for project setup, validation, status inspection, and management. These commands complement the AI slash commands (like `/dwsp:propose`) documented in [Commands](commands.md).

## Summary

| Category | Commands | Purpose |
|----------|----------|---------|
| **Setup** | `init`, `update` | Initialize and update DuowenSpec in your project |
| **Browsing** | `list`, `view`, `show` | Explore changes and specs |
| **Validation** | `validate` | Check changes and specs for issues |
| **Lifecycle** | `archive` | Finalize completed changes |
| **Workflow** | `status`, `instructions`, `templates`, `schemas` | Artifact-driven workflow support |
| **Schemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | Create and manage custom workflows |
| **Config** | `config` | View and modify settings |
| **Utility** | `feedback`, `completion` | Feedback and shell integration |

---

## Human vs Agent Commands

Most CLI commands are designed for **human use** in a terminal. Some commands also support **agent/script use** via JSON output.

### Human-Only Commands

These commands are interactive and designed for terminal use:

| Command | Purpose |
|---------|---------|
| `dwsp init` | Initialize project (interactive prompts) |
| `dwsp view` | Interactive dashboard |
| `dwsp config edit` | Open config in editor |
| `dwsp feedback` | Submit feedback via GitHub |
| `dwsp completion install` | Install shell completions |

### Agent-Compatible Commands

These commands support `--json` output for programmatic use by AI agents and scripts:

| Command | Human Use | Agent Use |
|---------|-----------|-----------|
| `dwsp list` | Browse changes/specs | `--json` for structured data |
| `dwsp show <item>` | Read content | `--json` for parsing |
| `dwsp validate` | Check for issues | `--all --json` for bulk validation |
| `dwsp status` | See artifact progress | `--json` for structured status |
| `dwsp instructions` | Get next steps | `--json` for agent instructions |
| `dwsp templates` | Find template paths | `--json` for path resolution |
| `dwsp schemas` | List available schemas | `--json` for schema discovery |

---

## Global Options

These options work with all commands:

| Option | Description |
|--------|-------------|
| `--version`, `-V` | Show version number |
| `--no-color` | Disable color output |
| `--help`, `-h` | Display help for command |

---

## Setup Commands

### `dwsp init`

Initialize DuowenSpec in your project. Creates the folder structure and configures AI tool integrations.

Default behavior uses global config defaults: profile `core`, delivery `both`, workflows `propose, explore, apply, archive`.

```
dwsp init [path] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `path` | No | Target directory (default: current directory) |

**Options:**

| Option | Description |
|--------|-------------|
| `--tools <list>` | Configure AI tools non-interactively. Use `all`, `none`, or comma-separated list |
| `--force` | Auto-cleanup legacy files without prompting |
| `--profile <profile>` | Override global profile for this init run (`core` or `custom`) |

`--profile custom` uses whatever workflows are currently selected in global config (`dwsp config profile`).

**Supported tool IDs (`--tools`):** `claude`, `codex`, `codebuddy`, `opencode`, `qoder`, `trae`

**Examples:**

```bash
# Interactive initialization
dwsp init

# Initialize in a specific directory
dwsp init ./my-project

# Non-interactive: configure for Claude and Codex
dwsp init --tools claude,codex

# Configure for all supported tools
dwsp init --tools all

# Override profile for this run
dwsp init --profile core

# Skip prompts and auto-cleanup legacy files
dwsp init --force
```

**What it creates:**

```
duowenspec/
├── specs/              # Your specifications (source of truth)
├── changes/            # Proposed changes
└── config.yaml         # Project configuration

.claude/skills/         # Claude Code skills (if claude selected)
.opencode/skills/       # OpenCode skills (if opencode selected)
.opencode/commands/     # OpenCode OPSX commands (if delivery includes commands)
... (other tool configs)
```

---

### `dwsp update`

Update DuowenSpec instruction files after upgrading the CLI. Re-generates AI tool configuration files using your current global profile, selected workflows, and delivery mode.

```
dwsp update [path] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `path` | No | Target directory (default: current directory) |

**Options:**

| Option | Description |
|--------|-------------|
| `--force` | Force update even when files are up to date |

**Example:**

```bash
# Update instruction files after npm upgrade
npm update @duowen-ai/duowenspec
dwsp update
```

---

## Browsing Commands

### `dwsp list`

List changes or specs in your project.

```
dwsp list [options]
```

**Options:**

| Option | Description |
|--------|-------------|
| `--specs` | List specs instead of changes |
| `--changes` | List changes (default) |
| `--sort <order>` | Sort by `recent` (default) or `name` |
| `--json` | Output as JSON |

**Examples:**

```bash
# List all active changes
dwsp list

# List all specs
dwsp list --specs

# JSON output for scripts
dwsp list --json
```

**Output (text):**

```
Active changes:
  add-dark-mode     UI theme switching support
  fix-login-bug     Session timeout handling
```

---

### `dwsp view`

Display an interactive dashboard for exploring specs and changes.

```
dwsp view
```

Opens a terminal-based interface for navigating your project's specifications and changes.

---

### `dwsp show`

Display details of a change or spec.

```
dwsp show [item-name] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `item-name` | No | Name of change or spec (prompts if omitted) |

**Options:**

| Option | Description |
|--------|-------------|
| `--type <type>` | Specify type: `change` or `spec` (auto-detected if unambiguous) |
| `--json` | Output as JSON |
| `--no-interactive` | Disable prompts |

**Change-specific options:**

| Option | Description |
|--------|-------------|
| `--deltas-only` | Show only delta specs (JSON mode) |

**Spec-specific options:**

| Option | Description |
|--------|-------------|
| `--requirements` | Show only requirements, exclude scenarios (JSON mode) |
| `--no-scenarios` | Exclude scenario content (JSON mode) |
| `-r, --requirement <id>` | Show specific requirement by 1-based index (JSON mode) |

**Examples:**

```bash
# Interactive selection
dwsp show

# Show a specific change
dwsp show add-dark-mode

# Show a specific spec
dwsp show auth --type spec

# JSON output for parsing
dwsp show add-dark-mode --json
```

---

## Validation Commands

### `dwsp validate`

Validate changes and specs for structural issues.

```
dwsp validate [item-name] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `item-name` | No | Specific item to validate (prompts if omitted) |

**Options:**

| Option | Description |
|--------|-------------|
| `--all` | Validate all changes and specs |
| `--changes` | Validate all changes |
| `--specs` | Validate all specs |
| `--type <type>` | Specify type when name is ambiguous: `change` or `spec` |
| `--strict` | Enable strict validation mode |
| `--json` | Output as JSON |
| `--concurrency <n>` | Max parallel validations (default: 6, or `DUOWENSPEC_CONCURRENCY` env) |
| `--no-interactive` | Disable prompts |

**Examples:**

```bash
# Interactive validation
dwsp validate

# Validate a specific change
dwsp validate add-dark-mode

# Validate all changes
dwsp validate --changes

# Validate everything with JSON output (for CI/scripts)
dwsp validate --all --json

# Strict validation with increased parallelism
dwsp validate --all --strict --concurrency 12
```

**Output (text):**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

1 warning found
```

**Output (JSON):**

```json
{
  "version": "1.0.0",
  "results": {
    "changes": [
      {
        "name": "add-dark-mode",
        "valid": true,
        "warnings": ["design.md: missing 'Technical Approach' section"]
      }
    ]
  },
  "summary": {
    "total": 1,
    "valid": 1,
    "invalid": 0
  }
}
```

---

## Lifecycle Commands

### `dwsp archive`

Archive a completed change and merge delta specs into main specs.

```
dwsp archive [change-name] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `change-name` | No | Change to archive (prompts if omitted) |

**Options:**

| Option | Description |
|--------|-------------|
| `-y, --yes` | Skip confirmation prompts |
| `--skip-specs` | Skip spec updates (for infrastructure/tooling/doc-only changes) |
| `--no-validate` | Skip validation (requires confirmation) |

**Examples:**

```bash
# Interactive archive
dwsp archive

# Archive specific change
dwsp archive add-dark-mode

# Archive without prompts (CI/scripts)
dwsp archive add-dark-mode --yes

# Archive a tooling change that doesn't affect specs
dwsp archive update-ci-config --skip-specs
```

**What it does:**

1. Validates the change (unless `--no-validate`)
2. Prompts for confirmation (unless `--yes`)
3. Merges delta specs into `duowenspec/specs/`
4. Moves change folder to `duowenspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Workflow Commands

These commands support the artifact-driven OPSX workflow. They're useful for both humans checking progress and agents determining next steps.

### `dwsp status`

Display artifact completion status for a change.

```
dwsp status [options]
```

**Options:**

| Option | Description |
|--------|-------------|
| `--change <id>` | Change name (prompts if omitted) |
| `--schema <name>` | Schema override (auto-detected from change's config) |
| `--json` | Output as JSON |

**Examples:**

```bash
# Interactive status check
dwsp status

# Status for specific change
dwsp status --change add-dark-mode

# JSON for agent use
dwsp status --change add-dark-mode --json
```

**Output (text):**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[ ] design
[x] specs
[-] tasks (blocked by: design)
```

**Output (JSON):**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done"},
    {"id": "design", "outputPath": "design.md", "status": "ready"},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done"},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "missingDeps": ["design"]}
  ]
}
```

---

### `dwsp instructions`

Get enriched instructions for creating an artifact or applying tasks. Used by AI agents to understand what to create next.

```
dwsp instructions [artifact] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `artifact` | No | Artifact ID: `proposal`, `specs`, `design`, `tasks`, or `apply` |

**Options:**

| Option | Description |
|--------|-------------|
| `--change <id>` | Change name (required in non-interactive mode) |
| `--schema <name>` | Schema override |
| `--json` | Output as JSON |

**Special case:** Use `apply` as the artifact to get task implementation instructions.

**Examples:**

```bash
# Get instructions for next artifact
dwsp instructions --change add-dark-mode

# Get specific artifact instructions
dwsp instructions design --change add-dark-mode

# Get apply/implementation instructions
dwsp instructions apply --change add-dark-mode

# JSON for agent consumption
dwsp instructions design --change add-dark-mode --json
```

**Output includes:**

- Template content for the artifact
- Project context from config
- Content from dependency artifacts
- Per-artifact rules from config
- For `dwsp instructions apply --json`, includes `developmentMode` (`superpowers-tdd` or `null`)

---

### `dwsp templates`

Show resolved template paths for all artifacts in a schema.

```
dwsp templates [options]
```

**Options:**

| Option | Description |
|--------|-------------|
| `--schema <name>` | Schema to inspect (default: `spec-driven`) |
| `--json` | Output as JSON |

**Examples:**

```bash
# Show template paths for default schema
dwsp templates

# Show templates for custom schema
dwsp templates --schema my-workflow

# JSON for programmatic use
dwsp templates --json
```

**Output (text):**

```
Schema: spec-driven

Templates:
  proposal  → ~/.duowenspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.duowenspec/schemas/spec-driven/templates/specs.md
  design    → ~/.duowenspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.duowenspec/schemas/spec-driven/templates/tasks.md
```

---

### `dwsp schemas`

List available workflow schemas with their descriptions and artifact flows.

```
dwsp schemas [options]
```

**Options:**

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

**Example:**

```bash
dwsp schemas
```

**Output:**

```
Available schemas:

  spec-driven (package)
    The default spec-driven development workflow
    Flow: proposal → specs → design → tasks

  my-custom (project)
    Custom workflow for this project
    Flow: research → proposal → tasks
```

---

## Schema Commands

Commands for creating and managing custom workflow schemas.

### `dwsp schema init`

Create a new project-local schema.

```
dwsp schema init <name> [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `name` | Yes | Schema name (kebab-case) |

**Options:**

| Option | Description |
|--------|-------------|
| `--description <text>` | Schema description |
| `--artifacts <list>` | Comma-separated artifact IDs (default: `proposal,specs,design,tasks`) |
| `--default` | Set as project default schema |
| `--no-default` | Don't prompt to set as default |
| `--force` | Overwrite existing schema |
| `--json` | Output as JSON |

**Examples:**

```bash
# Interactive schema creation
dwsp schema init research-first

# Non-interactive with specific artifacts
dwsp schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**What it creates:**

```
duowenspec/schemas/<name>/
├── schema.yaml           # Schema definition
└── templates/
    ├── proposal.md       # Template for each artifact
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `dwsp schema fork`

Copy an existing schema to your project for customization.

```
dwsp schema fork <source> [name] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `source` | Yes | Schema to copy |
| `name` | No | New schema name (default: `<source>-custom`) |

**Options:**

| Option | Description |
|--------|-------------|
| `--force` | Overwrite existing destination |
| `--json` | Output as JSON |

**Example:**

```bash
# Fork the built-in spec-driven schema
dwsp schema fork spec-driven my-workflow
```

---

### `dwsp schema validate`

Validate a schema's structure and templates.

```
dwsp schema validate [name] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `name` | No | Schema to validate (validates all if omitted) |

**Options:**

| Option | Description |
|--------|-------------|
| `--verbose` | Show detailed validation steps |
| `--json` | Output as JSON |

**Example:**

```bash
# Validate a specific schema
dwsp schema validate my-workflow

# Validate all schemas
dwsp schema validate
```

---

### `dwsp schema which`

Show where a schema resolves from (useful for debugging precedence).

```
dwsp schema which [name] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `name` | No | Schema name |

**Options:**

| Option | Description |
|--------|-------------|
| `--all` | List all schemas with their sources |
| `--json` | Output as JSON |

**Example:**

```bash
# Check where a schema comes from
dwsp schema which spec-driven
```

**Output:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@duowen-ai/duowenspec/schemas/spec-driven
```

**Schema precedence:**

1. Project: `duowenspec/schemas/<name>/`
2. User: `~/.local/share/duowenspec/schemas/<name>/`
3. Package: Built-in schemas

---

## Configuration Commands

### `dwsp config`

View and modify global DuowenSpec configuration.

```
dwsp config <subcommand> [options]
```

**Subcommands:**

| Subcommand | Description |
|------------|-------------|
| `path` | Show config file location |
| `list` | Show all current settings |
| `get <key>` | Get a specific value |
| `set <key> <value>` | Set a value |
| `unset <key>` | Remove a key |
| `reset` | Reset to defaults |
| `edit` | Open in `$EDITOR` |
| `profile [preset]` | Configure workflow profile interactively or via preset |

**Examples:**

```bash
# Show config file path
dwsp config path

# List all settings
dwsp config list

# Get a specific value
dwsp config get telemetry.enabled

# Set a value
dwsp config set telemetry.enabled false

# Set a string value explicitly
dwsp config set user.name "My Name" --string

# Remove a custom setting
dwsp config unset user.name

# Reset all configuration
dwsp config reset --all --yes

# Edit config in your editor
dwsp config edit

# Configure profile with action-based wizard
dwsp config profile

# Fast preset: switch workflows to core (keeps delivery mode)
dwsp config profile core
```

`dwsp config profile` starts with a current-state summary, then lets you choose:
- Change delivery + workflows
- Change delivery only
- Change workflows only
- Keep current settings (exit)

If you keep current settings, no changes are written and no update prompt is shown.
If there are no config changes but the current project files are out of sync with your global profile/delivery, DuowenSpec will show a warning and suggest running `dwsp update`.
Pressing `Ctrl+C` also cancels the flow cleanly (no stack trace) and exits with code `130`.
In the workflow checklist, `[x]` means the workflow is selected in global config. To apply those selections to project files, run `dwsp update` (or choose `Apply changes to this project now?` when prompted inside a project).

**Interactive examples:**

```bash
# Delivery-only update
dwsp config profile
# choose: Change delivery only
# choose delivery: Skills only

# Workflows-only update
dwsp config profile
# choose: Change workflows only
# toggle workflows in the checklist, then confirm
```

---

## Utility Commands

### `dwsp feedback`

Submit feedback about DuowenSpec. Creates a GitHub issue.

```
dwsp feedback <message> [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `message` | Yes | Feedback message |

**Options:**

| Option | Description |
|--------|-------------|
| `--body <text>` | Detailed description |

**Requirements:** GitHub CLI (`gh`) must be installed and authenticated.

**Example:**

```bash
dwsp feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `dwsp completion`

Manage shell completions for the DuowenSpec CLI.

```
dwsp completion <subcommand> [shell]
```

**Subcommands:**

| Subcommand | Description |
|------------|-------------|
| `generate [shell]` | Output completion script to stdout |
| `install [shell]` | Install completion for your shell |
| `uninstall [shell]` | Remove installed completions |

**Supported shells:** `bash`, `zsh`, `fish`, `powershell`

**Examples:**

```bash
# Install completions (auto-detects shell)
dwsp completion install

# Install for specific shell
dwsp completion install zsh

# Generate script for manual installation
dwsp completion generate bash > ~/.bash_completion.d/duowenspec

# Uninstall
dwsp completion uninstall
```

---

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Success |
| `1` | Error (validation failure, missing files, etc.) |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DUOWENSPEC_CONCURRENCY` | Default concurrency for bulk validation (default: 6) |
| `EDITOR` or `VISUAL` | Editor for `dwsp config edit` |
| `NO_COLOR` | Disable color output when set |

---

## Related Documentation

- [Commands](commands.md) - AI slash commands (`/dwsp:propose`, `/dwsp:apply`, etc.)
- [Workflows](workflows.md) - Common patterns and when to use each command
- [Customization](customization.md) - Create custom schemas and templates
- [Getting Started](getting-started.md) - First-time setup guide
