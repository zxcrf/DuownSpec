## 18. MetricCard

**Biz Component**: `ModoMetricCard` → **Fallback**: `antd Card` + `antd Statistic`

### 补偿对比

| Biz 功能 | Tailwind 补偿 |
|---------|--------------|
| 48×48 图标插槽 | `w-[48px] h-[48px] rounded-[2px] flex items-center justify-center` |
| 指标数值字号 24px，bold | `[&_.ant-statistic-content-value]:text-[24px] [&_.ant-statistic-content-value]:font-bold` |
| 指标标签字号 12px，#79879C | `[&_.ant-statistic-title]:text-[12px] [&_.ant-statistic-title]:text-[#79879C]` |
| 趋势指示器（上升/下降） | 手动渲染箭头 + 百分比 |
| 卡片边框 #E3E9EF | `border border-[#E3E9EF]` |
| 卡片圆角 2px | `rounded-[2px]` |
| hover 阴影提升 | `hover:shadow-md transition-shadow` |

### TSX 示例

```tsx
import { Card, Statistic } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import type { ReactNode } from 'react'

interface Props {
  title: string
  value: number | string
  /** 图标插槽，建议 24×24 SVG */
  icon?: ReactNode
  /** 图标背景色，默认 #EBF0FB */
  iconBg?: string
  /** 趋势百分比，正数为上升，负数为下降 */
  trend?: number
  /** 对比基准描述，如「较上月」 */
  trendLabel?: string
  prefix?: string
  suffix?: string
}

export function MetricCardFallback({
  title,
  value,
  icon,
  iconBg = '#EBF0FB',
  trend,
  trendLabel = '较上月',
  prefix,
  suffix,
}: Props) {
  const isUp = trend !== undefined && trend >= 0
  const trendColor = isUp ? '#52C41A' : '#FF4D4F'

  return (
    <Card
      bordered
      className={[
        'rounded-[2px]',
        'border-[#E3E9EF]',
        'hover:shadow-md',
        'transition-shadow',
        'duration-200',
        // 内部样式
        '[&_.ant-card-body]:p-4',
        '[&_.ant-statistic-title]:text-[12px]',
        '[&_.ant-statistic-title]:text-[#79879C]',
        '[&_.ant-statistic-content]:flex',
        '[&_.ant-statistic-content]:items-baseline',
        '[&_.ant-statistic-content-value]:text-[24px]',
        '[&_.ant-statistic-content-value]:font-bold',
        '[&_.ant-statistic-content-value]:text-[#242E43]',
        '[&_.ant-statistic-content-prefix]:text-[14px]',
        '[&_.ant-statistic-content-prefix]:text-[#79879C]',
        '[&_.ant-statistic-content-suffix]:text-[12px]',
        '[&_.ant-statistic-content-suffix]:text-[#79879C]',
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        {/* 48×48 图标插槽 */}
        {icon && (
          <div
            className="w-[48px] h-[48px] rounded-[2px] flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: iconBg }}
          >
            {icon}
          </div>
        )}

        {/* 指标内容 */}
        <div className="flex-1 min-w-0">
          <Statistic
            title={title}
            value={value}
            prefix={prefix}
            suffix={suffix}
          />

          {/* 趋势指示器 */}
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-1">
              {isUp ? (
                <ArrowUpOutlined className="text-[10px]" style={{ color: trendColor }} />
              ) : (
                <ArrowDownOutlined className="text-[10px]" style={{ color: trendColor }} />
              )}
              <span className="text-[12px]" style={{ color: trendColor }}>
                {Math.abs(trend)}%
              </span>
              <span className="text-[12px] text-[#79879C]">{trendLabel}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
```

---

