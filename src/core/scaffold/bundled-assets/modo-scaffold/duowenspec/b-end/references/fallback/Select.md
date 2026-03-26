## 6. Select

**Biz Component**: `ModoSelect` → **Fallback**: `antd Select`

### 补偿对比

| Biz 功能 | Tailwind 补偿 |
|---------|--------------|
| filled variant 背景 #EFF4F9 | `variant="filled"` + `[&_.ant-select-selector]:bg-[#EFF4F9]!` |
| 圆角 2px | `[&_.ant-select-selector]:rounded-[2px]!` |
| 高度 28px | `[&_.ant-select-selector]:h-[28px]!` |
| 字号 12px | `[&_.ant-select-selection-item]:text-[12px]` |
| placeholder 色 #79879C | `[&_.ant-select-selection-placeholder]:text-[#79879C]` |
| 下拉项字号 12px | `[&_.ant-select-item]:text-[12px]` |

### TSX 示例

```tsx
import { Select } from 'antd'
import type { SelectProps } from 'antd'

export function SelectFallback<T = unknown>({ className, ...props }: SelectProps<T>) {
  return (
    <Select<T>
      variant="filled"
      {...props}
      className={[
        // selector 背景和圆角
        '[&_.ant-select-selector]:bg-[#EFF4F9]!',
        '[&_.ant-select-selector]:rounded-[2px]!',
        '[&_.ant-select-selector]:h-[28px]!',
        '[&_.ant-select-selector]:border-0!',
        // 文字样式
        '[&_.ant-select-selection-item]:text-[12px]',
        '[&_.ant-select-selection-item]:text-[#242E43]',
        '[&_.ant-select-selection-item]:leading-[28px]',
        '[&_.ant-select-selection-placeholder]:text-[#79879C]',
        '[&_.ant-select-selection-placeholder]:text-[12px]',
        '[&_.ant-select-selection-placeholder]:leading-[28px]',
        className ?? '',
      ].join(' ')}
    />
  )
}
```

---

