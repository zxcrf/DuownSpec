# Reasoning Engine (B-End Logic)

触发词 → 模式匹配规则。AI 根据用户输入的关键词匹配最合适的 Layout Pattern。

---

### 1. [Pattern: Dashboard] (统计看板/Bento 仪表盘)
- **Triggers**: Dashboard, Analytics, 仪表盘, 概览, 统计, 看板, 首页, 数据大屏.

### 2. [Pattern: Data-Dense Grid] (高密度表格)
- **Triggers**: List, Inventory, Management, Table, 列表, 表格, 管理, 库存, 订单, 明细.

### 3. [Pattern: Sequential Wizard Stepper] (分步向导)
- **Triggers**: Wizard, Step, Setup, 向导, 步骤, 引导, 分步, 初始化, 新建流程.

### 4. [Pattern: Master-Detail Sidebar] (主从分栏)
- **Triggers**: Detail, Settings, Configuration, 详情, 设置, 配置, 属性, 侧边预览.

### 5. [Pattern: Gallery Grid] (卡片目录)
- **Triggers**: Gallery, Card, Resource, 卡片, 资源, 预览, 目录, 素材库, 模板.

### 6. [Pattern: Console Layout] (控制台框架)
- **Triggers**: Console, Layout, Frame, 框架, 控制台, 外层导航, 菜单.

---

## 消歧机制 (Disambiguation)

**当用户输入无法精准命中单一 Pattern 时（如输入模棱两可、匹配多个 Pattern、或完全未命中），必须执行以下流程：**

1. 读取 `core/wireframes/` 下的 ASCII 线框图和 `adapters/{name}/preview/` 下的 PNG 设计图。
2. **优先使用 PNG 设计图**展示给用户（通过 Read 工具读取 `*.png` 文件可直接展示图片）。若环境不支持图片，则回退到 ASCII 线框图。
3. 将候选 Pattern 的预览**完整展示**给用户，格式如下：
   ```
   您的需求可能匹配以下布局模式，请选择最合适的一个：

   [1] Dashboard (统计看板)
   <展示 preview/Dashboard.png 设计图>

   [2] Data-Dense Grid (高密度表格)
   <展示 preview/Grid.png 设计图>

   ...
   ```
4. **等待用户明确选择后**，再继续后续的 Implementation Instructions 流程。
5. 若用户选择后仍有疑问，可追问细化需求，但**禁止在未确认 Pattern 的情况下直接生成代码**。
6. **确认 Pattern 后**，实现过程中应持续参照对应的 PNG 设计图作为视觉对标基准。
