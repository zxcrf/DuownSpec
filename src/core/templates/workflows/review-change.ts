import type { SkillTemplate, CommandTemplate } from '../types.js';
import { getModoBEndReviewHint } from './shared-b-end.js';

export function getReviewChangeSkillTemplate(): SkillTemplate {
  return {
    name: 'dwsp-review-change',
    description: '在验证与发布前审查已完成变更。适用于需要结构化审查、明确问题与结论记录。',
    instructions: `在发布前审查已完成的变更。

这是企业流程中的必经检查点。可使用 \`dwsp-requesting-code-review\`
和 \`dwsp-receiving-code-review\` 来完成审查能力，但是否进入
\`/dwsp:verify\` 或退回实现阶段，仍以 DuowenSpec 作为唯一依据。

**输入**: 可选传入变更名。若未传入，请根据对话上下文判断；若信息含糊，必须提示用户从可用变更中选择。

**步骤**

1. **选择变更**

   如果提供了变更名，直接使用；否则：
   - 从对话中判断用户是否已提到某个变更
   - 若只有一个活跃变更，可自动选择
   - 若存在歧义，执行 \`dwsp list --json\` 获取可选变更，并使用 **AskUserQuestion tool** 让用户选择

   始终明确说明："正在审查变更：<name>"，并提示如何覆盖（例如 \`/dwsp:review <other>\`）。

2. **加载变更上下文**

   \`\`\`bash
   dwsp status --change "<name>" --json
   dwsp instructions apply --change "<name>" --json
   \`\`\`

   在审查前读取 apply 指令返回的全部上下文文件。

3. **审查实现内容**

   优先关注会阻塞发布的问题：
   - 功能回归
   - 已批准任务存在漏做
   - 与 spec 不一致
   - 高风险边界场景
   - 测试缺失或覆盖薄弱

   引用问题时请附文件位置。

4. **产出审查结论**

   生成结构化审查记录，至少包含：
   - \`变更\`
   - \`审查人\`
   - \`结论\`: pass / changes-required
   - \`审查范围\`
   - \`问题发现\`
   - \`必需后续项\`

   如果没有发现问题，要明确说明。

5. **确定下一步**

   - 若存在严重问题：停止推进并退回实现阶段
   - 若仅有轻微后续项：在进入 verify 前明确列出
   - 若审查通过：建议进入 \`/dwsp:verify\`

**约束**
- 优先审查缺陷、回归与发布风险
- 审查阶段不要重写计划
- 仍有阻塞发布的问题时，不得标记为通过
- 若无法从现有上下文验证某条结论，必须明确说明

${getModoBEndReviewHint()}`,
    license: 'MIT',
    compatibility: '需要安装 dwsp CLI。',
    metadata: { author: 'duowenspec', version: '1.0' },
  };
}

export function getOpsxReviewCommandTemplate(): CommandTemplate {
  return {
    name: 'OPSX: Review',
    description: '审查已完成变更并记录阻塞发布的问题',
    category: '工作流',
    tags: ['workflow', 'review', 'enterprise'],
    content: `在发布前审查已完成的变更。

这是企业流程中的必经检查点。可使用 \`dwsp-requesting-code-review\`
和 \`dwsp-receiving-code-review\` 来完成审查能力，但是否进入
\`/dwsp:verify\` 或退回实现阶段，仍以 DuowenSpec 作为唯一依据。

**输入**: 可选在 \`/dwsp:review\` 后传入变更名（例如 \`/dwsp:review add-auth\`）。若未传入，请根据对话上下文判断；若信息含糊，必须提示用户从可用变更中选择。

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

   在审查前读取 apply 指令返回的全部上下文文件。

3. **审查实现内容**

   优先关注会阻塞发布的问题：
   - 功能回归
   - 已批准任务存在漏做
   - 与 spec 不一致
   - 高风险边界场景
   - 测试缺失或覆盖薄弱

4. **产出审查结论**

   生成结构化审查记录，至少包含：
   - \`变更\`
   - \`审查人\`
   - \`结论\`: pass / changes-required
   - \`审查范围\`
   - \`问题发现\`
   - \`必需后续项\`

5. **确定下一步**

   - 若存在严重问题：停止推进并退回实现阶段
- 若审查通过：建议进入 \`/dwsp:verify\`

${getModoBEndReviewHint()}`,
  };
}
