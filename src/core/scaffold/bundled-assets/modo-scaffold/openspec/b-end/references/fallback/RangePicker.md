## RangePicker

**Biz Component**: `ModoRangePicker` → **Fallback**: `antd DatePicker.RangePicker`

### 补偿对比

| Biz 功能 | Tailwind 补偿 |
|---------|--------------|
| filled variant 背景 #EFF4F9 | `variant="filled"` + `[&_.ant-picker]:bg-[#EFF4F9]!` |
| 圆角 2px | `[&_.ant-picker]:rounded-[2px]!` |
| 高度 28px | `[&_.ant-picker]:h-[28px]!` |
| 字号 12px | `[&_.ant-picker-input>input]:text-[12px]` |
| SubtractDuotone 分隔符 | 使用 `separator={<SubtractDuotone width="1em" height="1em" />}` |
| placeholder 色 #79879C | `[&_.ant-picker-input>input::placeholder]:text-[#79879C]` |

### TSX 示例

```tsx
import { DatePicker } from 'antd'
import type { RangePickerProps } from 'antd/es/date-picker'

const { RangePicker } = DatePicker

export function RangePickerFallback(props: RangePickerProps) {
  return (
    <RangePicker
      variant="filled"
      {...props}
      className={[
        '[&_.ant-picker]:bg-[#EFF4F9]!',
        '[&_.ant-picker]:rounded-[2px]!',
        '[&_.ant-picker]:h-[28px]!',
        '[&_.ant-picker]:border-0!',
        '[&_.ant-picker-input>input]:text-[12px]',
        '[&_.ant-picker-input>input]:text-[#242E43]',
        '[&_.ant-picker-input>input::placeholder]:text-[#79879C]',
        props.className ?? '',
      ].join(' ')}
    />
  )
}
```

---
