## Why

当前 `/dwsp:apply` 的执行指引偏通用，团队很难在每次实现里稳定地坚持“先测试后实现”的节奏。现在引入可配置的 TDD 开发模式，可以把实现质量和交付一致性前置到流程层面。

## What Changes

- 在 apply 节点增加“开发模式”配置入口。
- 新增一个可直接使用的 `superpowers-tdd` 模式，明确 test-first 执行顺序。
- 让 `dwsp instructions apply` 输出当前激活模式及对应操作提示。
- 未配置模式时保持现有行为不变，确保兼容。

## Core User Stories

### Story US-1: 团队按 TDD 节奏执行 apply

角色：
- 使用 `/dwsp:apply` 的开发者

目标：
- 在执行任务时看到明确的 TDD 步骤，并按步骤推进

业务价值：
- 降低实现偏差，减少返工，提升交付稳定性

关键流程：
- 运行 `/dwsp:apply` 时看到当前为 `superpowers-tdd` 模式
- 指引明确要求先补失败测试，再实现，再回归验证
- 任务推进过程中可持续按同一节奏完成待办

成功标志：
- apply 输出包含可执行的 TDD 步骤
- 开发者无需额外口头约定即可按同一流程执行

### Story US-2: 旧项目不受新模式影响

角色：
- 维护存量项目的开发者

目标：
- 不改配置时继续使用当前 apply 行为

业务价值：
- 平滑升级，不打断现有交付

关键流程：
- 未配置开发模式时，`/dwsp:apply` 输出与原有行为一致
- 显式启用 `superpowers-tdd` 后才切换到 TDD 指引

成功标志：
- 未启用模式的项目行为不变
- 启用模式后行为可预期且可重复

## Release Coverage

### Private Cloud Verification

覆盖故事：
- `US-1`
- `US-2`

覆盖流程：
- `US-1 / 运行 /dwsp:apply 时显示 superpowers-tdd 模式`
- `US-1 / 输出先测后码后验的完整步骤`
- `US-2 / 未配置模式时保持原有 apply 输出`

不通过条件：
- apply 输出看不到模式信息或缺少 TDD 关键步骤
- 未配置模式却出现行为变化

### Customer Environment Verification

覆盖故事：
- `US-1`
- `US-2`

覆盖流程：
- `US-1 / 启用 superpowers-tdd 后输出可按步骤执行`
- `US-2 / 旧项目默认行为不变`

不通过条件：
- 客户环境无法稳定复现模式化输出
- 默认路径与预期兼容性不一致

## Release Evidence Plan

### Private Cloud Verification

Accepted Evidence:
- `AI-run validation passed`
- `Human text confirmation passed`

Recording Rules:
- `Environment`: private-cloud
- `Method`: AI-run validation or human confirmation
- `Result`: passed / failed
- `Covered Stories`: US-1, US-2
- `Covered Flows`: apply mode display, tdd guidance output, default behavior compatibility
- `Evidence Summary`: 记录命令、模式配置与输出对比结论
- `Recorder`: 执行验证者姓名或机器人身份

### Customer Environment Verification

Accepted Evidence:
- `AI-run validation passed`
- `Human text confirmation passed`

Recording Rules:
- `Environment`: customer-environment
- `Method`: AI-run validation or human confirmation
- `Result`: passed / failed
- `Covered Stories`: US-1, US-2
- `Covered Flows`: enabled-mode guidance, default-mode compatibility
- `Evidence Summary`: 记录客户环境运行路径与结果摘要
- `Recorder`: 客户侧或交付侧记录人

## Capabilities

### New Capabilities
- `opsx-apply-development-mode`: 定义 apply 阶段开发模式及 superpowers-tdd 模式行为。

### Modified Capabilities
- `cli-artifact-workflow`: 调整 apply 指令输出，展示并执行开发模式指引。

## Impact

- 影响 apply 指令生成逻辑与相关配置读取。
- 需要补充模式切换与兼容性测试。
- 文档需新增开发模式说明与示例。

## Out of Scope

- 不在本次改动中引入自动生成测试代码能力。
- 不在本次改动中重写现有 schema 结构。
- 不在本次改动中变更 archive/verify 节点行为。
