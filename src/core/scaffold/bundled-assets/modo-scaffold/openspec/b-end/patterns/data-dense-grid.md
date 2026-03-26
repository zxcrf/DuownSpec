# [Pattern: Data-Dense Grid] (高密度表格)

## 场景定义
用于承载海量业务数据的列表管理，通过多维筛选、高效展示与分页流转，支持用户快速定位目标记录。

## 1. 布局定义 (Layout Definition)
- **布局名称**：`Data-Dense-Grid-Layout` (高密度列表布局)
- **核心逻辑**：一屏布局 (`Dynamic Flex Context`)。页面高度自适应，筛选区保持高度弹性，中部表格区自动填充剩余空间并开启内部滚动。

## 2. 结构框架 (Structure Framework)
- **[Tabs] (页面标签栏)**：位于页面最顶端，用于多页签切换与内容组织。
- **[Filter] (筛选区)**：提供多种条件组合筛选，底部配有已选条件标签（Tag）展示。
- **Action Bar (业务按钮区)**：位于筛选区下方，左侧放置业务动作按钮（如：新建、批量导出），右侧通常预留显示设置入口。
- **[DataTable] (自适应表格)**：表格容器开启 `flex-1` 与 `overflow-hidden`，表头（Header）吸顶，表体（Body）随数据量开启纵向滚动。
- **[Pagination] (固定分页)**：底部分页条始终可见，与表格主体共同构成完整的管理界面。
- **Layout Troubleshooting**：若表格数据存在（分页可见）但表格区域空白，请确保：
  1. 父容器包含 `relative` 定位和显式高度（或 `flex-1`）。
  2. 表格容器开启 `overflow-hidden`。
  3. `[DataTable]` 组件的滚动高度属性应设为 `100%` 或具体的像素值（如 `calc(100vh - 200px)`）。

## 3. 组件清单 (Component List)

### [Tabs] (页面标签栏)
- **容器样式**：
  - **背景色**：容器背景色。
  - **底部边框**：`1px` 实线（浅色边框色），用于与下方内容分割。
- **标签项 (Tab Item)**：
  - **选中态 (Active)**：白色背景 + 顶部/底部高亮线条（品牌色）+ 加粗文字。
  - **默认态 (Default)**：灰色背景 + 灰色文字。
  - **关闭操作**：选中标签右侧显示 `x` 图标，Hover 时高亮。

### [Filter] (页面筛选器)
> **⚠️ 强约束 (Dictionary & Constants):**
> 任何用于下拉选择 (`[Filter]`) 的状态映射代码，**绝对禁止**直接内联写在 `page.tsx` 中。必须且只能从 `src/lib/constants.ts` 中引出的常量构建。

- **常用控件组合**：下拉筛选 ([Select])、日期范围 (DateRange)。
- **排列逻辑**：基于表单栅格自左向右排列，最后预留操作按钮组 ("查询"和"重置")。
- **已选条件**：在筛选按钮下方展示当前生效的所有条件 Tag。

### [ActionGroup] (业务按钮组)
- **位置策略**：
  - **主操作**：左对齐（如"+ 新建"、"批量导出"）。
  - **视图操作**：(可选) 右对齐（如"刷新"、"设置"）。

### [DataTable] (数据表格)
> **⚠️ 强约束 (Dictionary & Constants):**
> 表格渲染用到的状态字典 (`STATUS_MAP` 等) 必须且只能从 `src/lib/constants.ts` 中 import。

#### 1. Table Container (基础表格容器)
- 支持不同密度的信息展示。
- **High (高表格模式)**：行高固定 `58px`（双行文本/头像等）。
- **Compact (默认模式)**：行高固定 `36px`（单行纯文本高密度）。

#### 2. Table Header (表头组件)
- 包含 `[Checkbox]` 全选复选框，位于最左侧。包含 Sorter (排序器)。

#### 3. Cell Types (单元格组件类型)
- **Double-Line Text Cell**: 双行文本（名称+补充信息）。
- **Status Badge Cell**: 状态徽标单元格（Success/Processing/Disabled）。
- **Action Cell**: 操作列单元格，固定在最右侧。提供纯文本按钮。

### [Pagination] (分页组件)
- **位置**：页面最底部。吸底 (Sticky Bottom)。

### Role 汇总表

| Role | 说明 | 必选 |
|------|------|------|
| [Tabs] | 页面标签栏 | Yes |
| [Filter] | 页面筛选器 | Yes |
| [ActionGroup] | 业务按钮组 | Optional |
| [DataTable] | 自适应数据表格 | Yes |
| [Checkbox] | 全选复选框 | Yes (within DataTable) |
| [Pagination] | 固定分页 | Yes |
| [Button] | 操作按钮 | Yes |
| [Select] | 下拉选择器 | Yes (within Filter) |
