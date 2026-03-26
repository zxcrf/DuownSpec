## 1. Change Artifacts

- [x] 1.1 Finalize proposal, design, and spec deltas for localized init/update behavior and MODO scaffold generation
- [x] 1.2 Validate the change artifacts with `duowenspec validate enhance-init-localized-modo-scaffold`

## 2. Init Tool Surface And Localization

- [x] 2.1 Restrict the supported tool registry, init help text, detection helpers, and non-interactive validation to the six supported tools
- [x] 2.2 Localize init interactive text, status output, and success messaging to Chinese while keeping core command names unchanged
- [x] 2.3 Localize generated skill metadata and command/prompt metadata to Chinese for the supported tools
- [x] 2.4 Preserve intentional adapterless behavior for any supported tool that still lacks a command adapter, with explicit tests

## 3. MODO Scaffold Generation

- [x] 3.1 Add `--scaffold` to `duowenspec init` and route scaffold generation through a dedicated helper
- [x] 3.2 Build the scaffold asset manifest from `modo-frame` and `b-end-design-pro` references, including themes, templates, biz components, and empty framework directories
- [x] 3.3 Exclude business logic, database schemas, migrations, production ACL/auth code, and project-specific icon inventories from the scaffold
- [x] 3.4 Generate scaffold `AGENTS.md` and `CLAUDE.md` symlink only when neither instruction file already exists

## 4. Update Flow Consistency

- [x] 4.1 Update `duowenspec update` so localized generated skill/command assets refresh consistently
- [x] 4.2 Reuse scaffold instruction-file sync logic during update so scaffolded projects keep the expected AGENTS/CLAUDE relationship

## 5. Verification

- [x] 5.1 Add or update unit tests for tool filtering, localized generation, scaffold copy rules, and instruction-file sync behavior
- [x] 5.2 Add or update CLI e2e coverage for `init --tools`, `init --scaffold`, and localized output expectations
- [x] 5.3 Run focused test suites for init/update and scaffold behavior
- [x] 5.4 Run a real `duowenspec init --scaffold` command in a temporary project and inspect the generated result
