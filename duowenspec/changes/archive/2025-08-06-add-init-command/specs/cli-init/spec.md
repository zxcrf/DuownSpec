# CLI Init Specification

## Purpose

The `duowenspec init` command SHALL create a complete DuowenSpec directory structure in any project, enabling immediate adoption of DuowenSpec conventions with support for multiple AI coding assistants.

## Behavior

### Progress Indicators

WHEN executing initialization steps
THEN validate environment silently in background (no output unless error)
AND display progress with ora spinners:
- Show spinner: "⠋ Creating DuowenSpec structure..."
- Then success: "✔ DuowenSpec structure created"
- Show spinner: "⠋ Configuring AI tools..."
- Then success: "✔ AI tools configured"

### Directory Creation

WHEN `duowenspec init` is executed
THEN create the following directory structure:
```
duowenspec/
├── project.md
├── README.md
├── specs/
└── changes/
    └── archive/
```

### File Generation

The command SHALL generate:
- `README.md` containing complete DuowenSpec instructions for AI assistants
- `project.md` with project context template

### AI Tool Configuration

WHEN run interactively
THEN prompt user to select AI tools to configure:
- Claude Code (updates/creates CLAUDE.md with DuowenSpec markers)
- Cursor (future)
- Aider (future)

### AI Tool Configuration Details

WHEN Claude Code is selected
THEN create or update `CLAUDE.md` in the project root directory (not inside duowenspec/)

WHEN CLAUDE.md does not exist
THEN create new file with DuowenSpec content wrapped in markers:
```markdown
<!-- DUOWENSPEC:START -->
# DuowenSpec Project

This document provides instructions for AI coding assistants on how to use DuowenSpec conventions for spec-driven development. Follow these rules precisely when working on DuowenSpec-enabled projects.

This project uses DuowenSpec for spec-driven development. Specifications are the source of truth.

See @duowenspec/README.md for detailed conventions and guidelines.
<!-- DUOWENSPEC:END -->
```

WHEN CLAUDE.md already exists
THEN preserve all existing content
AND insert DuowenSpec content at the beginning of the file using markers
AND ensure markers don't duplicate if they already exist

The marker system SHALL:
- Use `<!-- DUOWENSPEC:START -->` to mark the beginning of managed content
- Use `<!-- DUOWENSPEC:END -->` to mark the end of managed content
- Allow DuowenSpec to update its content without affecting user customizations
- Preserve all content outside the markers intact

WHY use markers:
- Users may have existing CLAUDE.md instructions they want to keep
- DuowenSpec can update its instructions in future versions
- Clear boundary between DuowenSpec-managed and user-managed content

### Interactive Mode

WHEN run
THEN prompt user with: "Which AI tool do you use?"
AND show single-select menu with available tools:
- Claude Code
AND show disabled options as "coming soon" (not selectable):
- Cursor (coming soon)
- Aider (coming soon)  
- Continue (coming soon)

User navigation:
- Use arrow keys to move between options
- Press Enter to select the highlighted option

### Safety Checks

WHEN `duowenspec/` directory already exists
THEN display error with ora fail indicator:
"✖ Error: DuowenSpec seems to already be initialized. Use 'duowenspec update' to update the structure."

WHEN checking initialization feasibility
THEN verify write permissions in the target directory silently
AND only display error if permissions are insufficient

### Success Output

WHEN initialization completes successfully
THEN display actionable prompts for AI-driven workflow:
```
✔ DuowenSpec initialized successfully!

Next steps - Copy these prompts to Claude:

────────────────────────────────────────────────────────────
1. Populate your project context:
   "Please read duowenspec/project.md and help me fill it out
    with details about my project, tech stack, and conventions"

2. Create your first change proposal:
   "I want to add [YOUR FEATURE HERE]. Please create an
    DuowenSpec change proposal for this feature"

3. Learn the DuowenSpec workflow:
   "Please explain the DuowenSpec workflow from duowenspec/README.md
    and how I should work with you on this project"
────────────────────────────────────────────────────────────
```

The prompts SHALL:
- Be copy-pasteable for immediate use with AI tools
- Guide users through the AI-driven workflow
- Replace placeholder text ([YOUR FEATURE HERE]) with actual features

### Exit Codes

- 0: Success
- 1: General error (including when DuowenSpec directory already exists)
- 2: Insufficient permissions (reserved for future use)
- 3: User cancelled operation (reserved for future use)

## Why

Manual creation of DuowenSpec structure is error-prone and creates adoption friction. A standardized init command ensures:
- Consistent structure across all projects
- Proper AI instruction files are always included
- Quick onboarding for new projects
- Clear conventions from the start