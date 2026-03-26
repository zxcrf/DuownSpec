# Master-Tree-Table Template

## Overview
主从树表模板。常用于菜单管理、权限管理、部门管理等左侧为树形导航，右侧为表格明细的 B 端业务场景。

## Features
- **左侧树形导航**：支持节点选择、展开折叠、右键菜单快捷操作。
- **右侧过滤表格**：集成筛选、工具栏、数据表格和分页。
- **内置 CRUD 模式**：包含抽屉表单实现的创建和编辑流程。
- **标准化样式**：遵循 Modo 设计规范，使用 `ModoPage`, `ModoTree`, `ModoTable` 等核心组件。

## Component Roles
| Role | Component | Description |
|---|---|---|
| Sidebar | `Sider` + `ModoTree` | 树形导航区域 |
| Filter | `PageFilter` | 数据过滤查询 |
| Toolbar | `ModoButton` | 操作触发区域 |
| Grid | `ModoTable` | 数据明细展示 |
| Pagination | `ModoPagination` | 翻页控制 |
| Form | `ModoDrawer` + `Form` | 明细编辑容器 |

## Usage
1. 复制该模板代码。
2. 将 `MOCK_DATA` 替换为实际的服务调用。
3. 根据业务字段调整 `columns` 和 `Form.Item`。
4. 注册到路由即可使用。
