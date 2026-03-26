import type { SkillTemplate, CommandTemplate } from '../types.js';

export function getDocumentChangeSkillTemplate(): SkillTemplate {
  return {
    name: 'openspec-document-change',
    description: 'Record completion of required delivery documentation before release and archive. Use when the user needs to confirm docs are aligned with the delivered change.',
    instructions: `Document the final delivered state of a change before release and archive.

This is a required enterprise checkpoint. Finish delivery documentation here as
an enterprise workflow gate, but keep DuowenSpec as the source of truth for
release readiness and final archive progression. Do not assume superpowers has
a matching built-in documentation skill for this step.

**Input**: Optionally specify a change name. If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

**Steps**

1. **Select the change**

   If a name is provided, use it. Otherwise:
   - Infer from conversation context if the user mentioned a change
   - Auto-select if only one active change exists
   - If ambiguous, run \`duowenspec list --json\` to get available changes and use the **AskUserQuestion tool** to let the user select

2. **Load the change context**

   \`\`\`bash
   duowenspec status --change "<name>" --json
   duowenspec instructions apply --change "<name>" --json
   \`\`\`

   Read the proposal, specs, design, and tasks if available.

3. **Check documentation completeness**

   Confirm that the delivered result is reflected in the required documentation:
   - User-facing behavior or workflow notes
   - Operational notes if the change affects rollout or verification
   - API or integration notes when needed
   - Any project-specific records required by the change plan

4. **Create a documentation completion record**

   Write a structured record with:
   - \`Change\`
   - \`Recorder\`
   - \`Outcome\`: complete / incomplete
   - \`Artifacts Checked\`
   - \`Coverage Summary\`
   - \`Gaps\`

5. **Recommend the next step**

   - If documentation is incomplete: stop and list the missing items
   - If documentation is complete: state that release verification can proceed or continue

**Guardrails**
- Treat documentation as a release gate
- Do not mark it complete if required deliverables are still missing`,
    license: 'MIT',
    compatibility: 'Requires duowenspec CLI.',
    metadata: { author: 'openspec', version: '1.0' },
  };
}

export function getOpsxDocumentCommandTemplate(): CommandTemplate {
  return {
    name: 'DWSP: Document',
    description: 'Confirm required delivery documentation is complete before release and archive',
    category: 'Workflow',
    tags: ['workflow', 'document', 'enterprise'],
    content: `Document the final delivered state of a change before release and archive.

This is a required enterprise checkpoint. Finish delivery documentation here as
an enterprise workflow gate, but keep DuowenSpec as the source of truth for
release readiness and final archive progression. Do not assume superpowers has
a matching built-in documentation skill for this step.

**Input**: Optionally specify a change name after \`/dwsp:document\`. If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

**Steps**

1. **Select the change**

   If a name is provided, use it. Otherwise:
   - Infer from conversation context if the user mentioned a change
   - Auto-select if only one active change exists
   - If ambiguous, run \`duowenspec list --json\` to get available changes and use the **AskUserQuestion tool** to let the user select

2. **Load the change context**

   \`\`\`bash
   duowenspec status --change "<name>" --json
   duowenspec instructions apply --change "<name>" --json
   \`\`\`

3. **Check documentation completeness**

   Confirm that the delivered result is reflected in the required documentation:
   - User-facing behavior or workflow notes
   - Operational notes if the change affects rollout or verification
   - API or integration notes when needed
   - Any project-specific records required by the change plan

4. **Create a documentation completion record**

   Write a structured record with:
   - \`Change\`
   - \`Recorder\`
   - \`Outcome\`: complete / incomplete
   - \`Artifacts Checked\`
   - \`Coverage Summary\`
   - \`Gaps\``,
  };
}
