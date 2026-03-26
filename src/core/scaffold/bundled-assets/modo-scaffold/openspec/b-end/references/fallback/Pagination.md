## 10. Pagination

**Biz Component**: `ModoPagination` → **Fallback**: `antd Pagination`

### 补偿对比

| Biz 功能 | Tailwind 补偿 |
|---------|--------------|
| 固定在容器底部 | `sticky bottom-0` + `bg-white border-t border-[#E3E9EF]` |
| 左对齐 | `flex justify-start` |
| 字号 12px | `[&_.ant-pagination]:text-[12px]` |
| 按钮高度 24px | `[&_.ant-pagination-item]:h-[24px]` |
| 按钮圆角 2px | `[&_.ant-pagination-item]:rounded-[2px]` |
| 显示总条数（左侧） | `showTotal` prop |

### TSX 示例

```tsx
import { Pagination } from 'antd'
import type { PaginationProps } from 'antd'

interface Props extends PaginationProps {
  /** 是否吸底固定 */
  sticky?: boolean
}

export function PaginationFallback({ sticky = true, className, ...props }: Props) {
  return (
    <div
      className={[
        // 吸底固定
        sticky ? 'sticky bottom-0 left-0 right-0 z-10' : '',
        'bg-white px-4 py-2',
        'border-t border-[#E3E9EF]',
        'flex items-center justify-between',
        className ?? '',
      ].join(' ')}
    >
      {/* 左侧总条数 */}
      <span className="text-[12px] text-[#79879C]">
        共 {props.total ?? 0} 条
      </span>

      <Pagination
        showSizeChanger
        showQuickJumper
        size="small"
        {...props}
        className={[
          '[&_.ant-pagination-item]:h-[24px]',
          '[&_.ant-pagination-item]:min-w-[24px]',
          '[&_.ant-pagination-item]:leading-[22px]',
          '[&_.ant-pagination-item]:rounded-[2px]',
          '[&_.ant-pagination-item]:text-[12px]',
          '[&_.ant-pagination-item-active]:bg-[#3261CE]',
          '[&_.ant-pagination-item-active]:border-[#3261CE]',
          '[&_.ant-pagination-prev_.ant-pagination-item-link]:rounded-[2px]',
          '[&_.ant-pagination-next_.ant-pagination-item-link]:rounded-[2px]',
          '[&_.ant-pagination-prev_.ant-pagination-item-link]:h-[24px]',
          '[&_.ant-pagination-next_.ant-pagination-item-link]:h-[24px]',
          '[&_.ant-select-selector]:h-[24px]!',
          '[&_.ant-select-selector]:rounded-[2px]!',
          '[&_.ant-select-selection-item]:text-[12px]',
          '[&_.ant-select-selection-item]:leading-[22px]',
        ].join(' ')}
      />
    </div>
  )
}
```

---

