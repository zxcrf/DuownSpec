# Update Command Specification

## Purpose

As a developer using DuowenSpec, I want to update the DuowenSpec instructions in my project when new versions are released, so that I can benefit from improvements to AI agent instructions.

## Core Requirements

### Update Behavior

The update command SHALL update DuowenSpec instruction files to the latest templates.

WHEN a user runs `duowenspec update` THEN the command SHALL:
- Check if the `duowenspec` directory exists
- Replace `duowenspec/README.md` with the latest template (complete replacement)
- Update the DuowenSpec-managed block in `CLAUDE.md` using markers
  - Preserve user content outside markers
  - Create `CLAUDE.md` if missing
- Display ASCII-safe success message: "Updated DuowenSpec instructions"

### Prerequisites

The command SHALL require:
- An existing `duowenspec` directory (created by `duowenspec init`)

IF the `duowenspec` directory does not exist THEN:
- Display error: "No DuowenSpec directory found. Run 'duowenspec init' first."
- Exit with code 1

### File Handling

The update command SHALL:
- Completely replace `duowenspec/README.md` with the latest template
- Update only the DuowenSpec-managed block in `CLAUDE.md` using markers
- Use the default directory name `duowenspec`
- Be idempotent (repeated runs have no additional effect)

## Edge Cases

### File Permissions
IF file write fails THEN let the error bubble up naturally with file path.

### Missing CLAUDE.md
IF CLAUDE.md doesn't exist THEN create it with the template content.

### Custom Directory Name
Not supported in this change. The default directory name `duowenspec` SHALL be used.

## Success Criteria

Users SHALL be able to:
- Update DuowenSpec instructions with a single command
- Get the latest AI agent instructions
- See clear confirmation of the update

The update process SHALL be:
- Simple and fast (no version checking)
- Predictable (same result every time)
- Self-contained (no network required)