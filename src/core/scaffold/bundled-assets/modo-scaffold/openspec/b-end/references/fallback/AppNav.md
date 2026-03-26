## 24. AppNav

**Biz Component**: `AppNav` → **Fallback**: `antd Menu (mode="horizontal")`

### 补偿对比

| Biz 功能 | Tailwind 补偿 |
|---------|--------------|
| 高度固定 44px | `[&_.ant-menu]:h-[44px] [&_.ant-menu]:leading-[44px]` |
| 字号 14px | `text-[14px]` |
| 选中加粗 | `[&_.ant-menu-item-selected]:font-medium` |
| 选中底边 2px | `[&_.ant-menu-item-selected::after]:border-b-2` |
| 项间距 40px | `[&_.ant-menu-item]:mx-5` (水平菜单间距通过外边距实现) |

### TSX 示例

```tsx
import { Menu } from 'antd'
import type { MenuProps } from 'antd'

export function AppNavFallback({ items, ...props }: MenuProps) {
  return (
    <div className="border-b border-[#E3E9EF] bg-white px-6">
      <Menu
        mode="horizontal"
        items={items}
        {...props}
        className={[
          'h-[44px]',
          'leading-[44px]',
          'border-b-0',
          '[&_.ant-menu-item]:text-[14px]',
          '[&_.ant-menu-item]:mx-5',
          '[&_.ant-menu-item-selected]:font-medium',
          '[&_.ant-menu-item-selected::after]:border-b-2',
          '[&_.ant-menu-item-active::after]:border-b-2',
        ].join(' ')}
      />
    </div>
  )
}
```

---

