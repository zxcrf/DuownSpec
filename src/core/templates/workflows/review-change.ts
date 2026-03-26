import type { SkillTemplate, CommandTemplate } from '../types.js';

export function getReviewChangeSkillTemplate(): SkillTemplate {
  return {
    name: 'openspec-review-change',
    description: 'Review a completed change before verification and release. Use when the user wants a structured implementation review with explicit findings and a recorded outcome.',
    instructions: `Review a completed change before release.

This is a required enterprise checkpoint. Use \`superpowers:requesting-code-review\`
and \`superpowers:receiving-code-review\` for the review capability, but keep
OpenSpec as the source of truth for whether the change moves forward to
\`/opsx:verify\` or back to implementation.

**Input**: Optionally specify a change name. If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

**Steps**

1. **Select the change**

   If a name is provided, use it. Otherwise:
   - Infer from conversation context if the user mentioned a change
   - Auto-select if only one active change exists
   - If ambiguous, run \`openspec list --json\` to get available changes and use the **AskUserQuestion tool** to let the user select

   Always announce: "Reviewing change: <name>" and how to override (for example \`/opsx:review <other>\`).

2. **Load the change context**

   \`\`\`bash
   openspec status --change "<name>" --json
   openspec instructions apply --change "<name>" --json
   \`\`\`

   Read every context file returned by the apply instructions before reviewing.

3. **Review the implementation**

   Focus on release-blocking concerns first:
   - Functional regressions
   - Missing work against the approved tasks
   - Spec mismatches
   - Risky edge cases
   - Missing tests or weak coverage

   Use file references when you cite an issue.

4. **Produce a review outcome**

   Create a structured review record with:
   - \`Change\`
   - \`Reviewer\`
   - \`Outcome\`: pass / changes-required
   - \`Scope Reviewed\`
   - \`Findings\`
   - \`Required Follow-ups\`

   If no issues are found, explicitly say so.

5. **Decide the next step**

   - If critical issues exist: stop and send the change back to implementation
   - If only minor follow-ups exist: state them clearly before verification
   - If review passes: recommend moving to \`/opsx:verify\`

**Guardrails**
- Review for bugs, regressions, and release risk first
- Do not rewrite the plan during review
- Do not mark review as passed if release-blocking issues remain
- If you cannot verify a claim from the available context, say so clearly`,
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'openspec', version: '1.0' },
  };
}

export function getOpsxReviewCommandTemplate(): CommandTemplate {
  return {
    name: 'OPSX: Review',
    description: 'Review a completed change and capture release-blocking findings',
    category: 'Workflow',
    tags: ['workflow', 'review', 'enterprise'],
    content: `Review a completed change before release.

This is a required enterprise checkpoint. Use \`superpowers:requesting-code-review\`
and \`superpowers:receiving-code-review\` for the review capability, but keep
OpenSpec as the source of truth for whether the change moves forward to
\`/opsx:verify\` or back to implementation.

**Input**: Optionally specify a change name after \`/opsx:review\` (for example \`/opsx:review add-auth\`). If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

**Steps**

1. **Select the change**

   If a name is provided, use it. Otherwise:
   - Infer from conversation context if the user mentioned a change
   - Auto-select if only one active change exists
   - If ambiguous, run \`openspec list --json\` to get available changes and use the **AskUserQuestion tool** to let the user select

2. **Load the change context**

   \`\`\`bash
   openspec status --change "<name>" --json
   openspec instructions apply --change "<name>" --json
   \`\`\`

   Read every context file returned by the apply instructions before reviewing.

3. **Review the implementation**

   Focus on release-blocking concerns first:
   - Functional regressions
   - Missing work against the approved tasks
   - Spec mismatches
   - Risky edge cases
   - Missing tests or weak coverage

4. **Produce a review outcome**

   Create a structured review record with:
   - \`Change\`
   - \`Reviewer\`
   - \`Outcome\`: pass / changes-required
   - \`Scope Reviewed\`
   - \`Findings\`
   - \`Required Follow-ups\`

5. **Decide the next step**

   - If critical issues exist: stop and send the change back to implementation
   - If review passes: recommend moving to \`/opsx:verify\``,
  };
}
