## Why

This fork is not just documenting a preferred way of working. It is doing second-stage development on DuowenSpec to ship a reusable enterprise workflow that combines DuowenSpec and superpowers without letting them compete for control.

Right now the idea exists as a diagram and discussion, but the product does not yet define:

- the canonical order of steps
- which system owns workflow state and completion
- which superpowers steps are optional versus mandatory
- how release fits into the lifecycle across internal and customer environments
- what the enterprise proposal must capture before implementation starts
- how the team should loop back when validation or review fails
- how this fork keeps enterprise behavior as its default without reintroducing the lighter official behavior
- how setup verifies that the bundled enterprise skills referenced by the selected workflow are available to install
- how other projects should adopt the workflow from this fork
- how required checkpoints and approved exceptions should be recorded

Without that definition, different contributors and downstream projects can interpret the same flow differently. The result is process drift, unclear handoffs, inconsistent release discipline, and a workflow that cannot be safely reused.

## What Changes

### 1. Formalize the hybrid workflow as a project convention

Define the canonical flow as:

`duowenspec init`
→ `/opsx:explore` + `superpowers:brainstorming` (recommended when input is incomplete)
→ `/opsx:propose`  
→ `duowenspec validate`  
→ `/opsx:apply` + `superpowers:executing-plans` (required, with `test-driven-development` or `subagent-driven-development` as allowed implementation companions)  
→ `superpowers:requesting-code-review`
→ `superpowers:receiving-code-review`
→ `/opsx:verify` + `superpowers:verification-before-completion`
→ `enterprise documentation checkpoint`  
→ `release:private-cloud-verified`
→ `release:customer-verified`
→ `/opsx:archive`

### 2. Establish ownership boundaries

Document that DuowenSpec remains the source of truth for:

- workflow stages
- change artifacts
- validation gates
- implementation completion and archive readiness

Document that superpowers is used only as stage-local augmentation, but in this enterprise workflow:

- `superpowers:brainstorming` is recommended when the exploration input is insufficient
- `superpowers:executing-plans` is the default required implementation augmentation, with `test-driven-development` or `subagent-driven-development` allowed as implementation-stage companions
- `superpowers:requesting-code-review` and `superpowers:receiving-code-review` are required before verification can complete
- `superpowers:verification-before-completion` is required during the verification gate
- documentation remains a required enterprise checkpoint, but this workflow SHALL NOT pretend that `superpowers` provides a standard `document` skill when it does not

### 3. Add a staged release gate before archive

Document that successful release is a hard prerequisite for:

- internal/private-cloud deployment verification
- customer-environment deployment verification
- archiving the change as completed work

Document that enterprise archive absorbs main-spec finalization, so teams do not need a separate sync step in the normal happy path.

### 4. Define loop-back and failure behavior

Capture what happens when:

- proposal or spec validation fails
- review finds implementation problems
- verification reveals scope or design drift
- documentation is incomplete
- private-cloud release verification fails
- customer-environment release verification fails after private-cloud success

### 5. Ship this as a reusable enterprise workflow in the DuowenSpec fork

The implementation SHOULD live in the current DuowenSpec codebase so other projects can adopt it after this fork is published.

The workflow should not remain repository-only guidance. It should become a reusable workflow offering in this DuowenSpec fork, bootstrapped through the `duowenspec` binary so downstream projects can run `duowenspec init` and receive the required prompts, skills, and usage guidance.

Document that this fork MUST treat the enterprise workflow as its default generated behavior, rather than trying to preserve the lighter official DuowenSpec behavior inside the same published product.

Document that contributors who want the lighter original experience should use the official DuowenSpec distribution, while this fork focuses on enterprise-first defaults and enterprise-specific setup behavior.

Document that selecting the enterprise workflow requires setup-time preflight checks, and that setup MUST block enterprise activation if this published fork does not contain the bundled enterprise skills referenced by the selected workflow.

Document how `duowenspec init`, `duowenspec config`, and `duowenspec update` each reflect the enterprise-first default of this fork, so setup, reconfiguration, and regeneration do not drift back toward upstream behavior.

Document one concrete implementation checklist for the first delivery slice of this work:

- update global config defaults so this fork boots into enterprise-first workflow generation
- update `duowenspec init` so enterprise-first workflow artifacts are generated by default
- add packaged-skill preflight to `duowenspec init` before enterprise workflow artifacts are written
- update `duowenspec init` success messaging so the next-step guidance matches the enterprise workflow
- update `duowenspec config` so workflow and delivery management remain available without presenting the lighter upstream mode as a sibling option
- update `duowenspec update` so regenerated artifacts preserve enterprise-first behavior
- validate that init, config changes, and update all regenerate the same enterprise-oriented workflow assets

### 6. Strengthen the enterprise propose artifact

Document that the enterprise version of `proposal.md` keeps the default DuowenSpec structure but adds delivery-critical sections:

- `Core User Stories`
- `Release Coverage`
- `Release Evidence Plan`
- `Out of Scope`

Document that `Core User Stories` use a fixed lightweight structure with story ID, role, goal, business value, critical operation flows, and success criteria.

Document that `Release Coverage` MUST be derived from `Core User Stories`, so release validation scope is defined during propose rather than invented at the end.

Document that `Release Coverage` uses a fixed enterprise structure with separate private-cloud and customer-environment sections, each naming covered story IDs, covered flows, and release-blocking failure conditions.

Document that `Release Evidence Plan` uses a fixed enterprise structure with separate private-cloud and customer-environment sections, each defining accepted evidence, required record fields, and the rule that AI-run validation is preferred when the environment is reachable while explicit human text confirmation is required when it is not.

Document one complete enterprise `proposal.md` template that combines the preserved DuowenSpec base sections with the fixed `Core User Stories`, `Release Coverage`, `Release Evidence Plan`, and `Out of Scope` sections.

Document fixed record shapes for required `review` and `document` checkpoints so those gates do not rely on implicit chat history.

Document that when `duowenspec validate` fails on an existing change, the default repair path is to edit the existing planning artifacts and re-run validation, not to assume `/opsx:propose` can regenerate or overwrite those artifacts.

## Capabilities

### New Capabilities

- `superpowers-composed-workflow`: defines the enterprise workflow that combines DuowenSpec stages, required superpowers checkpoints, and release-gated completion

### Modified Capabilities

- `docs-agent-instructions`: agent guidance teaches the enterprise flow, ownership boundaries, required checkpoints, and loop-back rules
- `enterprise-proposal-template`: proposal guidance teaches how user stories, release coverage, and release evidence planning fit together
- `cli-init`: downstream projects need a reusable way to adopt the workflow from this fork
- `cli-config`: downstream projects need a reusable way to keep the workflow selected after setup
- `enterprise-capability-preflight`: enterprise setup must confirm bundled enterprise skills for the selected workflow before activation
- `enterprise-default-packaging`: this fork must package enterprise behavior as the default published experience
- `global-config-defaults`: this fork must store enterprise-first defaults in its generated configuration path
- `cli-update`: regeneration must preserve enterprise-first behavior after setup and later config changes
- `cli-archive`: enterprise archive needs to include main-spec finalization after successful staged release

## Impact

- New enterprise workflow guidance describing the full flow, including private-cloud and customer-environment release verification before archive
- Enterprise proposal guidance describing how named user stories define release validation scope
- Agent-facing instructions updated so contributors do not treat superpowers as a second workflow engine
- Reusable workflow assets added to this DuowenSpec fork so downstream projects can adopt them via `duowenspec init`
- Follow-up implementation likely touches workflow selection, generated prompts/skills, archive behavior, release/documentation gating, and exception recording
- Verification should include artifact validation, a representative walkthrough, and downstream reuse from this fork
