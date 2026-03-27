## 1. Apply 模式配置与解析

- [x] 1.1 定义 apply 开发模式配置结构，支持 `superpowers-tdd` 与默认空模式。
- [x] 1.2 在 apply 指令生成路径中解析并校验开发模式，未知模式返回清晰错误。
- [x] 1.3 为模式解析补充单元测试（含未配置、已配置、非法值）。

## 2. 指令输出与行为落地

- [x] 2.1 在 `duowenspec instructions apply` 文本输出中注入 `superpowers-tdd` 三段式指引（先失败测试、再最小实现、再验证）。
- [x] 2.2 在 JSON 输出中新增 `developmentMode` 字段，并确保未配置时为 `null`。
- [x] 2.3 补充 apply 指令输出测试，覆盖默认模式与 `superpowers-tdd` 模式。

## 3. 文档与回归验证

- [x] 3.1 更新用户文档，说明如何启用 `superpowers-tdd` 以及默认兼容行为。
- [x] 3.2 运行测试与命令行验证，确认未启用模式时输出不变、启用后输出包含 TDD 步骤。
- [x] 3.3 进行跨平台验证（至少覆盖 Windows/Linux/macOS 的路径与输出兼容性检查）。
