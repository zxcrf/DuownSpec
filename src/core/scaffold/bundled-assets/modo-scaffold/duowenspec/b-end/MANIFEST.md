# Adapter Manifest: modo

## Meta
- **name**: modo
- **base_library**: antd@6.x
- **css_framework**: tailwindcss
- **framework**: next.js (app-router)
- **icon_library**: modo-icon
- **import_prefix**: `@/components/biz`
- **base_import**: `antd`
- **global_css**: `./components/globals.css`

---

## Component Mapping Table (三级解析)

> **Level 1 (Biz)** → **Level 2 (Fallback)** → **Level 3 (Build from Scratch)**
> Fallback 使用时必须查阅 `./references/fallback/{Role}.md` 获取 Tailwind 补偿

| Role | Biz Component | Biz Import | Fallback | Fallback Import | README |
|------|---------------|------------|----------|-----------------|--------|
| Tabs | ModoTabs | @/components/biz/modo-tabs | Tabs | antd | ./biz_components/modo-tabs/README.md |
| Filter | PageFilter | @/components/biz/page-filter | Form | antd | ./biz_components/page-filter/README.md |
| DataTable | ModoTable | @/components/biz/modo-table | Table | antd | ./biz_components/modo-table/README.md |
| Pagination | ModoPagination | @/components/biz/modo-pagination | Pagination | antd | ./biz_components/modo-pagination/README.md |
| Button | ModoButton | @/components/biz/modo-button | Button | antd | ./biz_components/modo-button/README.md |
| Select | ModoSelect | @/components/biz/modo-select | Select | antd | ./biz_components/modo-select/README.md |
| TextInput | ModoInput | @/components/biz/modo-input | Input | antd | ./biz_components/modo-input/README.md |
| TextArea | ModoTextArea | @/components/biz/modo-input | Input.TextArea | antd | ./biz_components/modo-input/README.md |
| SearchInput | ModoSearch | @/components/biz/modo-input | Input.Search | antd | ./biz_components/modo-input/README.md |
| Tree | ModoTree | @/components/biz/modo-tree | Tree | antd | ./biz_components/modo-tree/README.md |
| Drawer | ModoDrawer | @/components/biz/modo-drawer | Drawer | antd | ./biz_components/modo-drawer/README.md |
| Modal | ModoModal | @/components/biz/modo-modal | Modal | antd | ./biz_components/modo-modal/README.md |
| Checkbox | ModoCheckbox | @/components/biz/modo-checkbox | Checkbox | antd | ./biz_components/modo-checkbox/README.md |
| Radio | ModoRadio | @/components/biz/modo-radio | Radio | antd | ./biz_components/modo-radio/README.md |
| ActionGroup | ModoActionGroup | @/components/biz/modo-action-group | Space | antd | ./biz_components/modo-action-group/README.md |
| ResourceCard | ModoResourceCard | @/components/biz/modo-resource-card | Card | antd | ./biz_components/modo-resource-card/README.md |
| SectionHeader | ModoSectionHeader | @/components/biz/modo-section-header | Typography.Title | antd | ./biz_components/modo-section-header/README.md |
| PageWrapper | ModoPage | @/components/biz/modo-page | -- | -- | ./biz_components/modo-page/README.md |
| Container | ModoContainer | @/components/biz/modo-container | -- | -- | ./biz_components/modo-container/README.md |
| StepBar | ModoSteps | @/components/biz/modo-steps | Steps | antd | ./biz_components/modo-steps/README.md |
| MetricCard | -- | -- | Card + Statistic | antd | -- |
| ChartPanel | -- | -- | Card | antd | -- |
| RankList | -- | -- | -- | -- | -- |
| StickyFooter | -- | -- | -- | -- | -- |
| DatePicker | ModoDatePicker | @/components/biz/modo-date-picker | DatePicker | antd | ./biz_components/modo-date-picker/README.md |
| RangePicker | ModoRangePicker | @/components/biz/modo-date-picker | DatePicker.RangePicker | antd | ./biz_components/modo-date-picker/README.md |
| AppNav | AppNav | @/components/biz/app-nav | Header + Menu | antd | ./biz_components/app-nav/README.md |
| SideMenu | SideMenu | @/components/biz/side-menu | Sider + Menu | antd | ./biz_components/side-menu/README.md |

---

## References (按需查阅)
- **Fallback 样式补偿**: ./references/fallback/{Role}.md (按组件名查找)
  - 例如: DataTable → `./references/fallback/DataTable.md`
  - 例如: Filter → `./references/fallback/Filter.md`
- **设计规范**: ./references/DESIGN_SPEC.md
- **Token（颜色+字体）**: ./references/TOKENS.md
- **主题初始化**: ./references/THEME_CONFIG.md
- ** modo 专属坑点**: ./references/PITFALLS.md
- **布局页面模板 (TSX Templates)**: ./templates/
  - `console-layout` — **核心工作台布局**（Header 44px, Logo 176px, MODO 极简品牌风）
  - `login` — 标准登录页
  - `gallery-grid` — 资源网格页样板
  - `data-dense-grid` — 高密度表格样板（搜索栏 + 表格 + 分页）
  - `dashboard` — 统计看板页（StatCard + 柱状图 + 折线图 + TOP N 排行表）
  - `master-tree-table` — **主从树表样板**（左侧树形导航 + 右侧高密度表格 + 完整 CRUD 流程）
  - `wizard` — 分步向导表单页样板（多步状态展示 + 吸底操作栏 + 滚动正文）
- **通用坑点**: ../../core/references/PITFALLS_COMMON.md

---

## Extra Components（非 Pattern 组件）

以下组件不属于核心 Pattern 的 Role 体系，但保留在 `biz_components/` 中供项目使用：
- `app-nav` — 应用导航组件
- `side-menu` — 侧边栏菜单组件
- `modo-visual-search` — 高级 Token 化聚合搜索组件
- `modo-page` — 页面包装容器组件
- `modo-container` — 带灰色背景的通用容器组件
- `modo-resource-card` — 资源网格中的核心卡片组件
- `modo-section-header` — 带品牌装饰条的分段标题
- `modo-date-picker` — 封装 DatePicker / RangePicker，默认 filled 变体 + CalendarDuotone 图标 + SubtractDuotone 分隔符
