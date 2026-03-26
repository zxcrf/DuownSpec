export function getModoBEndPlanningHint(): string {
  return `## MODO B 端交付补充

如果项目根目录的 \`.b-end-adapter\` 内容是 \`modo\`，并且当前变更涉及后台页面、控制台布局、表格页、向导页或其他 B 端 UI：
- 先调用 \`openspec-b-end-delivery\`，把当前 OpenSpec 产物转成统一的页面模式与模板选择
- 把 \`openspec/changes/...\` 和 \`openspec/specs/...\` 当成需求来源，不要重新回到 \`.prd\`
- 在产物里明确记录所选 pattern、模板路径和关键 Biz 组件，保证后续实现保持一致
`;
}

export function getModoBEndImplementationHint(): string {
  return `## MODO B 端实现补充

如果项目根目录的 \`.b-end-adapter\` 内容是 \`modo\`，并且当前任务涉及页面代码、布局、交互或组件落地：
- 开始实现前先调用 \`openspec-b-end-delivery\`，确认 pattern、模板和关键组件
- 具体组件解析时调用 \`openspec-b-end-components\`，严格以 \`openspec/b-end/MANIFEST.md\` 为准
- 输出前必须调用 \`openspec-b-end-review\`，确保布局、组件和交互规则保持统一
- 整个过程都以 OpenSpec 产物为需求来源，不要引回 \`.prd\`
`;
}

export function getModoBEndReviewHint(): string {
  return `## MODO B 端审查补充

如果当前项目是 \`modo\` 适配器，且本次变更涉及 B 端 UI：
- 审查时必须调用 \`openspec-b-end-review\`
- 重点核对 pattern 是否跑偏、模板骨架是否被破坏、Biz 组件导入是否真实存在、交互规则是否统一
`;
}
