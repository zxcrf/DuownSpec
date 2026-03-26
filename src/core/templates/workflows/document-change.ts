import type { SkillTemplate, CommandTemplate } from '../types.js';

export function getDocumentChangeSkillTemplate(): SkillTemplate {
  return {
    name: 'openspec-document-change',
    description: '在发布与归档前记录交付文档已完成。适用于确认文档与实际交付一致。',
    instructions: `在发布和归档前记录变更的最终交付状态。

这是企业流程中的必经检查点。此处需要完成交付文档这一流程门禁；
但发布是否就绪、是否可归档，仍以 OpenSpec 作为唯一依据。
不要假设 superpowers 一定提供了可直接替代此步骤的内置文档能力。

**输入**: 可选传入变更名。若未传入，请根据对话上下文判断；若信息含糊，必须提示用户从可用变更中选择。

**步骤**

1. **选择变更**

   如果提供了变更名，直接使用；否则：
   - 从对话中判断用户是否已提到某个变更
   - 若只有一个活跃变更，可自动选择
   - 若存在歧义，执行 \`dwsp list --json\` 获取可选变更，并使用 **AskUserQuestion tool** 让用户选择

2. **加载变更上下文**

   \`\`\`bash
   dwsp status --change "<name>" --json
   dwsp instructions apply --change "<name>" --json
   \`\`\`

   若存在 proposal、specs、design、tasks，全部读取。

3. **检查文档完整性**

   确认交付结果已反映在必要文档中：
   - 面向用户的行为变化或流程说明
   - 若影响发布或验证，需要补齐运行与操作说明
   - 涉及 API 或集成时，补齐接口或对接说明
   - 变更计划要求的项目特定记录

4. **生成文档完成记录**

   生成结构化记录，至少包含：
   - \`变更\`
   - \`记录人\`
   - \`结果\`: complete / incomplete
   - \`已检查产物\`
   - \`覆盖情况摘要\`
   - \`缺口\`

5. **给出下一步建议**

   - 若文档不完整：停止推进并列出缺失项
   - 若文档完整：明确可继续进入发布验证流程

**约束**
- 将文档视为发布门禁
- 必要交付物仍缺失时，不得标记为 complete`,
    license: 'MIT',
    compatibility: '需要安装 dwsp CLI。',
    metadata: { author: 'openspec', version: '1.0' },
  };
}

export function getOpsxDocumentCommandTemplate(): CommandTemplate {
  return {
    name: 'OPSX: Document',
    description: '确认发布与归档前所需交付文档已完成',
    category: '工作流',
    tags: ['workflow', 'document', 'enterprise'],
    content: `在发布和归档前记录变更的最终交付状态。

这是企业流程中的必经检查点。此处需要完成交付文档这一流程门禁；
但发布是否就绪、是否可归档，仍以 OpenSpec 作为唯一依据。
不要假设 superpowers 一定提供了可直接替代此步骤的内置文档能力。

**输入**: 可选在 \`/dwsp:document\` 后传入变更名。若未传入，请根据对话上下文判断；若信息含糊，必须提示用户从可用变更中选择。

**步骤**

1. **选择变更**

   如果提供了变更名，直接使用；否则：
   - 从对话中判断用户是否已提到某个变更
   - 若只有一个活跃变更，可自动选择
   - 若存在歧义，执行 \`dwsp list --json\` 获取可选变更，并使用 **AskUserQuestion tool** 让用户选择

2. **加载变更上下文**

   \`\`\`bash
   dwsp status --change "<name>" --json
   dwsp instructions apply --change "<name>" --json
   \`\`\`

3. **检查文档完整性**

   确认交付结果已反映在必要文档中：
   - 面向用户的行为变化或流程说明
   - 若影响发布或验证，需要补齐运行与操作说明
   - 涉及 API 或集成时，补齐接口或对接说明
   - 变更计划要求的项目特定记录

4. **生成文档完成记录**

   生成结构化记录，至少包含：
   - \`变更\`
   - \`记录人\`
   - \`结果\`: complete / incomplete
   - \`已检查产物\`
   - \`覆盖情况摘要\`
   - \`缺口\``,
  };
}
