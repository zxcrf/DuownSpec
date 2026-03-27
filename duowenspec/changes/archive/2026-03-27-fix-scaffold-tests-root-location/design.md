## Context

`duowenspec init --scaffold` 当前会在脚手架中产出 `src/tests`，与团队期望的根目录 `tests` 不一致。该问题属于单点行为偏差，但影响初始化后的第一步使用体验，并可能在不同项目中反复出现手工修正。

## Goals / Non-Goals

**Goals:**
- 将 `--scaffold` 产物中的测试目录固定为项目根目录 `tests`。
- 确保不再生成 `src/tests`。
- 用自动化校验防止该行为回退。

**Non-Goals:**
- 不调整 `tests` 内部文件组织方式。
- 不改动除测试目录位置外的其他脚手架布局规则。
- 不引入新的业务模板或框架能力。

## Decisions

- 在现有脚手架清单/路径映射中，将测试目录目标路径统一映射为根目录 `tests`。
  - Rationale: 直接修正输出结果，改动面小，且与现有脚手架生成链路兼容。
  - Alternative: 保留 `src/tests` 并通过文档解释。Rejected，因为无法消除初始化后的额外整理成本。
- 为目录结构增加显式断言：根目录存在 `tests`，且 `src/tests` 不存在。
  - Rationale: 目录位置变更易被后续模板调整误伤，断言可提供稳定回归保护。
  - Alternative: 仅做一次人工验收。Rejected，因为无法持续防回退。
- 路径处理坚持跨平台方式（使用路径 API 与分隔符无关的断言）。
  - Rationale: 该命令运行于 macOS/Linux/Windows，路径相关验证必须跨平台稳定。

## Risks / Trade-offs

- [Risk] 现有测试或模板条目仍引用 `src/tests`，导致局部失败或残留目录。  
  → Mitigation: 同步更新引用点并加入“不得存在 `src/tests`”断言。
- [Risk] 其他目录映射可能与测试目录路径耦合。  
  → Mitigation: 将本次变更限制在测试目录映射，保持其余路径规则不变并回归验证。

## Migration Plan

1. 更新脚手架目录映射并调整相关模板引用。
2. 更新/新增自动化断言覆盖 `tests` 与 `src/tests` 两个条件。
3. 执行 init/scaffold 相关测试，并在临时目录做一次真实初始化检查。
4. 若出现回归，回滚到前一版本映射并保留失败证据用于二次修复。

## Open Questions

- 无。当前需求边界清晰，仅涉及目录位置修正与回归保护。
