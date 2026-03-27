import type { SkillTemplate } from '../types.js';

export function getBrainstormingSkillTemplate(): SkillTemplate {
  return {
    name: 'dwsp-brainstorming',
    description: 'Broaden the option space when the problem statement is still incomplete or fuzzy.',
    instructions: `Explore a problem by generating and comparing strong options.

Use this bundled capability during \`/dwsp:explore\` when the current request
is still underspecified and the job is to widen the option space before
committing to a proposal.

**Steps**

1. Restate the current problem in plain language.
2. Generate multiple plausible approaches instead of locking in early.
3. Compare trade-offs, assumptions, and likely risks.
4. Highlight what information is still missing.
5. Return the strongest candidates to the main workflow so the accepted result
   can be captured in DuowenSpec artifacts.

**Guardrails**
- Do not present one idea as the only option too early
- Do not replace proposal or design artifacts with free-form brainstorming
- Keep the output grounded in the user's real constraints`,
    license: 'MIT',
    compatibility: 'Requires dwsp CLI.',
    metadata: { author: 'duowenspec', version: '1.0' },
  };
}

export function getExecutingPlansSkillTemplate(): SkillTemplate {
  return {
    name: 'dwsp-executing-plans',
    description: 'Carry an approved implementation plan through to working code with steady task-by-task progress.',
    instructions: `Execute an approved implementation plan.

Use this bundled capability during \`/dwsp:apply\` when the plan is already
approved and the next job is to work through implementation tasks without
losing scope discipline.

**Steps**

1. Read the current approved plan and task list before changing anything.
2. Work through the remaining implementation tasks one by one.
3. Keep changes aligned with the approved scope unless the user explicitly
   decides to reopen exploration or proposal work.
4. Run the checks that prove the task really works.
5. Leave a clear summary of what changed, what was verified, and what still
   needs attention.

**Guardrails**
- Do not invent a new plan while executing an approved one
- Do not silently expand scope
- Prefer small, verifiable steps over broad speculative edits`,
    license: 'MIT',
    compatibility: 'Requires dwsp CLI.',
    metadata: { author: 'duowenspec', version: '1.0' },
  };
}

export function getTestDrivenDevelopmentSkillTemplate(): SkillTemplate {
  return {
    name: 'dwsp-test-driven-development',
    description: 'Drive implementation with focused failing tests before the production fix.',
    instructions: `Use a test-first loop to implement a change.

Use this bundled capability during \`/dwsp:apply\` when the task benefits from
locking behavior down with tests before or alongside production code changes.

**Steps**

1. Identify the smallest observable behavior that should change.
2. Add or update a test that fails for the current implementation.
3. Change the implementation just enough to make the test pass.
4. Re-run the relevant checks.
5. Clean up only after the behavior is proven.

**Guardrails**
- Do not add broad speculative tests with unclear intent
- Keep each test tied to a user-visible behavior or requirement
- Do not stop at green tests if the delivered behavior still misses the plan`,
    license: 'MIT',
    compatibility: 'Requires dwsp CLI.',
    metadata: { author: 'duowenspec', version: '1.0' },
  };
}

export function getSubagentDrivenDevelopmentSkillTemplate(): SkillTemplate {
  return {
    name: 'dwsp-subagent-driven-development',
    description: 'Split bounded implementation work into coordinated sub-tasks without losing the main plan.',
    instructions: `Use bounded delegation to speed up implementation work.

Use this bundled capability during \`/dwsp:apply\` when the approved plan can
be decomposed into independent slices that can be carried in parallel.

**Steps**

1. Identify work that can be split without overlapping ownership.
2. Keep the critical-path work in the main thread when it would block progress.
3. Delegate concrete, bounded sub-tasks with clear file or responsibility ownership.
4. Review delegated results before accepting them back into the main flow.
5. Reconcile everything against the approved plan and task list.

**Guardrails**
- Do not delegate vague or tightly coupled work
- Do not let parallel work create conflicting ownership
- Keep the approved plan as the single source of truth`,
    license: 'MIT',
    compatibility: 'Requires dwsp CLI.',
    metadata: { author: 'duowenspec', version: '1.0' },
  };
}

export function getRequestingCodeReviewSkillTemplate(): SkillTemplate {
  return {
    name: 'dwsp-requesting-code-review',
    description: 'Prepare a focused code review request that points reviewers at the real risk in a change.',
    instructions: `Request a focused code review before release verification.

Use this bundled capability during the enterprise review checkpoint to make
sure the reviewer sees the intended scope, the risky areas, and the evidence
already collected.

**Steps**

1. Summarize the approved scope of the change.
2. Point to the parts of the implementation that deserve the most attention.
3. Call out known risks, edge cases, and any checks already run.
4. Ask for findings that could block verification or release.

**Guardrails**
- Do not ask for a vague "look it over"
- Make the review target concrete and release-focused
- Surface known uncertainty instead of hiding it`,
    license: 'MIT',
    compatibility: 'Requires dwsp CLI.',
    metadata: { author: 'duowenspec', version: '1.0' },
  };
}

export function getReceivingCodeReviewSkillTemplate(): SkillTemplate {
  return {
    name: 'dwsp-receiving-code-review',
    description: 'Process review feedback in a disciplined way so required fixes are resolved before verification.',
    instructions: `Process review feedback before moving on to verification.

Use this bundled capability after review findings come back so the change can
either return to implementation or move forward with a clear record of what was
addressed.

**Steps**

1. Read every review finding carefully.
2. Separate release-blocking issues from minor follow-ups.
3. Resolve the issues that must be fixed before verification.
4. Re-run the checks affected by those fixes.
5. Record which findings were fixed, deferred, or rejected, and why.

**Guardrails**
- Do not wave away review findings without explanation
- Do not claim the review is resolved if blocking issues remain
- Keep the resolution tied to the actual feedback received`,
    license: 'MIT',
    compatibility: 'Requires dwsp CLI.',
    metadata: { author: 'duowenspec', version: '1.0' },
  };
}

export function getVerificationBeforeCompletionSkillTemplate(): SkillTemplate {
  return {
    name: 'dwsp-verification-before-completion',
    description: 'Run final release-readiness verification against the approved scope before calling work complete.',
    instructions: `Verify release readiness before completion.

Use this bundled capability together with \`/dwsp:verify\` to confirm the
implemented result still matches the approved proposal, the required coverage,
and the release gate expectations.

**Steps**

1. Read the approved proposal and release coverage.
2. Check the delivered result against the promised user stories and flows.
3. Confirm the required tests or verification runs actually passed.
4. Call out any mismatch, missing evidence, or unresolved risk.
5. State clearly whether the change is ready to move on or must loop back.

**Guardrails**
- Do not mark work complete just because code exists
- Verify against promised behavior, not only implementation details
- Fail clearly if evidence is missing or contradictory`,
    license: 'MIT',
    compatibility: 'Requires dwsp CLI.',
    metadata: { author: 'duowenspec', version: '1.0' },
  };
}
