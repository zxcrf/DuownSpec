# 高密度表格模板 (Data-Dense Grid Template)

基于 Modo 3.0 设计系统的高密度数据管理页面模板。

## 核心特性

- **一屏适配 (One-Screen Adaptive)**：利用 Flex 链条传导逻辑，确保 PageFilter、ModoTable 和 ModoPagination 始终在可视区域内。表格内部自动处理垂直滚动。
- **动态多标签页 (Dynamic Multi-Tabs)**：采用 `ModoTabs` 的 `editable-card` 模式，支持“列表 - 新建 - 编辑”多个标签页并存，提升多任务处理效率。
- **高性能滚动**：内置针对 Ant Design v5 的滚动修复逻辑，通过 `scroll={{ y: '100.1%' }}` 和 CSS `flex: 1` 联动，实现平滑的内部滚动。
- **现代化表单布局**：新建/编辑页采用居中限宽（720px）的水平布局，配以底部固定操作栏，在大屏下拥有更佳的可读性和交互体验。

## 适用场景

- 后台管理系统的核心业务数据列表。
- 需要频繁对比、切换多条记录进行编辑的复杂场景。
- 追求极致空间利用率和专业感的 B 端界面。

## 使用方法

直接复制 `index.tsx` 并根据业务需求修改 `RecordType` 和 `columns` 定义即可。确保项目中已正确引入 `@/components/biz/` 下的基础组件。
