## 9. SearchInput

**Biz Component**: `ModoSearchInput` → **Fallback**: `antd Input.Search`

### 补偿对比

| Biz 功能 | Tailwind 补偿 |
|---------|--------------|
| filled variant 背景 #EFF4F9 | `variant="filled"` + 输入区背景 |
| 圆角 2px | `[&_.ant-input-affix-wrapper]:rounded-[2px]!` |
| 高度 28px | `[&_.ant-input-affix-wrapper]:h-[28px]!` |
| 搜索图标色 #79879C | `[&_.anticon-search]:text-[#79879C]` |
| 字号 12px | `[&_.ant-input]:text-[12px]` |
| 无右侧搜索按钮（纯图标） | `enterButton={false}` |

### TSX 示例

```tsx
import { Input } from 'antd'
import type { SearchProps } from 'antd/lib/input'

export function SearchInputFallback({ className, ...props }: SearchProps) {
  return (
    <Input.Search
      variant="filled"
      allowClear
      {...props}
      className={[
        // affix wrapper（外层）
        '[&_.ant-input-affix-wrapper]:bg-[#EFF4F9]!',
        '[&_.ant-input-affix-wrapper]:rounded-[2px]!',
        '[&_.ant-input-affix-wrapper]:h-[28px]!',
        '[&_.ant-input-affix-wrapper]:border-0!',
        // 内层 input
        '[&_.ant-input]:bg-transparent',
        '[&_.ant-input]:text-[12px]',
        '[&_.ant-input]:text-[#242E43]',
        // 图标色
        '[&_.anticon-search]:text-[#79879C]',
        '[&_.anticon-close-circle]:text-[#79879C]',
        className ?? '',
      ].join(' ')}
    />
  )
}
```

---

