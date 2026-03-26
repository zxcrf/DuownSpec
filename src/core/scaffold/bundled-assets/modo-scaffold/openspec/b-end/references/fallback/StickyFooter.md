## 22. StickyFooter

**Biz Component**: `ModoStickyFooter` → **Fallback**: 纯 Tailwind

### 补偿对比

| Biz 功能 | Tailwind 补偿 |
|---------|--------------|
| 固定底部栏 | `fixed bottom-0 left-0 right-0 z-50` |
| 白色背景 + 顶部阴影 | `bg-white shadow-[0_-1px_4px_rgba(0,0,0,0.08)]` |
| 右对齐按钮区 | `flex items-center justify-end gap-2 px-4 py-3` |
| 按钮高度 28px | `h-[28px]` |
| 按钮圆角 2px | `rounded-[2px]` |
| 主按钮无阴影 | `shadow-none` |
| 左侧状态信息区（可选） | `flex items-center gap-2 text-[12px] text-[#79879C]` |

### TSX 示例

```tsx
import { Button } from 'antd'
import type { ReactNode } from 'react'

interface FooterAction {
  key: string
  label: string
  type?: 'primary' | 'default' | 'dashed'
  danger?: boolean
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
}

interface Props {
  actions: FooterAction[]
  /** 左侧状态区内容（可选） */
  statusContent?: ReactNode
  /** 与页面左侧导航宽度对应的偏移（可选） */
  leftOffset?: number
}

export function StickyFooterFallback({ actions, statusContent, leftOffset = 0 }: Props) {
  return (
    // 占位符，防止页面内容被遮挡
    <>
      <div className="h-[52px]" aria-hidden />

      <div
        className="fixed bottom-0 right-0 z-50 bg-white shadow-[0_-1px_4px_rgba(0,0,0,0.08)]"
        style={{ left: leftOffset }}
      >
        <div className="flex items-center justify-between px-4 py-[10px]">
          {/* 左侧状态区 */}
          <div className="flex items-center gap-2 text-[12px] text-[#79879C]">
            {statusContent}
          </div>

          {/* 右侧按钮区 */}
          <div className="flex items-center gap-2">
            {actions.map((action) => (
              <Button
                key={action.key}
                type={action.type ?? 'default'}
                danger={action.danger}
                disabled={action.disabled}
                loading={action.loading}
                onClick={action.onClick}
                className="h-[28px] rounded-[2px] min-w-[72px] shadow-none text-[12px]"
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
```

---

