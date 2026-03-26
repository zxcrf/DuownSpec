## Why

<!--
Explain why this change matters now.
- What problem or opportunity is driving this work?
- Why should it be done now?
- What happens if it is not done?
Keep this focused on intent, not implementation details.
-->

## What Changes

<!--
Describe the concrete scope of the change.
- What is being added, updated, or removed?
- What will users or operators notice?
- What is intentionally not changing here?
-->

## Core User Stories

<!--
List the release-critical user stories for this change.
Use 2-5 stories when possible.
Each story should describe one complete user goal and the user-visible flows
that later release verification must cover.
-->

### Story US-1: <short title>

角色：
- <who uses this capability>

目标：
- <what this person needs to accomplish>

业务价值：
- <why this matters to the business or customer>

关键流程：
- <user-visible flow 1>
- <user-visible flow 2>
- <user-visible flow 3>

成功标志：
- <observable result that proves success>
- <business or user outcome that closes the loop>

### Story US-2: <short title>

角色：
- 

目标：
- 

业务价值：
- 

关键流程：
- 
- 

成功标志：
- 
- 

## Release Coverage

<!--
Release scope must be derived from the story IDs and flows above.
Do not invent release-critical flows later without updating this proposal first.
-->

### Private Cloud Verification

覆盖故事：
- `US-1`

覆盖流程：
- `US-1 / <critical flow 1>`
- `US-1 / <critical flow 2>`

不通过条件：
- <required flow cannot be completed>
- <observed result does not meet the story success criteria>

### Customer Environment Verification

覆盖故事：
- `US-1`

覆盖流程：
- `US-1 / <critical flow 1>`

不通过条件：
- <required flow cannot be completed in the customer environment>
- <customer-environment behavior contradicts the expected outcome>

## Release Evidence Plan

<!--
Only two evidence types are accepted:
- successful AI-run validation when the environment is reachable
- explicit human text confirmation when the environment is not reachable
Every record should identify environment, method, result, covered stories,
covered flows, evidence summary, and recorder identity.
-->

### Private Cloud Verification

Accepted Evidence:
- `AI-run validation passed`
- `Human text confirmation passed`

Recording Rules:
- `Environment`: private-cloud
- `Method`: AI-run validation or human confirmation
- `Result`: passed / failed
- `Covered Stories`: story IDs validated in this run
- `Covered Flows`: named flows validated in this run
- `Evidence Summary`: short proof summary
- `Recorder`: who recorded the outcome

### Customer Environment Verification

Accepted Evidence:
- `AI-run validation passed`
- `Human text confirmation passed`

Recording Rules:
- `Environment`: customer-environment
- `Method`: AI-run validation or human confirmation
- `Result`: passed / failed
- `Covered Stories`: story IDs validated in this run
- `Covered Flows`: named flows validated in this run
- `Evidence Summary`: short proof summary
- `Recorder`: who recorded the outcome

## Capabilities

### New Capabilities
<!-- Capabilities being introduced. Replace <name> with kebab-case identifier (e.g., user-auth, data-export, api-rate-limiting). Each creates specs/<name>/spec.md -->
- `<name>`: <brief description of what this capability covers>

### Modified Capabilities
<!-- Existing capabilities whose REQUIREMENTS are changing (not just implementation).
     Only list here if spec-level behavior changes. Each needs a delta spec file.
     Use existing spec names from openspec/specs/. Leave empty if no requirement changes. -->
- `<existing-name>`: <what requirement is changing>

## Impact

<!-- Affected code, APIs, dependencies, systems -->

## Out of Scope

<!--
List important work that is intentionally excluded from this change.
This protects the proposal from scope drift later.
-->
