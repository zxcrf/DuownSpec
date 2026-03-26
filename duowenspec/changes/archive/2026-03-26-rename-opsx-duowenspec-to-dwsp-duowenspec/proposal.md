## Why

The repository currently mixes old and new keywords across command names, command text, and user-facing workflow steps. This creates confusion and breaks brand consistency for downstream users.

This change standardizes the public surface so users only see `dwsp` for workflow operations and `duowenspec` for product naming.

## What Changes

- Rename the binary command from `opsx` to `dwsp` across package metadata and executable entry points.
- Rename workflow operation keywords from `/opsx:*` to `/dwsp:*` in generated commands, prompts, and usage guidance.
- Rename visible `duowenspec` product keyword references to `duowenspec` in core operation flows and user-facing output.
- Keep backward compatibility behavior explicit (if any aliases remain, they must be documented and tested).

## Core User Stories

### Story US-1: New downstream project starts with unified naming

角色：
- downstream project developer

目标：
- initialize and use the workflow with only `dwsp` and `duowenspec` names

业务价值：
- avoids onboarding friction and naming ambiguity in enterprise adoption

关键流程：
- run initialization command for a clean project
- follow generated getting-started guidance
- run generated workflow commands in the selected AI tool

成功标志：
- all generated command names use `dwsp`
- user-facing setup output and guidance use `duowenspec`/`dwsp` consistently

### Story US-2: Existing project updates without mixed old keywords

角色：
- maintainer of an already initialized project

目标：
- update workflow assets and keep naming consistent after regeneration

业务价值：
- avoids mixed naming in long-lived projects and reduces operational mistakes

关键流程：
- run update command in an existing project
- inspect regenerated skills/commands/prompts
- continue implementation flow with updated command names

成功标志：
- regenerated assets do not reintroduce `/opsx:*`
- update summary and next-step instructions use new naming consistently

## Release Coverage

### Private Cloud Verification

覆盖故事：
- `US-1`
- `US-2`

覆盖流程：
- `US-1 / run initialization command for a clean project`
- `US-1 / follow generated getting-started guidance`
- `US-2 / run update command in an existing project`
- `US-2 / inspect regenerated skills/commands/prompts`

不通过条件：
- any generated core workflow command still uses `/opsx:*`
- user-facing core setup/update guidance still exposes `duowenspec` keyword where `duowenspec` is required

### Customer Environment Verification

覆盖故事：
- `US-1`

覆盖流程：
- `US-1 / run initialization command for a clean project`
- `US-1 / run generated workflow commands in the selected AI tool`

不通过条件：
- customer-facing quickstart still shows old command keyword
- generated tool-specific command entry points mismatch the renamed keyword

## Release Evidence Plan

### Private Cloud Verification

Accepted Evidence:
- `AI-run validation passed`
- `Human text confirmation passed`

Recording Rules:
- `Environment`: private-cloud
- `Method`: AI-run validation or human confirmation
- `Result`: passed / failed
- `Covered Stories`: `US-1`, `US-2`
- `Covered Flows`: named flows validated in this run
- `Evidence Summary`: command output + generated artifact spot-check summary
- `Recorder`: who recorded the outcome

### Customer Environment Verification

Accepted Evidence:
- `AI-run validation passed`
- `Human text confirmation passed`

Recording Rules:
- `Environment`: customer-environment
- `Method`: AI-run validation or human confirmation
- `Result`: passed / failed
- `Covered Stories`: `US-1`
- `Covered Flows`: named flows validated in this run
- `Evidence Summary`: customer-side init/usage confirmation summary
- `Recorder`: who recorded the outcome

## Capabilities

### New Capabilities
- `keyword-rebranding`: unified keyword and command naming for binary entrypoint, generated workflow commands, and user-facing core operation guidance

### Modified Capabilities
- None

## Impact

- `package.json`, bin entries, and command invocation docs
- command generation templates and tool adapters
- init/update user-visible output and getting-started prompts
- tests that assert command names and visible keyword text

## Out of Scope

- changing underlying workflow semantics or stage order
- redesigning skill logic unrelated to keyword naming
- broad marketing/content rewrite outside core operation and command surfaces
