# Supported Tools

DuowenSpec works with a focused set of AI coding assistants in this fork. When you run `dwsp init`, DuowenSpec configures selected tools using your active profile/workflow selection and delivery mode.

## How It Works

For each selected tool, DuowenSpec can install:

1. **Skills** (if delivery includes skills): `.../skills/dwsp-*/SKILL.md`
2. **Commands** (if delivery includes commands): tool-specific `dwsp-*` command files

By default, DuowenSpec uses the `core` profile, which includes:
- `propose`
- `explore`
- `apply`
- `archive`

You can enable expanded workflows (`new`, `continue`, `ff`, `verify`, `sync`, `bulk-archive`, `onboard`) via `dwsp config profile`, then run `dwsp update`.

## Tool Directory Reference

| Tool (ID) | Skills path pattern | Command path pattern |
|-----------|---------------------|----------------------|
| Claude Code (`claude`) | `.claude/skills/dwsp-*/SKILL.md` | `.claude/commands/dwsp/<id>.md` |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/dwsp-*/SKILL.md` | `.codebuddy/commands/dwsp/<id>.md` |
| Codex (`codex`) | `.codex/skills/dwsp-*/SKILL.md` | `$CODEX_HOME/prompts/dwsp-<id>.md`\* |
| OpenCode (`opencode`) | `.opencode/skills/dwsp-*/SKILL.md` | `.opencode/commands/dwsp-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/dwsp-*/SKILL.md` | `.qoder/commands/dwsp/<id>.md` |
| Trae (`trae`) | `.trae/skills/dwsp-*/SKILL.md` | Not generated (no command adapter; use skill-based `/dwsp-*` invocations) |

\* Codex commands are installed in the global Codex home (`$CODEX_HOME/prompts/` if set, otherwise `~/.codex/prompts/`), not your project directory.

## Non-Interactive Setup

For CI/CD or scripted setup, use `--tools` (and optionally `--profile`):

```bash
# Configure specific tools
dwsp init --tools claude,codex

# Configure all supported tools
dwsp init --tools all

# Skip tool configuration
dwsp init --tools none

# Override profile for this init run
dwsp init --profile core
```

**Available tool IDs (`--tools`):** `claude`, `codex`, `codebuddy`, `opencode`, `qoder`, `trae`

## Workflow-Dependent Installation

DuowenSpec installs workflow artifacts based on selected workflows:

- **Core profile (default):** `propose`, `explore`, `apply`, `archive`
- **Custom selection:** any subset of all workflow IDs:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

In other words, skill/command counts are profile-dependent and delivery-dependent, not fixed.

## Generated Skill Names

When selected by profile/workflow config, DuowenSpec generates these skills:

- `duowenspec-propose`
- `duowenspec-explore`
- `duowenspec-new-change`
- `duowenspec-continue-change`
- `duowenspec-apply-change`
- `duowenspec-ff-change`
- `duowenspec-sync-specs`
- `duowenspec-archive-change`
- `duowenspec-bulk-archive-change`
- `duowenspec-verify-change`
- `duowenspec-onboard`

See [Commands](commands.md) for command behavior and [CLI](cli.md) for `init`/`update` options.

## Related

- [CLI Reference](cli.md) — Terminal commands
- [Commands](commands.md) — Slash commands and skills
- [Getting Started](getting-started.md) — First-time setup
