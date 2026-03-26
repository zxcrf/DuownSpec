## Context

The desired workflow is not "replace DuowenSpec with superpowers." It is a reusable enterprise model built on top of DuowenSpec:

- DuowenSpec owns the workflow spine
- superpowers strengthens specific stages
- staged release success gates final completion

This distinction matters because DuowenSpec already has clear concepts for change state, artifacts, validation, sync, and archive. superpowers is valuable, but if it is allowed to behave like a second workflow owner, the team loses a single source of truth. If release is not modeled explicitly, the workflow also risks marking work as complete before it is actually shipped to real target environments.

## Goals / Non-Goals

**Goals**

- Define one authoritative enterprise workflow for this fork
- Make stage ownership explicit
- Identify where superpowers adds value without replacing DuowenSpec
- Distinguish recommended versus required superpowers checkpoints
- Add staged release gates before archive
- Make the workflow reusable by other projects that adopt this fork
- Publish the result as part of this DuowenSpec derivative

**Non-Goals**

- Replacing DuowenSpec's artifact model with an external workflow engine
- Treating `superpowers:brainstorming` as a mandatory step for every change
- Hiding release status inside an implicit "done" state
- Bundling or vendoring the whole superpowers skillset into DuowenSpec if lighter integration is sufficient

## Decisions

### 1. This is a productized workflow extension, not repository-only guidance

The target is a reusable workflow shipped from the current DuowenSpec codebase and consumable by other projects after publication.

That means the end state should be more than a README convention. It should be selectable and repeatable through the `duowenspec` binary.

Expected adoption flow:

- downstream project runs `duowenspec init`
- init installs the enterprise workflow prompts/skills for supported tools
- developers follow the generated workflow steps in their AI tool (`/opsx:explore`, `/opsx:propose`, and so on)
- project-specific exceptions can be declared in project-level `AGENTS.md`

Likely implementation levels to combine:

- built-in workflow/profile in this fork
- bundled schema/templates in this fork
- supporting guidance and generated instructions tied to that workflow

### 1.5 This fork should ship enterprise behavior as its default

The current DuowenSpec product already exists for users who want the lighter original behavior.

This fork is a second-stage product focused on enterprise workflow discipline, so it does not need to keep the lighter original behavior as a first-class mode inside the same published package.

Required design rule:

- this fork should generate enterprise workflow instructions by default
- the fork should not depend on a second in-product mode just to preserve the lighter upstream behavior
- teams that want the lighter original workflow should use the official DuowenSpec distribution instead of this fork

This removes the biggest product ambiguity: this fork no longer needs to act like one binary serving two conflicting defaults.

Recommended implementation direction:

- keep the existing workflow list responsible for "which workflows are installed"
- make the generated template family enterprise-first in this fork
- use setup/config choices only for enterprise-specific details, not for switching back to the lighter upstream mode

### 1.6 Compatibility should be handled at product boundary, not in-fork mode switching

The cleanest split is:

- official DuowenSpec distribution: lighter original workflow
- this fork: enterprise-first workflow

That means the fork does not need to solve "default versus enterprise" as an ongoing runtime toggle for normal users.

It only needs to ensure:

- the published fork consistently generates enterprise-oriented workflow assets
- setup and updates keep that enterprise behavior stable
- documentation clearly points lighter-workflow users to the upstream product

This is simpler than introducing a new permanent mode-selection axis only to preserve behavior that the upstream project already provides.

### 1.7 `init`, `config`, and `update` must all reinforce the enterprise-first default

This fork already has three practical entry points that shape user experience:

- `duowenspec init`
- `duowenspec config`
- `duowenspec update`

If this fork is enterprise-first, all three need aligned behavior. Otherwise day-to-day usage will drift back toward upstream assumptions even if the high-level workflow definition is correct.

Recommended division of responsibility:

- `duowenspec init` establishes the enterprise-first starting state
- `duowenspec config` manages workflow and delivery choices without reintroducing the lighter upstream flow as a normal sibling mode
- `duowenspec update` regenerates workflow artifacts in a way that preserves the enterprise-first behavior of this fork

### 1.8 Concrete first implementation slice

The first implementation slice should stay narrow and target the entry points that already shape generated workflow behavior today.

Recommended concrete change list:

- `src/core/global-config.ts`
  - set enterprise-first defaults for this fork's published config behavior
- `src/core/config-schema.ts`
  - align schema defaults with the enterprise-first defaults used by this fork
- `src/core/init.ts`
  - default setup to enterprise-first workflow generation
  - run capability preflight before writing workflow artifacts
  - update success output so the recommended next step matches the enterprise workflow
- `src/commands/config.ts`
  - keep workflow and delivery configuration
  - remove or rewrite help text and presets that imply the lighter upstream workflow is a normal in-fork sibling mode
- `src/core/update.ts`
  - preserve enterprise-first regeneration on update
  - surface capability-preflight failures clearly when regeneration would otherwise create unusable enterprise artifacts

This is the smallest useful slice because it changes the fork's actual product posture at the points where users install, reconfigure, and regenerate workflow assets.

### 2. DuowenSpec owns stage progression

DuowenSpec commands define the official change lifecycle:

- setup: `duowenspec init`
- exploration: `/opsx:explore`
- plan creation: `/opsx:propose`
- plan validation: `duowenspec validate`
- implementation: `/opsx:apply`
- implementation verification: `/opsx:verify`
- archive: `/opsx:archive`

superpowers is explicitly treated as an augmentation layer inside or around those stages, not as a competing lifecycle.

### 3. Stage mapping for the enterprise workflow

```text
duowenspec init
  -> /opsx:explore
       + superpowers:brainstorming (recommended only when input is incomplete)
  -> /opsx:propose
  -> duowenspec validate
  -> /opsx:apply
       + superpowers:executing-plans (required)
       + superpowers:test-driven-development or superpowers:subagent-driven-development (allowed implementation-stage companions)
  -> superpowers:requesting-code-review
  -> superpowers:receiving-code-review
  -> /opsx:verify
       + superpowers:verification-before-completion
  -> enterprise documentation checkpoint
  -> release:private-cloud-verified
  -> release:customer-verified
  -> /opsx:archive
```

Interpretation:

- `brainstorming` stays inside exploration. It helps when inputs are weak or incomplete, but does not replace DuowenSpec planning artifacts.
- `executing-plans` stays inside apply. It is the default required implementation augmentation in this enterprise workflow, but does not decide task completion by itself.
- `test-driven-development` and `subagent-driven-development` may also be used during apply when they fit the implementation task.
- `requesting-code-review` and `receiving-code-review` form the required review checkpoint after implementation work and before final verification.
- `verification-before-completion` strengthens the verification gate before release.
- the documentation step remains required after verification and before release, but is treated as an enterprise workflow checkpoint rather than a fabricated standard `superpowers` skill name.
- release now has two required gates:
  - private-cloud deployment verified
  - customer-environment deployment verified
- archive represents released-and-finalized completion, not just implementation completion.

### 4. Required versus recommended superpowers steps

Requirement levels:

- `superpowers:brainstorming`: recommended only when the problem statement or available context is insufficient
- `superpowers:executing-plans`: required as the default implementation augmentation
- `superpowers:test-driven-development`: optional implementation-stage companion when the task benefits from it
- `superpowers:subagent-driven-development`: optional implementation-stage companion when the task benefits from it
- `superpowers:requesting-code-review`: required
- `superpowers:receiving-code-review`: required
- `superpowers:verification-before-completion`: required
- enterprise documentation checkpoint: required, but not named as a standard `superpowers` skill

This preserves proportionality during exploration while keeping implementation, review, and delivery discipline strict.

### 4.5 Enterprise setup must package and install workflow-referenced bundled skills

The enterprise workflow treats `superpowers:executing-plans`, `superpowers:requesting-code-review`, `superpowers:receiving-code-review`, and `superpowers:verification-before-completion` as required capability checkpoints rather than optional assistance. It also references `superpowers:brainstorming`, `superpowers:test-driven-development`, and `superpowers:subagent-driven-development` as allowed stage-local companions. Documentation remains required, but should be modeled as an enterprise checkpoint instead of being mislabeled as a standard `superpowers` skill.

This fork should not depend on contributors pre-installing any of those referenced skills separately. Instead, the published `opsx` package should carry the bundled skill templates itself and copy them into downstream projects during setup.

Required setup rule:

- when a project selects the enterprise workflow, `duowenspec init` or the equivalent workflow-selection path must perform a packaged-skill preflight check
- the preflight must verify that all bundled enterprise skill templates referenced by the selected workflow are present in this fork
- setup must copy those bundled enterprise skills into the selected tool's project-local skills directory together with the normal workflow assets
- if the package is missing any bundled enterprise skill referenced by the selected workflow, enterprise activation must be blocked rather than deferred until use time

This avoids the bad failure mode where a project appears successfully initialized but cannot actually complete the required enterprise steps.

Recommended setup behavior:

- `duowenspec init` in this fork should assume enterprise workflow setup by default
- setup may still ask enterprise-specific questions, but should not default back to the lighter upstream mode
- if packaged-skill preflight fails, setup should stop before generating enterprise workflow artifacts

More concrete `init` expectations:

- the default generated workflow set should match the enterprise workflow this fork publishes
- setup output should describe enterprise-oriented next steps
- packaged-skill preflight should run before workflow artifacts are generated so setup cannot partially succeed in an unusable state

Suggested `init` checklist:

- resolve enterprise-first defaults before workflow templates are chosen
- check bundled enterprise skills referenced by the selected workflow before generation starts
- stop setup if any referenced bundled skills are missing from the package
- generate the same public workflow names, but with enterprise-oriented instructions
- copy the bundled enterprise skills into the selected tool directory
- show enterprise-oriented next steps in the final success output

### 5. Enterprise propose must define release scope early

The default DuowenSpec proposal skeleton is a good base, but the enterprise workflow needs more delivery-oriented planning before implementation starts.

The enterprise proposal should keep the existing structure:

- `Why`
- `What Changes`
- `Capabilities`
- `Impact`

And extend it with:

- `Core User Stories`
- `Release Coverage`
- `Release Evidence Plan`
- `Out of Scope`

The key rule is traceability:

- `Core User Stories` define the most important user-facing outcomes
- each story identifies the critical operation flows
- `Release Coverage` is derived from those stories and flows
- release validation is not allowed to invent unrelated scope at the end of the change

This keeps enterprise validation grounded in what the change originally promised to deliver.

Recommended enterprise story template:

```md
### Story US-1: <short title>

角色：
- <who is using this capability>

目标：
- <what they need to accomplish>

业务价值：
- <why this matters>

关键流程：
- <flow 1>
- <flow 2>
- <flow 3>

成功标志：
- <what result proves success>
- <what business/user-visible outcome closes the loop>
```

Recommended writing rules:

- keep the story list short: usually `2-5` stories
- one story should describe one complete user goal
- `关键流程` must be user-visible flows, not implementation steps
- each story should usually list `2-5` critical flows
- every story must include success criteria
- `Release Coverage` should reference story IDs directly

This is intentionally stricter than a casual user-story sentence, because enterprise release validation needs stories that can be traced directly into environment verification.

Recommended `Release Coverage` template:

```md
## Release Coverage

### Private Cloud Verification

覆盖故事：
- `US-1`
- `US-2`

覆盖流程：
- `US-1 / <critical flow 1>`
- `US-1 / <critical flow 2>`
- `US-2 / <critical flow 1>`

不通过条件：
- <a required flow cannot be completed>
- <the observed result does not meet the story's success criteria>

### Customer Environment Verification

覆盖故事：
- `US-1`

覆盖流程：
- `US-1 / <critical flow 1>`
- `US-1 / <critical flow 2>`

不通过条件：
- <a required flow cannot be completed in the customer environment>
- <customer-environment behavior contradicts the story's expected outcome>
```

Recommended `Release Coverage` rules:

- both environment sections are required in the enterprise proposal
- each environment section must list the story IDs it covers
- each covered flow must use the `Story ID / Flow` format
- covered flows must come from the proposal's `Core User Stories`
- coverage should stay focused on release-critical paths rather than every possible regression case
- `不通过条件` should describe release-blocking outcomes, not generic implementation details
- customer-environment coverage may be a strict subset of private-cloud coverage, but never a disconnected list

This keeps release planning compact while still making the final environment checks auditable and traceable back to the original proposal.

Recommended `Release Evidence Plan` template:

```md
## Release Evidence Plan

### Private Cloud Verification

优先证据：
- `AI 实测通过`

兜底证据：
- `人类文字确认通过`

记录要求：
- `验证环境`：私有云
- `验证方式`：AI 实测 / 人类确认
- `验证结果`：通过 / 不通过
- `覆盖故事`：`US-...`
- `覆盖流程`：`US-... / <critical flow>`
- `证据摘要`：实际验证了什么，看到什么结果
- `记录人`：AI / 具体人员

适用规则：
- 能直接访问目标环境时，优先使用 `AI 实测通过`
- 不能直接访问目标环境时，必须使用 `人类文字确认通过`

### Customer Environment Verification

优先证据：
- `AI 实测通过`

兜底证据：
- `人类文字确认通过`

记录要求：
- `验证环境`：客户环境
- `验证方式`：AI 实测 / 人类确认
- `验证结果`：通过 / 不通过
- `覆盖故事`：`US-...`
- `覆盖流程`：`US-... / <critical flow>`
- `证据摘要`：实际验证了什么，看到什么结果
- `记录人`：AI / 具体人员

适用规则：
- 能直接访问目标环境时，优先使用 `AI 实测通过`
- 不能直接访问目标环境时，必须使用 `人类文字确认通过`
```

Recommended `Release Evidence Plan` rules:

- both environment sections are required in the enterprise proposal
- accepted evidence is limited to `AI 实测通过` or `人类文字确认通过`
- `AI 实测通过` means the agent or its tools actually exercised the release-critical flows
- `人类文字确认通过` must be explicit text in the conversation rather than an implied approval
- every recorded result must identify the environment, method, outcome, covered stories, and covered flows
- the evidence summary should describe observed outcomes, not just that someone said "done"
- if evidence is missing or ambiguous, the release gate is not considered complete

This keeps release gating simple: test directly when the agent can, require explicit human confirmation when it cannot, and always retain a readable record.

Recommended complete enterprise `proposal.md` template:

```md
## Why

<!--
说明为什么现在要做这件事。
回答：
1. 当前遇到了什么问题、机会或交付压力
2. 为什么这个变化现在必须处理
3. 如果不做，会带来什么影响
-->

## What Changes

<!--
概括这次要改什么。
只写变化本身，不展开实现细节。
-->

- 
- 
- 

## Core User Stories

<!--
只写这次最关键的用户故事。
建议 2-5 条，每条都能直接支撑后面的发布验证。
-->

### Story US-1: <简短标题>

角色：
- 

目标：
- 

业务价值：
- 

关键流程：
- 
- 
- 

成功标志：
- 
- 

### Story US-2: <简短标题>

角色：
- 

目标：
- 

业务价值：
- 

关键流程：
- 
- 
- 

成功标志：
- 
- 

## Release Coverage

<!--
发布验证范围必须来自上面的 Core User Stories。
不要在发布阶段临时新增一套独立范围。
-->

### Private Cloud Verification

覆盖故事：
- `US-1`
- `US-2`

覆盖流程：
- `US-1 / <critical flow 1>`
- `US-1 / <critical flow 2>`
- `US-2 / <critical flow 1>`

不通过条件：
- 
- 

### Customer Environment Verification

覆盖故事：
- `US-1`

覆盖流程：
- `US-1 / <critical flow 1>`
- `US-1 / <critical flow 2>`

不通过条件：
- 
- 

## Release Evidence Plan

<!--
这里定义什么证据算发布验证通过，以及记录最少要写什么。
-->

### Private Cloud Verification

优先证据：
- `AI 实测通过`

兜底证据：
- `人类文字确认通过`

记录要求：
- `验证环境`：私有云
- `验证方式`：AI 实测 / 人类确认
- `验证结果`：通过 / 不通过
- `覆盖故事`：`US-...`
- `覆盖流程`：`US-... / <critical flow>`
- `证据摘要`：实际验证了什么，看到什么结果
- `记录人`：AI / 具体人员

适用规则：
- 能直接访问目标环境时，优先使用 `AI 实测通过`
- 不能直接访问目标环境时，必须使用 `人类文字确认通过`

### Customer Environment Verification

优先证据：
- `AI 实测通过`

兜底证据：
- `人类文字确认通过`

记录要求：
- `验证环境`：客户环境
- `验证方式`：AI 实测 / 人类确认
- `验证结果`：通过 / 不通过
- `覆盖故事`：`US-...`
- `覆盖流程`：`US-... / <critical flow>`
- `证据摘要`：实际验证了什么，看到什么结果
- `记录人`：AI / 具体人员

适用规则：
- 能直接访问目标环境时，优先使用 `AI 实测通过`
- 不能直接访问目标环境时，必须使用 `人类文字确认通过`

## Capabilities

### New Capabilities

- `<name>`: <brief description>

### Modified Capabilities

- `<existing-name>`: <what requirement is changing>

## Impact

<!--
写清楚影响范围，例如：
- 哪些模块会被影响
- 哪些接口或行为会变化
- 哪些角色、环境或交付环节会受影响
-->

- 
- 
- 

## Out of Scope

<!--
明确这次不做什么，避免范围失控。
-->

- 
- 
- 
```

This template keeps the current DuowenSpec proposal backbone intact while making enterprise release scope and evidence explicit early enough to govern review, verification, and release.

### 6. Release gates archive and absorbs sync

The enterprise workflow needs a clear boundary between "built" and "released."

Rules:

- documentation must be complete before release is attempted
- private-cloud deployment verification must succeed before customer-environment verification
- customer-environment verification is the point at which work becomes fully released
- enterprise archive occurs only after both release gates pass
- enterprise archive includes main-spec finalization so the normal happy path does not require a separate `/opsx:sync`

### 7. Loop-back rules must be explicit

The enterprise flow needs simple return paths:

- `duowenspec validate` fails on an existing change: repair the current proposal/design/tasks/spec files directly, then run `duowenspec validate` again; return to `/opsx:explore` only if the validation issue reveals missing context or a wrong plan
- `superpowers:requesting-code-review`, `superpowers:receiving-code-review`, or `/opsx:verify` finds an implementation issue: go back to `/opsx:apply`
- `superpowers:requesting-code-review`, `superpowers:receiving-code-review`, or `/opsx:verify` reveals scope or design drift: go back to `/opsx:explore` or `/opsx:propose`
- the enterprise documentation checkpoint is incomplete or inconsistent: go back to documentation and, if needed, implementation or verification
- private-cloud verification fails for implementation reasons: go back to `/opsx:apply`
- customer-environment verification fails for environment-fit or rollout reasons: go back to `/opsx:propose` or `/opsx:explore`, and to implementation if necessary

This prevents the workflow from becoming a one-way pipeline with no shared rule for correction.

Important clarification:

- the current `/opsx:propose` flow should not be treated as an existing artifact-regeneration tool
- this enterprise workflow therefore assumes direct repair of existing planning artifacts as the default validation-recovery path
- if a later DuowenSpec change adds safe regeneration for existing artifacts, this workflow may adopt it, but it should not depend on that future capability today

### 8. Required checkpoints should leave records

This workflow is strict enough that required gates should not exist only in chat history.

At minimum, the implementation should track records for:

- review outcome
- documentation completion
- release progression across private-cloud and customer environments

This can be implemented with explicit workflow artifacts, structured metadata, or another auditable mechanism.

Recommended `review` record template:

```md
## Review Record

### Scope

- `change`: <change name>
- `review target`: <what was reviewed>

### Outcome

- `result`: pass / fail
- `summary`: <short conclusion>

### Findings

- <finding 1>
- <finding 2>

### Required Follow-up

- <required fix or empty if none>
- <required re-check or empty if none>

### Recorder

- `reviewer`: AI / specific person
```

Recommended `review` record rules:

- a review record is required before the workflow can complete verification
- `result` must be explicit rather than implied from surrounding discussion
- `Findings` may be empty only when the result is pass and that absence is explicit
- `Required Follow-up` must identify what blocks progress when the result is fail
- the record should stay short and decision-oriented rather than becoming a full implementation log

Recommended documentation-completion record template:

```md
## Documentation Completion Record

### Scope

- `change`: <change name>
- `document set`: <what was updated>

### Outcome

- `result`: complete / incomplete
- `summary`: <short conclusion>

### Covered Deliverables

- <deliverable 1>
- <deliverable 2>

### Consistency Check

- <how the documents match the verified result>

### Required Follow-up

- <missing item or empty if none>

### Recorder

- `owner`: AI / specific person
```

Recommended documentation-completion record rules:

- documentation completion must be recorded before private-cloud verification can begin
- the record must name which documents or deliverables were completed
- the consistency check must state how the final documents match the verified result
- `result: incomplete` blocks release until the missing work is resolved
- the record should focus on delivery readiness, not duplicate the full document contents

This keeps review and documentation gates readable and auditable without adding a large amount of ceremony.

### 8.5 Enterprise template generation should reuse workflow IDs

The enterprise flow does not need a second public command namespace such as `/opsx-enterprise-apply`.

That would make downstream adoption heavier and fragment the user-facing command surface.

Recommended rule:

- keep the public workflow IDs and command names unchanged
- generate enterprise-oriented instructions for those same workflow IDs by default in this fork

This gives enterprise projects stricter behavior without forcing users to learn a second command vocabulary.

### 8.6 `config` should stay enterprise-first

Because this fork is enterprise-first, `duowenspec config` should not behave like a place where users routinely switch back to the lighter upstream workflow.

Recommended `config` behavior:

- workflow configuration should continue to answer which workflows are enabled
- delivery configuration should continue to answer how artifacts are installed
- help text and presets in this fork should describe enterprise-first usage rather than advertising the lighter upstream flow as a sibling choice

Suggested `config` checklist:

- keep the current workflow-selection surface where it still serves enterprise projects
- remove preset language that points users back to the lighter upstream path inside this fork
- make config output describe the current enterprise-first posture clearly

### 8.7 `update` should preserve enterprise-first regeneration

`duowenspec update` is the command that turns stored configuration back into generated workflow artifacts.

If it regenerates from upstream-style assumptions, this fork will drift away from its enterprise intent even when `init` was correct.

Recommended `update` behavior:

- updates should regenerate the enterprise-oriented instruction set by default in this fork
- update output should stay consistent with enterprise-first setup messaging
- if capability requirements are no longer satisfied, update should surface that clearly instead of silently producing incomplete enterprise artifacts

Suggested `update` checklist:

- regenerate enterprise-oriented workflow assets from stored configuration
- keep enterprise-first messaging in update summaries
- fail loudly or block when required enterprise capabilities are missing
- verify that regenerated artifacts still match the same enterprise workflow order and required checkpoints

### 9. Project-level exceptions belong in AGENTS.md

Some projects may have justified exceptions or step-skips.

Those should not silently weaken the enterprise workflow globally. Instead:

- the published workflow defines the default strict path
- project-level `AGENTS.md` can document justified exceptions
- exceptions should be explicit, local, and reviewable
- `AGENTS.md` should not be used to bypass missing packaged enterprise skills; missing packaged skills indicate a defect in this fork and should block setup

Examples worth handling:

- a project that does not deploy to a separate private-cloud stage
- an internal-only deployment with no customer environment
- regulated environments that require extra approval before release
- teams temporarily unable to run one required capability and needing an approved alternative

### 10. Reuse should happen at the product level

Because this fork intends to publish the enterprise workflow, downstream adoption should not require manual copy-paste of repo-specific files.

That implies at least one reusable mechanism inside this fork, such as:

- a built-in workflow/profile option
- a bundled schema and templates selectable during setup
- generated instructions that are tied to the enterprise workflow choice

## Risks / Trade-offs

**Risk: stricter workflow increases ceremony**
Required code/review/document/release gates will slow simple changes down.
Mitigation: position this explicitly as the enterprise workflow, not the only workflow.

**Risk: packaged enterprise skills drift or go missing**
If required bundled enterprise skills are not shipped or copied consistently, the enterprise workflow cannot run as intended.
Mitigation: keep the bundled skill set small, check it before setup writes files, and verify that both `init` and `update` regenerate the required bundled skills consistently.

**Risk: release modeling can become vague**
If "release" is not defined precisely enough, teams may mark it complete inconsistently.
Mitigation: define what evidence counts as private-cloud verification and customer-environment verification in this workflow.

**Risk: sync/archive semantics may conflict with current DuowenSpec expectations**
Core DuowenSpec already has specific behavior around sync and archive.
Mitigation: make the enterprise ordering explicit and adapt archive behavior/guidance accordingly.

## Further Exploration

### 1. What evidence proves each release phase?

Release is now split into two hard phases, so each phase needs auditable evidence. We should define whether proof means:

- deployment success only
- deployment plus smoke-test success
- deployment plus stakeholder signoff
- environment-specific acceptance checklist completion

### 2. What is the right reusable packaging shape?

We know this should ship from the fork, but we still need to choose the mechanism:

- built-in enterprise profile
- bundled enterprise schema
- both, with profile selecting the schema

### 3. Which checkpoints need first-class artifacts?

The stricter the workflow becomes, the more useful explicit artifacts may become.
We should explore whether the enterprise workflow needs:

- `review.md`
- `document.md` or equivalent deliverable tracking
- `release.md`
- explicit documentation deliverable tracking

### 4. How strict should the enterprise proposal format be?

We now know the enterprise proposal needs user stories, release coverage, evidence planning, and out-of-scope boundaries.
We still need to decide how hard to enforce the writing format:

- required section headings only
- section headings plus minimal story structure
- stronger validation that release coverage references named stories

The current preferred direction is:

- fixed section headings
- fixed story fields
- release coverage referencing named story IDs

### 5. How should required capability checks surface to users?

If `code`, `review`, and `document` are mandatory in this workflow, we need to decide whether setup should:

- block selection when required capabilities are unavailable
- allow selection but show hard warnings
- generate fallback guidance with incomplete-status markers

Likely missing-capability cases include:

- the target AI tool cannot invoke one of the required prompts/skills
- the enterprise workflow was selected but required prompts/skills were not installed
- a team intentionally wants an approved alternative path for a specific project

### 6. How explicit should project exceptions be?

We know exceptions should live in project-level `AGENTS.md`, but we still need to decide:

- whether exceptions use free-form prose or a standard template
- whether archive should require citing the active exception
- whether downstream init should generate an exception section scaffold automatically

## Rollout Plan

1. Capture the enterprise workflow in change artifacts and repository guidance
2. Choose the reusable packaging mechanism inside this fork and wire it into `duowenspec init`
3. Teach agents and downstream projects the ownership boundary, required gates, release phases, and exception model
4. Trial the workflow on a representative change and a downstream-adoption scenario
5. Publish the fork with the enterprise workflow once the flow is stable
