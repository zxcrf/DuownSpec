## 8. TextArea

**Biz Component**: `ModoTextArea` → **Fallback**: `antd Input.TextArea`

### 补偿对比

| Biz 功能 | Tailwind 补偿 |
|---------|--------------|
| filled variant 背景 #EFF4F9 | `variant="filled"` + `bg-[#EFF4F9]` |
| 圆角 2px | `rounded-[2px]` |
| 字号 12px | `text-[12px]` |
| 最小高度 80px | `min-h-[80px]` |
| resize 方向限制 | `resize-y` |

### TSX 示例

```tsx
import { Input } from 'antd'
import type { TextAreaProps } from 'antd/lib/input/TextArea'

export function TextAreaFallback({ className, ...props }: TextAreaProps) {
  return (
    <Input.TextArea
      variant="filled"
      autoSize={{ minRows: 3 }}
      {...props}
      className={[
        'rounded-[2px]',
        'text-[12px]',
        'text-[#242E43]',
        'bg-[#EFF4F9]',
        'min-h-[80px]',
        'resize-y',
        'placeholder:text-[#79879C]',
        'hover:bg-[#EFF4F9]',
        'focus:bg-[#EFF4F9]',
        className ?? '',
      ].join(' ')}
    />
  )
}
```

---

