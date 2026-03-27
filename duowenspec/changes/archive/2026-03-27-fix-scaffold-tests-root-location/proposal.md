## Why

当前 `duowenspec init --scaffold` 生成的目录里，`tests` 被放在 `src/tests`，与项目期望结构不一致。这个偏差会让团队在初始化后立刻做手工搬迁，增加出错和重复成本。

## What Changes

- 调整 `init --scaffold` 的目录生成规则：`tests` 必须位于项目根目录。
- 停止生成 `src/tests` 目录。
- 补充对应校验，确保后续修改不会把 `tests` 放回 `src`。

## Core User Stories

### Story US-1: 初始化后直接得到正确目录结构

角色：
- 使用 `duowenspec init --scaffold` 初始化新项目的开发者

目标：
- 初始化完成后，直接获得可用且符合约定的目录结构

业务价值：
- 减少初始化后的人工整理步骤，降低目录结构不一致导致的协作成本

关键流程：
- 开发者执行 `duowenspec init <path> --scaffold`
- 初始化结束后检查项目目录
- 在根目录看到 `tests`，且 `src/tests` 不存在

成功标志：
- 新生成项目根目录包含 `tests`
- 初始化产物中不再出现 `src/tests`

### Story US-2: 变更后行为可持续稳定

角色：
- 维护脚手架能力的开发者与测试人员

目标：
- 在后续迭代中持续保证 `tests` 目录位置不回退

业务价值：
- 降低回归风险，减少因目录结构变动造成的隐性故障

关键流程：
- 维护者更新脚手架代码
- 自动校验执行目录结构断言
- 校验在 `tests` 回退到 `src/tests` 时失败

成功标志：
- 自动校验覆盖“根目录存在 tests”与“src/tests 不存在”
- 相关回归在本地和流水线都可被及时发现

## Release Coverage

### Private Cloud Verification

覆盖故事：
- `US-1`
- `US-2`

覆盖流程：
- `US-1 / 开发者执行 duowenspec init <path> --scaffold`
- `US-1 / 在根目录看到 tests，且 src/tests 不存在`
- `US-2 / 自动校验在 tests 回退到 src/tests 时失败`

不通过条件：
- 初始化后 `tests` 不在根目录
- 初始化后仍出现 `src/tests`

### Customer Environment Verification

覆盖故事：
- `US-1`

覆盖流程：
- `US-1 / 开发者执行 duowenspec init <path> --scaffold`
- `US-1 / 在根目录看到 tests，且 src/tests 不存在`

不通过条件：
- 客户环境执行后目录结构与预期不一致
- 观察结果与故事成功标志冲突

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
- `Covered Flows`: init scaffold、目录检查、回归断言
- `Evidence Summary`: 记录初始化目录树与测试结论
- `Recorder`: 执行并记录的人

### Customer Environment Verification

Accepted Evidence:
- `AI-run validation passed`
- `Human text confirmation passed`

Recording Rules:
- `Environment`: customer-environment
- `Method`: AI-run validation or human confirmation
- `Result`: passed / failed
- `Covered Stories`: US-1
- `Covered Flows`: init scaffold、目录检查
- `Evidence Summary`: 记录客户环境目录检查结果
- `Recorder`: 执行并记录的人

## Capabilities

### New Capabilities

### Modified Capabilities
- `cli-init`: 修改现有初始化目录生成要求，使 `--scaffold` 产物中 `tests` 固定位于项目根目录，且不得生成 `src/tests`。

## Impact

- 受影响命令：`duowenspec init --scaffold`
- 受影响区域：脚手架目录映射与相关验证用例
- 受影响结果：新建项目的目录结构

## Out of Scope

- 不调整测试框架和测试文件命名策略
- 不扩展其他目录布局规则（除 `tests` 目录位置外）
- 不引入新的脚手架业务内容
