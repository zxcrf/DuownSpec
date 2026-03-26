## Context

This change crosses the CLI entrypoint, tool-selection rules, generated skill/command content, and a new scaffold generation path. It also needs to preserve cross-platform behavior because `init` already supports Windows, macOS, and Linux, and the new `CLAUDE.md` file needs symlink handling that may differ by platform.

The scaffold itself should not be invented from scratch. The clearest reference is `modo-frame` for the base runtime and folder structure, while `b-end-design-pro` already defines the MODO adapter's required assets, templates, and business components. The safest implementation is therefore a curated copy step that assembles a business-empty project from those two sources instead of trying to synthesize equivalent files ad hoc.

## Goals / Non-Goals

**Goals:**
- Narrow supported init tools to the six tools required by this fork
- Make init-facing descriptive output Chinese by default while leaving command IDs and core CLI command names unchanged
- Generate a MODO scaffold with the required adapter assets, templates, business components, and empty framework directories
- Create scaffold instruction files (`AGENTS.md` and `CLAUDE.md` symlink) only when the generated project does not already define them
- Keep update behavior consistent with the localized generation rules
- Keep all path handling and file operations cross-platform

**Non-Goals:**
- Supporting the removed upstream tools behind hidden flags
- Copying `modo-frame` business logic, database schemas, or production ACL/auth implementations into the scaffold
- Renaming `/dwsp:*` workflow IDs or changing the core CLI command surface
- Creating native command files for tools that still do not have a registered adapter

## Decisions

### 1. Restrict the tool list at the source of truth
The allowed tools should be enforced from `AI_TOOLS` and every derived helper should inherit that narrowed set. That keeps `--help`, interactive choices, validation, and detection aligned instead of filtering each call site separately.

Alternative considered: leave the full upstream tool table and hide unsupported tools only in prompts. Rejected because `--tools` validation and documentation would still expose unsupported IDs, which would break the fork's product boundary.

### 2. Localize generated descriptions at the template layer
Chinese defaults should be applied where skill metadata, command metadata, and init-facing summary text are generated. This keeps output consistent across `init` and `update`, and avoids one-off string replacements after file generation.

Alternative considered: inject a global language switch into runtime output only. Rejected because it would not localize generated `SKILL.md` metadata or prompt descriptions.

### 3. Implement scaffold generation as curated file assembly
`--scaffold` should assemble a project from a curated manifest:
- runtime/config roots from `modo-frame`
- adapter-required assets from `b-end-design-pro/assets`
- theme, templates, and biz components from `b-end-design-pro/adapters/modo`
- empty placeholder directories for areas that must exist without business logic

Alternative considered: clone/copy the full `modo-frame` tree and delete unwanted files. Rejected because that would be harder to reason about, more brittle as `modo-frame` evolves, and more likely to leak business files.

### 4. Keep scaffold instruction files under an explicit sync step
A small helper should decide whether to create `AGENTS.md` and a `CLAUDE.md` symlink. The helper should run after scaffold generation in `init`, and be reusable from `update` so localized updates do not drift from scaffold conventions.

Alternative considered: special-case this directly inside scaffold copy code. Rejected because the same rule set also needs to hold during refresh.

### 5. Treat symlink creation as best-effort but explicit
On platforms that support symlinks, `CLAUDE.md` should be a symlink to `AGENTS.md`. If symlink creation fails for a platform-specific reason, the command should surface a clear error instead of silently creating a second divergent file.

Alternative considered: always copy `AGENTS.md` into `CLAUDE.md`. Rejected because the user explicitly asked for a symlink and duplicated files would drift.

## Risks / Trade-offs

- [Reference assets drift] -> Keep scaffold copy logic manifest-driven and verify key expected files in tests so upstream reference changes fail clearly
- [Windows symlink behavior] -> Use Node filesystem APIs with explicit path handling and test the helper behavior separately from platform-specific symlink execution
- [Localization gaps] -> Centralize localized strings for init/update summaries and template metadata, then verify generated files in integration tests
- [Trae command generation mismatch] -> Preserve current adapterless behavior unless a dedicated adapter is added; document this in tests so the omission is intentional rather than accidental

## Migration Plan

1. Add the change artifacts and validate the spec delta
2. Implement the narrowed tool list and localized template/output changes
3. Implement scaffold asset assembly and instruction-file sync helpers
4. Update tests for init/update behavior, scaffold output, and generated metadata
5. Run focused test suites, then run a real `init --scaffold` command in a temporary directory and inspect the generated project

## Open Questions

- Whether Trae should remain skill-only in this slice or receive a command adapter as part of the same change
- Whether scaffold generation should install dependencies immediately or only write the project files and leave install to the user
