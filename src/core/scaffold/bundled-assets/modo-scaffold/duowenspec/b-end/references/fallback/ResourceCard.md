## 23. ResourceCard

**Biz Component**: `ModoResourceCard` → **Fallback**: `antd Card`

### 补偿对比

| Biz 功能 | Tailwind 补偿 |
|---------|--------------|
| 16:9 预览图区域 | `aspect-video overflow-hidden rounded-t-[2px]` |
| 预览图 cover 填充 | `w-full h-full object-cover` |
| 信息区 padding | `px-3 py-2` |
| 卡片圆角 2px | `rounded-[2px]` |
| 卡片边框 #E3E9EF | `border border-[#E3E9EF]` |
| hover 整体阴影提升 | `hover:shadow-lg transition-shadow duration-200` |
| hover 预览图轻微缩放 | `group-hover:scale-105 transition-transform duration-300` |
| 标题字号 13px，字色 #242E43 | `text-[13px] text-[#242E43]` |
| 描述字号 12px，#79879C | `text-[12px] text-[#79879C]` |
| 标签区 | `flex flex-wrap gap-1` |
| 底部操作行 | `flex items-center justify-between` |

### TSX 示例

```tsx
import { Card, Tag } from 'antd'
import type { ReactNode } from 'react'

interface Props {
  /** 16:9 预览图 URL */
  coverUrl?: string
  /** 预览图占位内容（coverUrl 为空时显示） */
  coverFallback?: ReactNode
  title: string
  description?: string
  tags?: string[]
  /** 底部左侧元数据（如作者、时间等） */
  meta?: ReactNode
  /** 底部右侧操作区 */
  actions?: ReactNode
  onClick?: () => void
  className?: string
}

export function ResourceCardFallback({
  coverUrl,
  coverFallback,
  title,
  description,
  tags,
  meta,
  actions,
  onClick,
  className,
}: Props) {
  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      bordered
      className={[
        'rounded-[2px]',
        'border-[#E3E9EF]',
        'overflow-hidden',
        'hover:shadow-lg',
        'transition-shadow',
        'duration-200',
        'group', // 用于子元素 group-hover
        '[&_.ant-card-body]:p-0',
        '[&_.ant-card-cover]:m-0',
        onClick ? 'cursor-pointer' : 'cursor-default',
        className ?? '',
      ].join(' ')}
      cover={
        // 16:9 预览图区域
        <div className="relative aspect-video overflow-hidden bg-[#EFF4F9]">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            // 无图占位
            <div className="w-full h-full flex items-center justify-center text-[#79879C]">
              {coverFallback ?? (
                <span className="text-[12px]">暂无预览</span>
              )}
            </div>
          )}
        </div>
      }
    >
      {/* 信息区 */}
      <div className="px-3 py-2">
        {/* 标题 */}
        <p className="text-[13px] text-[#242E43] font-medium mb-1 line-clamp-1 leading-[20px]">
          {title}
        </p>

        {/* 描述 */}
        {description && (
          <p className="text-[12px] text-[#79879C] mb-2 line-clamp-2 leading-[18px]">
            {description}
          </p>
        )}

        {/* 标签区 */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.map((tag) => (
              <Tag
                key={tag}
                className="rounded-[2px] text-[11px] text-[#3261CE] bg-[#EBF0FB] border-[#C5D3F5] leading-[18px] px-[6px]"
              >
                {tag}
              </Tag>
            ))}
          </div>
        )}

        {/* 底部操作行 */}
        {(meta || actions) && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E3E9EF]">
            <div className="text-[12px] text-[#79879C]">{meta}</div>
            <div className="flex items-center gap-1">{actions}</div>
          </div>
        )}
      </div>
    </Card>
  )
}
```

---

