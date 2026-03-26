# ModoDatePicker / ModoRangePicker

基于 Ant Design DatePicker 封装，符合 MODO 3.0 设计规范的日期/日期范围选择器组件。

## 核心特性

- **默认 `variant="filled"`**：填充背景色（`var(--color-fill-2)` = `#EFF4F9`），与 `ModoInput` 视觉一致
- **默认 `suffixIcon`**：使用 `CalendarDuotone`（三级文字色，14px），无需手动传入
- **默认 `separator`**（仅 `ModoRangePicker`）：使用 `SubtractDuotone`（减号形，三级文字色，14px）
- **完整状态样式**：hover / focus / disabled 均已覆盖，通过 CSS 变量与主题联动
- **完全继承** Ant Design DatePicker / RangePicker 所有 Props，可按需覆盖任何默认值

## 组件

| 组件 | 说明 |
|------|------|
| `ModoDatePicker` | 单日期选择器 |
| `ModoRangePicker` | 日期范围选择器（起止日期） |

## 使用方法

```tsx
import { ModoDatePicker, ModoRangePicker } from '@/components/biz/modo-date-picker';
import dayjs from 'dayjs';

// 单日期
<ModoDatePicker
    format="YYYY-MM-DD"
    onChange={(date) => console.log(date)}
/>

// 日期范围
<ModoRangePicker
    defaultValue={[dayjs('2024-01-01'), dayjs('2024-01-31')]}
    format="YYYY-MM-DD"
    onChange={(dates) => console.log(dates)}
/>
```

## 覆盖默认值

所有默认值均可通过 Props 覆盖：

```tsx
// 覆盖图标
<ModoRangePicker suffixIcon={<MyIcon />} separator="-" />

// 使用 outline 变体
<ModoDatePicker variant="outlined" />
```

## 依赖

- `antd` >= 5.x（需支持 `variant` prop）
- `modo-icon`（`CalendarDuotone`、`SubtractDuotone`）
- `classnames`
