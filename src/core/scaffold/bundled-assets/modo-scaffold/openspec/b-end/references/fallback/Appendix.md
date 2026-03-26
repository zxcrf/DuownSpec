## 附录：快速参考速查表

### 所有 Fallback 组件汇总

| Role | antd 组件 | 必须的 Tailwind 类（最小集） |
|------|-----------|---------------------------|
| DataTable | `Table` | `[&_.ant-table-thead>tr>th]:bg-[#EFF4F9]` + 行高 + 字号 |
| Filter | `Form` | `grid grid-cols-3` + 标签色 |
| Button | `Button` | `h-[28px] rounded-[2px] min-w-[72px] shadow-none text-[12px]` |
| Tabs | `Tabs` | pill 激活背景 + 隐藏 ink-bar |
| Select | `Select` | `variant="filled"` + `[&_.ant-select-selector]:bg-[#EFF4F9]!` |
| TextInput | `Input` | `variant="filled" h-[28px] rounded-[2px] bg-[#EFF4F9] text-[12px]` |
| TextArea | `Input.TextArea` | `variant="filled" rounded-[2px] bg-[#EFF4F9] text-[12px]` |
| SearchInput | `Input.Search` | `variant="filled"` + affix wrapper 背景 |
| Pagination | `Pagination` | `sticky bottom-0` + 按钮高度/圆角 |
| Checkbox | `Checkbox` | `[&_.ant-checkbox-inner]:w-[12px] [&_.ant-checkbox-inner]:h-[12px]` |
| Radio | `Radio` | `[&_.ant-radio-inner]:w-[12px] [&_.ant-radio-inner]:h-[12px]` |
| Tree | `Tree` | `[&_.ant-tree-title]:text-[12px]` + 缩进 14px + 选中背景 |
| Modal | `Modal` | `classNames.content` rounded + footer 按钮样式 |
| Drawer | `Drawer` | `[&_.ant-drawer-content]:rounded-l-[2px]` + 按钮样式 |
| ActionGroup | `Space` + `Button[link]` | `type="link" px-0 text-[12px]` + Dropdown 折叠 |
| StepBar | `Steps` | icon 20px + 连接线色 + 字号 |
| MetricCard | `Card` + `Statistic` | 48px 图标插槽 + 趋势指示器 |
| ChartPanel | `Card` | 标题区 flex + 底部边框 |
| RankList | `List` | 排名圆圈 + Progress |
| SectionHeader | `Typography.Title` | `relative pl-3` + 伪元素竖条 |
| StickyFooter | 纯 Tailwind | `fixed bottom-0` + 右对齐按钮 |
| ResourceCard | `Card` | `aspect-video` 预览 + hover 缩放 |

### 常见 AntD 内部选择器参考

```
[&_.ant-table-thead>tr>th]   — 表头单元格
[&_.ant-table-tbody>tr>td]   — 表体单元格
[&_.ant-select-selector]     — Select 选择框
[&_.ant-input-affix-wrapper] — Input 带前后缀容器
[&_.ant-checkbox-inner]      — Checkbox 方框
[&_.ant-radio-inner]         — Radio 圆圈
[&_.ant-tabs-tab]            — Tab 标签
[&_.ant-tabs-ink-bar]        — Tab 激活下划线
[&_.ant-modal-content]       — Modal 内容容器
[&_.ant-drawer-content]      — Drawer 内容容器
[&_.ant-pagination-item]     — 分页按钮
[&_.ant-steps-item-icon]     — Steps 图标
[&_.ant-tree-treenode]       — Tree 节点行
[&_.ant-tree-indent-unit]    — Tree 缩进单位
[&_.ant-progress-bg]         — Progress 进度条
```

---

