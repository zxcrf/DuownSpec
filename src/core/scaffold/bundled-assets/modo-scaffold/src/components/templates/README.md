# Modo Adapter Templates

本目录包含 Modo 适配器的标准页面模板。AI 与开发人员应以此作为新页面开发的起点。

## 目录结构
- **[data-dense-grid/](./data-dense-grid/index.tsx)**: 高密度表格模式模板。适用于一屏自适应滚动、动态多标签模式的复杂数据管理页面。
- **[dashboard/](./dashboard/index.tsx)**: 统计看板模式模板。包含用于概览的统计指标卡片、图表和数据大屏页面结构。
- **[gallery-grid/](./gallery-grid/page.tsx)**: 画廊网格模式模板。适用于资源管理、知识集、图片/卡片预览场景。
- **[wizard/](./wizard/index.tsx)**: 分步向导表单模板。适用于复杂的多步骤数据录入、指引流程、审批申请等场景，自带步骤条和吸底操作栏。
- **[console-layout/](./console-layout/Layout.tsx)**: 控制台侧边栏布局模板。
- **[login/](./login/README.md)**: 标准登录/认证页面模板。

## 使用说明
1. **优先参考**：在生成新页面时，AI 代理会检索此目录下的 TSX 结构。
2. **规范集成**：所有模板均已集成 `ModoPage`、`ModoSectionHeader` 等业务组件，并遵循 `DESIGN_SPEC.md` 中的间距和布局规范。
3. **快速复制**：开发者可以直接复制 `page.tsx` 内容并替换数据源进行快速原型开发。
