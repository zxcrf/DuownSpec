## ADDED Requirements

### Requirement: DuowenSpec owns the primary workflow
The enterprise workflow SHALL use DuowenSpec as the authoritative owner of change stages, artifacts, validation, sync, and archive readiness.

#### Scenario: Stage progression in the hybrid flow
- **WHEN** a contributor uses the composed workflow
- **THEN** stage transitions SHALL be expressed through DuowenSpec commands and artifacts
- **AND** superpowers capability invocations SHALL NOT replace DuowenSpec change state or completion rules

#### Scenario: External capability use inside a stage
- **WHEN** a contributor invokes a superpowers capability during exploration, implementation, review, or documentation
- **THEN** that capability SHALL be treated as stage-local augmentation
- **AND** the contributor SHALL return to the DuowenSpec workflow as the source of truth for next-step decisions

#### Scenario: This fork defaults to enterprise workflow behavior
- **WHEN** workflow artifacts are generated from this fork
- **THEN** the generated stage rules and checkpoints SHALL follow the enterprise workflow by default
- **AND** contributors who want the lighter original behavior SHALL be directed to the official DuowenSpec distribution rather than a lighter mode in this fork

#### Scenario: Enterprise mode reuses the same public workflow IDs
- **WHEN** enterprise workflow artifacts are generated
- **THEN** they SHALL reuse the same public workflow IDs and command names as the upstream workflow where applicable
- **AND** this fork SHALL provide enterprise-oriented instructions for those commands without introducing a second public command namespace

#### Scenario: Config preserves enterprise-first product posture
- **WHEN** a contributor uses `duowenspec config` in this fork
- **THEN** workflow and delivery configuration SHALL remain available
- **AND** the command SHALL NOT present the lighter upstream workflow as a normal sibling mode inside this fork

#### Scenario: Update preserves enterprise-first regeneration
- **WHEN** a contributor runs `duowenspec update` in a project using this fork
- **THEN** regenerated workflow artifacts SHALL preserve the enterprise-first behavior defined by this fork
- **AND** update feedback SHALL remain consistent with enterprise-oriented setup and capability requirements

### Requirement: The workflow defines fixed augmentation points and requirement levels
The enterprise workflow SHALL define where superpowers capabilities may be used within the DuowenSpec lifecycle and whether each capability is recommended or required.

#### Scenario: Brainstorming during exploration
- **WHEN** a contributor is in `/opsx:explore`
- **AND** the available problem statement, context, or constraints are incomplete
- **THEN** `superpowers:brainstorming` MAY be used to widen options or compare approaches
- **AND** any accepted outcome SHALL be captured through DuowenSpec planning artifacts

#### Scenario: Default implementation augmentation during apply
- **WHEN** a contributor is in `/opsx:apply`
- **THEN** `superpowers:executing-plans` SHALL be used as the default implementation augmentation
- **AND** task completion SHALL still be determined through the DuowenSpec task flow

#### Scenario: Implementation-stage companion skills remain optional
- **WHEN** a contributor is in `/opsx:apply`
- **THEN** `superpowers:test-driven-development` or `superpowers:subagent-driven-development` MAY be used when the implementation task benefits from them
- **AND** those skills SHALL remain inside the apply stage rather than redefining workflow state

#### Scenario: Review before verification
- **WHEN** implementation work is ready for checking
- **THEN** `superpowers:requesting-code-review` and `superpowers:receiving-code-review` SHALL occur before `/opsx:verify`
- **AND** review findings SHALL influence whether the workflow proceeds or loops back

#### Scenario: Verification uses the real superpowers verification skill
- **WHEN** implementation is ready for the verification gate
- **THEN** `superpowers:verification-before-completion` SHALL be used together with `/opsx:verify`
- **AND** DuowenSpec SHALL remain the source of truth for whether verification passed

#### Scenario: Documentation after verification
- **WHEN** implementation has passed verification
- **THEN** a required enterprise documentation checkpoint SHALL occur after `/opsx:verify` and before release
- **AND** documentation SHALL reflect the verified result rather than an earlier draft implementation

#### Scenario: Enterprise activation requires bundled-skill preflight
- **WHEN** a project selects the enterprise workflow during setup or configuration
- **THEN** the system SHALL verify that the bundled enterprise skills referenced by the selected workflow are present in this published fork
- **AND** enterprise activation SHALL NOT complete if any of those referenced bundled skills are missing from the package

#### Scenario: Init copies bundled enterprise skills into the project
- **WHEN** a project runs `duowenspec init` with enterprise workflow stages that use bundled enterprise skills
- **THEN** setup SHALL copy those bundled enterprise skills into the selected AI tool's project-local skills directory
- **AND** downstream projects SHALL NOT need a separate manual install step for those skills

#### Scenario: Init defaults to enterprise-first setup
- **WHEN** a contributor runs `duowenspec init` from this fork
- **THEN** the generated workflow artifacts SHALL follow the enterprise-first workflow defined by this fork unless an approved project-level exception applies
- **AND** setup messaging SHALL reflect enterprise-oriented next steps

### Requirement: The enterprise proposal defines release scope
The enterprise workflow SHALL require the proposal to define the user-facing scope that later release validation must cover.

#### Scenario: Proposal includes core user stories
- **WHEN** a contributor creates an enterprise proposal
- **THEN** the proposal SHALL include `Core User Stories`
- **AND** each story SHALL describe a key user outcome and the critical operation flows for that outcome

#### Scenario: Core user stories use the standard enterprise shape
- **WHEN** a contributor writes an item in `Core User Stories`
- **THEN** the story SHALL include a story ID and title
- **AND** SHALL include role, goal, business value, critical operation flows, and success criteria

#### Scenario: Core user stories stay focused
- **WHEN** a contributor writes enterprise user stories
- **THEN** each story SHALL describe one complete user goal
- **AND** the story's critical operation flows SHALL be user-visible flows rather than implementation steps

#### Scenario: Proposal includes release coverage
- **WHEN** a contributor creates an enterprise proposal
- **THEN** the proposal SHALL include `Release Coverage`
- **AND** the release coverage SHALL identify which named user stories and flows must be covered in private-cloud and customer-environment verification

#### Scenario: Release coverage traces back to stories
- **WHEN** release validation is planned or executed
- **THEN** the covered flows SHALL come from the proposal's `Core User Stories`
- **AND** the release coverage SHALL reference the relevant story IDs
- **AND** the workflow SHALL NOT treat unrelated late-added flows as required release scope unless the proposal is updated first

#### Scenario: Release coverage uses the standard enterprise shape
- **WHEN** a contributor writes `Release Coverage`
- **THEN** it SHALL include a `Private Cloud Verification` section and a `Customer Environment Verification` section
- **AND** each section SHALL list covered story IDs, covered flows, and release-blocking failure conditions

#### Scenario: Covered flows use story-linked references
- **WHEN** a contributor lists a covered flow in `Release Coverage`
- **THEN** the flow SHALL use the relevant story ID together with a named flow from `Core User Stories`
- **AND** the workflow SHALL be able to trace that covered flow back to a specific user story

#### Scenario: Customer coverage stays connected to proposal scope
- **WHEN** customer-environment verification is planned
- **THEN** its covered stories and flows MAY be a subset of private-cloud coverage
- **AND** they SHALL remain connected to the same proposal user stories rather than defining a separate release scope

#### Scenario: Proposal defines release evidence plan
- **WHEN** a contributor creates an enterprise proposal
- **THEN** the proposal SHALL include `Release Evidence Plan`
- **AND** it SHALL describe how AI-run validation and human confirmation may be used for the required release gates

#### Scenario: Release evidence plan uses the standard enterprise shape
- **WHEN** a contributor writes `Release Evidence Plan`
- **THEN** it SHALL include a `Private Cloud Verification` section and a `Customer Environment Verification` section
- **AND** each section SHALL define accepted evidence types, required record fields, and method-selection rules

#### Scenario: Accepted evidence types stay narrow
- **WHEN** release evidence is planned or recorded
- **THEN** accepted evidence SHALL be limited to successful AI-run validation or explicit human text confirmation
- **AND** the workflow SHALL NOT treat vague approval or missing confirmation as release evidence

#### Scenario: Evidence records remain traceable
- **WHEN** a release gate result is recorded
- **THEN** the record SHALL identify the environment, validation method, result, covered story IDs, covered flows, evidence summary, and recorder identity
- **AND** the workflow SHALL be able to relate that record back to the proposal's `Release Coverage`

#### Scenario: Proposal defines out-of-scope boundaries
- **WHEN** a contributor creates an enterprise proposal
- **THEN** the proposal SHALL include `Out of Scope`
- **AND** that section SHALL identify notable work that is intentionally excluded from the current change

### Requirement: Release uses two required environment gates
The enterprise workflow SHALL require successful private-cloud verification and customer-environment verification before archive readiness.

#### Scenario: Private-cloud verification only after documentation is complete
- **WHEN** implementation and verification are complete
- **THEN** private-cloud verification SHALL NOT proceed until required documentation is complete

#### Scenario: Customer verification only after private-cloud success
- **WHEN** private-cloud verification has not yet succeeded
- **THEN** the workflow SHALL NOT proceed to customer-environment verification

#### Scenario: Archive only after customer verification succeeds
- **WHEN** customer-environment verification has not yet succeeded
- **THEN** the workflow SHALL NOT mark the change ready for archive

#### Scenario: Successful customer verification unlocks finalization
- **WHEN** both private-cloud verification and customer-environment verification succeed
- **THEN** the workflow SHALL allow finalization and archive
- **AND** enterprise archive SHALL include main-spec finalization guarantees without requiring a separate sync step in the normal path

### Requirement: The workflow defines loop-back behavior
The enterprise workflow SHALL define explicit return paths when planning, implementation, documentation, or release checks fail.

#### Scenario: Plan validation fails
- **WHEN** `duowenspec validate` reports proposal, task, or spec issues
- **THEN** the workflow SHALL require repair of the existing planning artifacts and re-validation before implementation proceeds
- **AND** the workflow SHALL NOT assume `/opsx:propose` can overwrite or regenerate existing artifacts

#### Scenario: Validation failure reveals planning confusion
- **WHEN** `duowenspec validate` fails because the current change plan is incomplete, inconsistent, or based on the wrong assumptions
- **THEN** the contributor MAY return to `/opsx:explore` for clarification
- **AND** the corrected plan SHALL still be applied to the existing planning artifacts before re-validation

#### Scenario: Review or verification finds implementation issues
- **WHEN** `superpowers:requesting-code-review`, `superpowers:receiving-code-review`, or `/opsx:verify` finds implementation defects without changing the intended scope
- **THEN** the workflow SHALL return to `/opsx:apply`
- **AND** implementation SHALL be corrected before the workflow advances

#### Scenario: Review or verification reveals scope or design drift
- **WHEN** `superpowers:requesting-code-review`, `superpowers:receiving-code-review`, or `/opsx:verify` reveals that the intended scope, requirements, or approach has changed materially
- **THEN** the workflow SHALL return to `/opsx:explore` or `/opsx:propose`
- **AND** the planning artifacts SHALL be updated before implementation resumes

#### Scenario: Documentation is incomplete or inconsistent
- **WHEN** required documentation is missing or inconsistent with the verified implementation
- **THEN** the workflow SHALL return to the documentation step
- **AND** it MAY also return to implementation or verification if the mismatch exposes product issues

#### Scenario: Release fails for implementation reasons
- **WHEN** private-cloud verification fails because the implementation is not actually ready
- **THEN** the workflow SHALL return to `/opsx:apply`
- **AND** the change SHALL pass review and verification again before another release attempt

#### Scenario: Release fails for scope or rollout-design reasons
- **WHEN** customer-environment verification fails because the rollout assumptions, requirements, or plan were wrong
- **THEN** the workflow SHALL return to `/opsx:explore` or `/opsx:propose`
- **AND** the planning artifacts SHALL be updated before implementation resumes

### Requirement: Required checkpoints leave records
The enterprise workflow SHALL preserve auditable records for required checkpoints.

#### Scenario: Review record is retained
- **WHEN** the review checkpoint completes after `superpowers:requesting-code-review` and `superpowers:receiving-code-review`
- **THEN** the workflow SHALL retain a record of the review outcome

#### Scenario: Review record uses the standard shape
- **WHEN** a review result is recorded
- **THEN** the record SHALL identify the reviewed scope, explicit result, short summary, findings, required follow-up, and reviewer identity
- **AND** the workflow SHALL NOT treat an implied or missing review result as a completed review gate

#### Scenario: Documentation completion is retained
- **WHEN** required documentation is completed
- **THEN** the workflow SHALL retain a record of that completion before release proceeds

#### Scenario: Documentation-completion record uses the standard shape
- **WHEN** documentation completion is recorded
- **THEN** the record SHALL identify the completed document set, explicit result, short summary, covered deliverables, consistency check, required follow-up, and recorder identity
- **AND** the workflow SHALL NOT treat undocumented completion as satisfying the documentation gate

#### Scenario: Release progression is retained
- **WHEN** private-cloud verification or customer-environment verification completes
- **THEN** the workflow SHALL retain a record of the outcome for each environment gate

### Requirement: The workflow is reusable across projects in this fork
The enterprise workflow SHALL be adoptable by downstream projects using the published fork without repository-specific manual copying.

#### Scenario: Downstream project adopts enterprise workflow
- **WHEN** a downstream project uses the published DuowenSpec fork and selects the enterprise workflow
- **THEN** the project SHALL receive the same stage order, required checkpoints, generated prompts/skills, and staged-release behavior
- **AND** the project SHALL not need to manually copy workflow files from this repository

#### Scenario: Lighter workflow users stay on upstream DuowenSpec
- **WHEN** a team wants the lighter original workflow instead of the enterprise-first workflow defined here
- **THEN** they SHALL be able to use the official DuowenSpec distribution
- **AND** this fork SHALL not need to preserve that lighter behavior as a first-class in-product mode

### Requirement: Project-specific exceptions are explicit
The enterprise workflow SHALL allow project-specific exceptions to be documented in project-level `AGENTS.md` rather than weakening the default workflow globally.

#### Scenario: Project declares an approved exception
- **WHEN** a project has a justified reason to skip, replace, or reshape a workflow step
- **THEN** that exception SHALL be documented in the project's `AGENTS.md`
- **AND** the enterprise workflow default SHALL remain unchanged for other projects

#### Scenario: Project uses the default strict path
- **WHEN** a project does not declare an exception in `AGENTS.md`
- **THEN** the project SHALL follow the default enterprise workflow gates and stage order
