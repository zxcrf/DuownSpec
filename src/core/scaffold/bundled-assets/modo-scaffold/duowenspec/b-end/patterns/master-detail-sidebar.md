# [Pattern: Master-Detail Sidebar] (主从分栏)

## 场景定义
用于详情页面的信息展示与编辑，强调主内容区与侧边辅助信息的协同浏览。

## 1. 布局定义 (Layout Definition)
- **布局名称**：`Master-Detail-Sidebar-Layout` (主从分栏布局)
- **核心逻辑**：左右分栏 (`Two-Column Split`)。左侧主内容区占据主要视觉空间，右侧固定宽度侧边栏提供辅助信息或快捷操作。

## 2. 结构框架 (Structure Framework)
- **Master Area (主内容区)**：占据左侧约 70%-75% 宽度，承载详情信息的主体内容，支持纵向滚动。
- **Detail Sidebar (详情侧边栏)**：固定在右侧，宽度通常为 `280px-320px`，展示关联信息、操作历史或快捷功能入口。
- **Sticky Header (吸顶标题栏)**：位于主内容区顶部，包含页面标题、面包屑导航及主要操作按钮，滚动时保持吸顶。

## 3. 组件清单 (Component List)

### Page Header (页面头部)
- **面包屑 (Breadcrumb)**：展示当前页面在系统中的层级路径，支持快速返回上级。
- **标题区 (Title Area)**：
  - **主标题**：使用大号字体，展示当前详情对象名称。
  - **副标题/状态**：可选，展示对象编码或当前状态徽标。
- **[ActionGroup] (操作按钮组)**：右对齐，包含"编辑"、"删除"、"导出"等主要操作。

### Detail Content (详情内容)
- **Section Card (分段卡片)**：
  - **结构**：白色背景卡片，内部按业务逻辑分段。
  - **标题**：每个分段带有 [SectionHeader]，品牌色竖条装饰。
  - **字段展示**：采用 `Label-Value` 对的形式，通常为双列布局。
- **Description List (描述列表)**：
  - **Label**：灰色次级文本，左对齐。
  - **Value**：主文本色，支持文本、链接、徽标等多种类型。

### Sidebar (侧边栏)
- **Sticky Sidebar (吸附侧边栏)**：固定在右侧，随主内容滚动时保持在可视区域内 (`position: sticky`)。
- **常见模块**：
  - **Quick Actions (快捷操作)**：常用操作的图标按钮组。
  - **Related Items (关联项)**：展示关联的其他对象列表。
  - **Activity Timeline (活动时间线)**：展示操作历史或变更记录。
  - **Metadata (元数据)**：创建时间、更新时间、创建人等系统信息。

### Role 汇总表

| Role | 说明 | 必选 |
|------|------|------|
| [SectionHeader] | 分段标题 | Yes |
| [ActionGroup] | 操作按钮组 | Optional |
| [Button] | 操作按钮 | Yes |
