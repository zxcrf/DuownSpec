## 15. Drawer

**Biz Component**: `ModoDrawer` → **Fallback**: `antd Drawer`

### 补偿对比

| Biz 功能 | Tailwind 补偿 |
|---------|--------------|
| 圆角 2px（左侧） | `[&_.ant-drawer-content]:rounded-l-[2px]` |
| 标题字号 14px | `[&_.ant-drawer-title]:text-[14px]` |
| 标题区下边框 | `[&_.ant-drawer-header]:border-b [&_.ant-drawer-header]:border-[#E3E9EF]` |
| body 字号 12px | `[&_.ant-drawer-body]:text-[12px]` |
| footer 按钮补偿 | 同 Modal |

### TSX 示例

```tsx
import { Drawer } from 'antd'
import type { DrawerProps } from 'antd'

export function DrawerFallback({ className, children, ...props }: DrawerProps) {
  return (
    <Drawer
      {...props}
      classNames={{
        header: 'border-b border-[#E3E9EF]',
        body: 'text-[12px] text-[#242E43]',
        footer: 'border-t border-[#E3E9EF]',
      }}
      className={[
        // 圆角（从左侧抽出时圆角在左）
        '[&_.ant-drawer-content]:rounded-l-[2px]',
        // 标题
        '[&_.ant-drawer-title]:text-[14px]',
        '[&_.ant-drawer-title]:text-[#242E43]',
        '[&_.ant-drawer-title]:font-medium',
        // Footer 按钮
        '[&_.ant-drawer-footer_.ant-btn]:h-[28px]',
        '[&_.ant-drawer-footer_.ant-btn]:rounded-[2px]',
        '[&_.ant-drawer-footer_.ant-btn]:shadow-none',
        '[&_.ant-drawer-footer_.ant-btn]:min-w-[72px]',
        '[&_.ant-drawer-footer_.ant-btn]:text-[12px]',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </Drawer>
  )
}
```

---

