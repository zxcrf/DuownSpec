# Master Tree-Table Pattern (主从树表模式)

## Overview
主从树表模式是一种经典的 B 端管理界面布局，通过左侧的**树形结构（Master）**定位层级，右侧的**过滤表格（Detail）**展示具体明细。这种模式极大地提升了层级数据的管理效率。

## Application Scenarios
- **资源权限管理**：如菜单管理、功能权限树。
- **组织架构管理**：如部门树 + 员工列表。
- **分类/目录管理**：如商品分类导航 + 规格列表。

## Component Structure

| Component | Role | Responsibility |
|---|---|---|
| **Tree Navigation** | Master | 提供层级视图，支持搜索定位、节点选择、右键快捷操作。 |
| **Page Filter** | Filter | 针对当前选中节点下的数据进行二次筛选（如按名称、状态）。 |
| **Data Table** | Detail | 展示当前节点的数据明细，支持排序、自定义列等。 |
| **Action Toolbar** | Toolbar | 全局或针对表格的操作（如：新建根节点、批量导出）。 |
| **Detail Drawer/Modal** | Editor | 承载明细的编辑和新增表单，减少页面跳转。 |

## Layout Strategy
- **Master Column**: 建议宽度 200px - 280px，固定左侧或支持伸缩。
- **Main Content**: 弹性宽度，承载 Filter + Table。
- **Container**: 整体使用 Shadow 容器承载，背景色建议为项目标准白色背景。

## Interaction Design
1. **联动逻辑**：点击左侧树节点，右侧表格自动刷新为该节点下的明细。
2. **状态同步**：树节点的“新增/删除”应实时同步至树组件。
3. **快捷操作**：支持对树节点进行右键（Context Menu），快速进行“添加子级”、“编辑”、“删除”。
4. **性能优化**：对于超大规模树，建议采用异步加载（Loading on demand）。

## Available Templates
- **Modo Adapter**: [`adapters/modo/templates/master-tree-table`](../adapters/modo/templates/master-tree-table/index.tsx)
