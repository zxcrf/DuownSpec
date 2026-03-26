# 项目协作说明（MODO + OpenSpec）

## 默认协作语言

- 全程默认使用中文沟通与输出。
- 命令本身保持原样，不翻译命令名。

## 需求来源（唯一入口）

- OpenSpec 是本项目唯一需求驱动。
- 需求、范围、设计与任务只从 OpenSpec 产物读取：
  - `openspec/changes/<change>/proposal.md`
  - `openspec/changes/<change>/design.md`
  - `openspec/changes/<change>/tasks.md`
  - `openspec/specs/**`
- 不使用 `.prd`，也不要要求补写 `.prd`。

## B 端 UI 交付总流程

1. 先用 OpenSpec 节点确定当前阶段（`explore` / `propose` / `apply` / `review` / `verify`）。
2. 涉及 B 端页面时，优先调用 `openspec-b-end-delivery`，先锁定页面模式和模板路径。
3. 进入具体实现时，按需调用 `openspec-b-end-components`，完成角色到组件的解析与降级。
4. 输出结果前，必须调用 `openspec-b-end-review` 做一致性门禁。

## 节点与技能配合规则

- `openspec-explore`
  - 适用：需求澄清、页面模式判断、风险识别。
  - 要求：在探索结论里写清楚拟采用的 pattern、模板路径、关键组件。

- `openspec-propose`
  - 适用：创建或完善 proposal/design/tasks。
  - 要求：把 B 端页面的模式选择、组件策略、一致性约束写入产物，便于后续执行。

- `openspec-apply-change`
  - 适用：按任务实现页面与交互。
  - 要求：实现前先看 `openspec/b-end/MANIFEST.md`；组件拿不准时先走 `openspec-b-end-components`；完成前必须过 `openspec-b-end-review`。

- `openspec-review-change`
  - 适用：发布前审查。
  - 要求：审查结论必须包含一致性检查结果；有阻塞问题时不得判定通过。

- `openspec-verify-change`
  - 适用：最终验证与交付前确认。
  - 要求：只在 `review` 通过后进入；验证结果与风险要明确记录。

## 一致性约束（必须遵守）

- 模板一致性
  - 页面结构优先复用 `src/components/templates/*`，不要随意改骨架。
  - pattern 选择以 `openspec/b-end/patterns/*` 为准。

- 组件一致性
  - 组件映射以 `openspec/b-end/MANIFEST.md` 为准。
  - 优先使用 `src/components/biz/*`。
  - Biz 不可用时按 `openspec/b-end/references/fallback/*` 降级，不可凭空发明组件路径。

- 主题一致性
  - 保持 `src/theme/modo-algorithm.ts` 与 `src/theme/antd-theme-token.tsx` 的主题链路。
  - 不引入与现有 MODO 风格冲突的另一套视觉规范。

- 交互一致性
  - 保持同类页面的交互模式一致（筛选、表格、分页、弹窗、确认动作等）。
  - 审查时对照 `openspec/b-end/references/DESIGN_SPEC.md`、`PITFALLS*.md` 执行检查。

## 执行与汇报要求

- 先验证，再汇报。
- 任何实现、重构或修复完成后，先本地验证关键路径（构建、测试、主要交互流程）再给结论。
- 汇报应包含：
  - 做了什么
  - 验证了什么
  - 结果怎样
  - 剩余风险（如有）
- 没有验证的内容要明确标注“未验证”，不能默认视为完成。

## 禁止事项

- 禁止把 `.prd` 作为需求输入。
- 禁止跳过 `openspec-b-end-review` 直接宣告完成。
- 禁止脱离模板和 Manifest 自行拼装一套新风格页面。
- 禁止未验证就汇报“已完成”。
