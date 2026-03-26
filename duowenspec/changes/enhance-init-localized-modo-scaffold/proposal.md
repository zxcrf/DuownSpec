## Why

The current `duowenspec init` flow is still optimized for the broad upstream tool matrix and English-first assets. That does not match this fork's intended operator experience: a narrow set of supported assistants, Chinese-first interaction, and the ability to bootstrap a MODO-style admin scaffold without hand-copying another repository.

Without a first-class scaffold path, teams must manually study `modo-frame`, manually copy `b-end-design-pro` adapter assets, and manually recreate project guidance files. That creates setup drift, inconsistent prompts, and an initialization flow that does not actually deliver a ready-to-use starter project.

## What Changes

- Restrict `duowenspec init` tool selection and validation to `claude`, `opencode`, `trae`, `qoder`, `codebuddy`, and `codex`
- Make `init` output, generated prompt descriptions, and generated skill descriptions Chinese by default while keeping command IDs unchanged
- Add `duowenspec init --scaffold` to generate a business-empty MODO scaffold based on `modo-frame` and the `b-end-design-pro` modo adapter assets
- Generate `AGENTS.md` for scaffolded projects that do not already provide `AGENTS.md` or `CLAUDE.md`, and create a `CLAUDE.md` symlink that points to it
- Ensure `duowenspec update` preserves the Chinese-first generated assets and scaffold instruction file behavior
- Add test coverage and real-command verification for the new init/update flows

## Capabilities

### New Capabilities
- `modo-scaffold-project`: initialize a MODO-compatible empty scaffold project, including adapter assets, templates, business components, and project guidance files

### Modified Capabilities
- `cli-init`: change supported tools, add Chinese-first init behavior, and add scaffold initialization flow
- `cli-update`: preserve localized generated assets and scaffold instruction-file behavior during refresh

## Impact

- Affected code: `src/cli/index.ts`, `src/core/init.ts`, `src/core/update.ts`, tool config/detection, skill/command template generation, and supporting utilities
- New scaffold assets and copy logic will be needed for theme files, templates, business components, PRD files, and instruction files
- Documentation for supported tools and init/update behavior will need to reflect the narrowed tool surface and scaffold mode
- Verification must include unit tests, CLI e2e coverage, and a real `init --scaffold` run against a temporary project
