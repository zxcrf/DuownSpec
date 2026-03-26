# Dashboard 统计看板模板

基于 MODO 3.0 设计系统的数据统计工作台页面模板，适用于后台管理系统的数据概览页。

## 核心特性

- **统计卡片区（StatCard）**：2 行 × 4 列网格，图标 + 标签 + 数值 + 单位，支持多色彩 iconBg 配色
- **柱状图区（SimpleBar + ChartCard）**：并排双图布局，固定 300px 高度，支持日期范围筛选
- **折线趋势图**：外部自定义图例（规避 Recharts 内部布局限制），节点小圆点，无纵向分割线
- **TOP N 排行表（ModoTable）**：金银铜勋章 + 调用次数排序，使用 `ModoTable` 保证样式一致
- **设计系统色彩全覆盖**：Tailwind 类使用语义 token（`text-text-1`、`border-border-1` 等），JS 图表色常量对应 `globals.css` 设计变量

## 适用场景

- 管理后台工作台首页
- 数据资产 / 知识库 / 平台运营统计概览
- 需要统计卡片 + 多类图表 + 排行榜组合的看板页面

## 使用方法

1. 复制 `index.tsx` 到目标项目 `src/app/(main)/dashboard/page.tsx`
2. 安装依赖：`bun add recharts`
3. 确保 `@/components/biz/modo-date-picker` 和 `@/components/biz/modo-table` 已就位
4. 将 `// ① Mock Data` 区域替换为真实 API 数据请求
5. 按业务调整统计卡片的图标、标签、单位

## 子组件说明

| 组件 | 文件内定义 | 说明 |
|------|-----------|------|
| `StatCard` | 模板内 | 统计卡片，含图标/标签/数值/单位 |
| `ChartCard` | 模板内 | 图表容器，含标题和可选日期范围选择器 |
| `SimpleBar` | 模板内 | 单色柱状图封装，基于 Recharts BarChart |
| `RankBadge` | 模板内 | 金/银/铜及普通排名徽章 |
| `ModoRangePicker` | `biz_components/modo-date-picker` | 日期范围选择器 |
| `ModoTable` | `biz_components/modo-table` | 数据表格 |

## 图表颜色 Token

```ts
const BLUE   = '#3261CE'; // --color-modo-6      品牌蓝
const TEAL   = '#35C9C0'; // --color-cyan-6       青色
const PURPLE = '#724BC5'; // --color-purple-6     紫色
const ORANGE = '#E2682F'; // --color-orangered-6  橙红
const GREEN  = '#55BC8A'; // --color-green-6      绿色
```

## 依赖

- `recharts` >= 2.x
- `dayjs`
- `antd` >= 5.x
- `modo-icon`
- `@/components/biz/modo-date-picker`
- `@/components/biz/modo-table`
