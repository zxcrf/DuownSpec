## 7. TextInput

**Biz Component**: `ModoInput` → **Fallback**: `antd Input`

### 补偿对比

| Biz 功能 | Tailwind 补偿 |
|---------|--------------|
| filled variant 背景 #EFF4F9 | `variant="filled"` + `bg-[#EFF4F9]` |
| 圆角 2px | `rounded-[2px]` |
| 高度 28px | `h-[28px]` |
| 字号 12px | `text-[12px]` |
| 边框透明（filled 状态） | `border-transparent` / antd Token |
| focus 边框 #3261CE | antd Token 已处理 |

### TSX 示例

```tsx
import { Input } from 'antd'
import type { InputProps } from 'antd'

export function TextInputFallback({ className, ...props }: InputProps) {
  return (
    <Input
      variant="filled"
      {...props}
      className={[
        'h-[28px]',
        'rounded-[2px]',
        'text-[12px]',
        'text-[#242E43]',
        'bg-[#EFF4F9]',
        'placeholder:text-[#79879C]',
        'placeholder:text-[12px]',
        // hover/focus 时保持背景
        'hover:bg-[#EFF4F9]',
        'focus:bg-[#EFF4F9]',
        className ?? '',
      ].join(' ')}
    />
  )
}
```

---

