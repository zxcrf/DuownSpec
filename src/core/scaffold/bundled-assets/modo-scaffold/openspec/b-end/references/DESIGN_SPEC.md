# modo Design Specification (设计规范)

本文档定义了 modo 设计系统的全局原则、关键 Token 以及工程实现标准。

---

## 1. 设计宪法 (Design Principles)

### 1.1 交互规范
- **圆角规范**：全局统一使用 **2px** (Border Radius Small)。
- **字体规范**：基础文字大小为 **12px**，高信息密度对齐。
- **阴影体系**：
    - **一级 (Low)**: `0 2px 5px #242E431A`。适用于卡片默认、PageFilter 等底层容器。
    - **二级 (Middle)**: `0 4px 10px #242E431A`。适用于悬停状态、下拉菜单等常规交互。
    - **三级 (High)**: `0 8px 20px #242E431A`。适用于对话框、通知等顶层浮动元素。
    - **特殊 (None)**: 按钮组件强制**无阴影** (`box-shadow: none`)。

### 1.2 输入与控件规范
- **默认风格 (Filled)**：所有输入类组件 (`Input`, `Select`, `DatePicker`) 默认使用 `variant="filled"`。
- **复选框 (Checkbox)**: 尺寸锁定为 **12px** (Global & Tree & Table)，圆角 **2px**。
- **单选框 (Radio)**: 尺寸锁定为 **12px**。
- **标签与 Token (Tag/SearchToken)**: 
    - 高密度场景（如搜索组件、表格内标签）统一高度为 **20px** (`h-5`)。
    - 圆角统一为 **10px** (`rounded-[10px]`)。
    - 字号统一为 **12px** (`text-[12px]`)。

### 1.3 按钮规范 (Button)
- **最小宽度**: **72px** (默认)。
- **例外场景**: 图标按钮 (`icon` only)、圆形按钮 (`shape="circle"`)、文本按钮 (`type="text"`)、链接按钮 (`type="link"`) **不设最小宽度**。
- **内边距**: 圆形与图标按钮 Padding 为 **0**。

---

## 2. 核心变量速查 (Core Tokens Reference)

### 2.1 颜色定义 (Color Palettes)

| 语义名称 | 色值 (Hex) | 对应 Token | 用途 |
| :--- | :--- | :--- | :--- |
| **品牌蓝** | `#3261CE` | `colorPrimary` | 主按钮、激活态、链接 |
| **一级文字** | `#242E43` | `colorText` (`text-text-1`) | 核心正文、主要标题 |
| **二级文字** | `#4D5E7D` | `colorTextSecondary` (`text-text-2`) | 辅助信息、次要正文、图标 |
| **三级文字** | `#79879C` | `colorTextTertiary` (`text-text-3`) | 描述、副标题、占位符 |
| **四级文字** | `#B3C0CC` | `colorTextQuaternary` (`text-text-4`) | 禁用状态文字、极弱输入提示 |
| **浅色边框** | `#E3E9EF` | `colorBorder` (`border-border-1`) | 描边、分割线、Tab 边框 |
| **浅填充背景** | `#EFF4F9` | `colorFillAlter` (`bg-fill-2`) | **Input/Tree 背景** (Neutral-2) |
| **页面底层** | `#F9FBFD` | `colorBgLayout` (`bg-bg-1`) | 页面 body 背景、卡片悬停背景 |

### 2.2 尺寸定义 (Sizes)

| 级别 | 高度 | 组件参数 | 适用场景 |
| :--- | :--- | :--- | :--- |
| **Mini** | 24px | `size="small"` | 紧凑表格内按钮 |
| **Small** | **28px** | **Default** | **modo 标准表单、普通按钮** |
| **Medium** | 32px | `size="large"` | 核心操作、头部工具栏 |

---

## 3. 业务组件库 (Biz Components)

| 组件名称 | 目录 | 说明 | 规范链接 |
| :--- | :--- | :--- | :--- |
| **ModoButton** | `modo-button` | 定制圆角(2px)、高度(28px)、语义色的标准按钮 | [README](../biz_components/modo-button/README.md) |
| **ModoInput** | `modo-input` | 强制 `filled` 风格且背景色为 `#EFF4F9` 的输入框（含 ModoTextArea / ModoSearch） | [README](../biz_components/modo-input/README.md) |
| **ModoSelect** | `modo-select` | 强制 `filled` 风格且背景色为 `#EFF4F9` 的下拉框 | [README](../biz_components/modo-select/README.md) |
| **ModoTree** | `modo-tree` | **12px 紧凑布局**，**12x12 Switcher 容器**，0px 元素间距 | [README](../biz_components/modo-tree/README.md) |
| **PageFilter** | `page-filter` | **Inline 布局**，3 列网格，4px 内部间距，带筛选 Tag | [README](../biz_components/page-filter/README.md) |
| **ModoTable** | `modo-table` | 一屏自适应、表头无分割线的一体化表格 | [README](../biz_components/modo-table/README.md) |
| **ModoPagination** | `modo-pagination` | 统一底部栏样式，预设 showSizeChanger / showTotal，配合 ModoTable 使用 | [README](../biz_components/modo-pagination/README.md) |
| **ModoTabs** | `modo-tabs` | Pill/Chip 风格标签页，一屏自适应，首个标签特殊样式 | [README](../biz_components/modo-tabs/README.md) |
| **ModoActionGroup** | `modo-action-group` | 表格操作列按钮组，支持自动折叠 (>2 个) | [README](../biz_components/modo-action-group/README.md) |

---

## 5. 布局规范 (Layout Standards)

- **PageFilter 布局**：始终使用 **`layout="inline"`**，保持水平流式排版。
- **一屏适配**：主内容区（Table/Grid/Tree）必须通过 `flex: 1` 填充，禁用 Body 滚动。
- **头部操作栏 (Header Actions)**：
    - 聚合搜索组件 (`ModoVisualSearch`) 与后续操作按钮（如“新建”）之间的间距统一为 **10px** (`gap-[10px]`)。
    - 垂直对齐方式：居中对齐 (`items-center`)。
- **微观间距**：
    - 复选框左内边距 **4px**；
    - 图标宽度 **16px** 且右内边距 **12px**；
    - 操作组按钮间距 **4px**，内边距 **0px 4px**。

---

## 6. 维护原则
1. **源码同步**：适配器中的组件必须与实际项目实现保持绝对一致。
2. **Token 集约**：优先使用 `ConfigProvider` 进行全局 Token 注入。
3. **视觉闭环**：UI 细节如果不符合本规范，视为 Bug 需进行修正。

---

## 7. 布局模式与组件推荐 (Layout-to-Component)

为确保全站视觉一致性，AI 在实现以下 Pattern 时应优先选择对应组件：

- **[Pattern: Gallery Grid] (画廊网格模式)**：
    *   **核心卡片**：强烈推荐使用 `ModoResourceCard`，它已内置了 10px 间距和 MODO 状态影子规范。
    *   **头部标题**：应使用 `ModoSectionHeader` + `icon` 属性。
    *   **搜索组件**：必须使用 `ModoVisualSearch` 实现 Token 化聚合搜索。

## 8. 全局框架规范 (Shell & Header Layout)

为确保工作台基座的一致性，`ConsoleLayout` / `WorkbenchLayout` 必须遵循：
- **Header 外观**: 高度 **44px**，背景 `F9FBFD` (Neutral-1)，底部边框 `E3E9EF` (Border-1)。
- **Logo 区域**: 宽度 **176px**，Logo 图片高度建议 **32px**。
- **垂直分割线**: 位于 Logo 与导航之间，宽度 **1px**，高度 **14px**，颜色 `E3E9EF` (Border-1)。
- **导航区域 (`AppNav`)**: 距离分割线左间距 **8px** (`!ml-2`)。
- **右侧工具区**: 
    - 通知图标容器：**28px x 28px** 圆形，背景 `EFF4F9` (Fill-2)，图标字号 **14px**。
    - 区域间距：工具区与账户触发区间距 **12px**。
- **账户触发区**:
    - **左内边距 0px** (`!pl-0`)，右内边距 8px (`pr-2`)。
    - 头像尺寸：锁定为 **28px** (含 `min-width`)，内部图标 **14px**。
    - 文本排版：
        - 用户名：字号 **14px**，Medium，行高 **14px**，下边距 **2px**。
        - 团队名：字号 **12px**，颜色 `79879C` (Text-3)，行高 **12px**。
- **用户下拉菜单**:
    - 菜单内首项（用户信息）：下边距 **10px**，头像 **28px**，文本行高均为 **18px**。

## 9. 参考模板
各布局模式对应的标准 TSX 脚手架代码见：[templates/](../templates/)
