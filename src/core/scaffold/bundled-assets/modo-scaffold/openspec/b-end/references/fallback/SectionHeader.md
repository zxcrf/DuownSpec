## 21. SectionHeader

**Biz Component**: `ModoSectionHeader` → **Fallback**: `antd Typography.Title`

### 补偿对比

| Biz 功能 | Tailwind 补偿 |
|---------|--------------|
| 蓝色左侧竖条装饰 | `before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[3px] before:bg-[#3261CE] before:rounded-[2px]` |
| 标题字号 14px | `text-[14px]` |
| 字色 #242E43 | `text-[#242E43]` |
| 右侧操作区 | `flex items-center justify-between` |
| 底部分割线 | `border-b border-[#E3E9EF] pb-3 mb-4` |

### TSX 示例

```tsx
import type { ReactNode } from 'react'

interface Props {
  title: string
  /** 右侧操作区 */
  extra?: ReactNode
  /** 是否显示底部分割线，默认 true */
  divider?: boolean
  className?: string
}

export function SectionHeaderFallback({ title, extra, divider = true, className }: Props) {
  return (
    <div
      className={[
        'flex items-center justify-between',
        divider ? 'border-b border-[#E3E9EF] pb-3 mb-4' : 'mb-3',
        className ?? '',
      ].join(' ')}
    >
      {/* 蓝色竖条 + 标题 */}
      <div className="relative flex items-center pl-3">
        {/* 左侧蓝色竖条 */}
        <span className="absolute left-0 top-[2px] bottom-[2px] w-[3px] bg-[#3261CE] rounded-[2px]" />
        <span className="text-[14px] text-[#242E43] font-medium leading-none">
          {title}
        </span>
      </div>

      {/* 右侧操作区 */}
      {extra && (
        <div className="flex items-center gap-2 text-[12px]">
          {extra}
        </div>
      )}
    </div>
  )
}
```

---

