## 19. ChartPanel

**Biz Component**: `ModoChartPanel` → **Fallback**: `antd Card`

### 补偿对比

| Biz 功能 | Tailwind 补偿 |
|---------|--------------|
| 卡片标题区：左标题 + 右 Actions | `flex items-center justify-between` |
| 标题字号 14px，字色 #242E43 | `text-[14px] text-[#242E43] font-medium` |
| 标题区下边框 | `border-b border-[#E3E9EF] pb-3` |
| 图表区 padding 16px | `p-4` |
| 圆角 2px | `rounded-[2px]` |
| 卡片边框 #E3E9EF | `border border-[#E3E9EF]` |

### TSX 示例

```tsx
import { Card } from 'antd'
import type { ReactNode } from 'react'

interface Props {
  title: string
  /** 右侧操作区（如时间范围选择器、更多按钮等） */
  actions?: ReactNode
  /** 图表内容 */
  children: ReactNode
  /** 额外 className */
  className?: string
  /** 图表区高度，默认 240px */
  chartHeight?: number
}

export function ChartPanelFallback({
  title,
  actions,
  children,
  className,
  chartHeight = 240,
}: Props) {
  return (
    <Card
      bordered
      className={[
        'rounded-[2px]',
        'border-[#E3E9EF]',
        '[&_.ant-card-body]:p-0',
        className ?? '',
      ].join(' ')}
    >
      {/* 标题区 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E3E9EF]">
        <span className="text-[14px] text-[#242E43] font-medium leading-none">
          {title}
        </span>
        {actions && (
          <div className="flex items-center gap-2 text-[12px]">
            {actions}
          </div>
        )}
      </div>

      {/* 图表区 */}
      <div
        className="p-4"
        style={{ height: chartHeight }}
      >
        {children}
      </div>
    </Card>
  )
}
```

---

