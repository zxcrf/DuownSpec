## 25. SideMenu

**Biz Component**: `SideMenu` → **Fallback**: `antd Layout.Sider + Menu (mode="inline")`

### 补偿对比

| Biz 功能 | Tailwind 补偿 |
|---------|--------------|
| Sider 背景色 #F9FBFD | `bg-[#F9FBFD]` |
| 右边框 1px | `border-r border-[#EFF4F9]` |
| Menu 背景透明 | `[&_.ant-menu]:bg-transparent` |
| 一级高度 44px | `[&_.ant-menu-submenu-title]:h-[44px]` 等 |
| 文字色 #4D5E7D | `[&_.ant-menu-item]:text-[#4D5E7D] [&_.ant-menu-submenu-title]:text-[#4D5E7D]` |
| 选中态加粗 | `[&_.ant-menu-item-selected]:font-semibold` |

### TSX 示例

```tsx
import { Layout, Menu } from 'antd'
import type { MenuProps } from 'antd'

const { Sider } = Layout

interface Props extends MenuProps {
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
}

export function SideMenuFallback({ items, collapsed, onCollapse, ...props }: Props) {
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      theme="light"
      width={200}
      collapsedWidth={45}
      className="bg-[#F9FBFD] border-r border-[#EFF4F9] min-h-screen"
    >
      <Menu
        mode="inline"
        items={items}
        {...props}
        className={[
          'bg-transparent',
          'border-r-0',
          '[&_.ant-menu-item]:text-[#4D5E7D]',
          '[&_.ant-menu-submenu-title]:text-[#4D5E7D]',
          '[&_.ant-menu-item-selected]:font-semibold',
          '[&_.ant-menu-item-selected]:bg-[#EFF4F9]',
          '[&_.ant-menu-item]:mb-1',
          '[&_.ant-menu-item]:px-2',
        ].join(' ')}
      />
    </Sider>
  )
}
```
