## 5. Tabs

**Biz Component**: `ModoTabs` → **Fallback**: `antd Tabs`

### 补偿对比

| Biz 功能 | Tailwind 补偿 |
|---------|--------------|
| Pill/Chip 胶囊风格 | `[&_.ant-tabs-tab]:rounded-[2px]` + 激活背景色 |
| 激活 Tab 背景 #EBF0FB | `[&_.ant-tabs-tab-active]:bg-[#EBF0FB]` |
| 激活 Tab 文字 #3261CE | `[&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:text-[#3261CE]` |
| 默认 Tab 文字 #79879C | `[&_.ant-tabs-tab]:text-[#79879C]` |
| 无下划线墨水条 | `[&_.ant-tabs-ink-bar]:hidden` |
| 字号 12px | `[&_.ant-tabs-tab]:text-[12px]` |
| Tab 间距收紧 | `[&_.ant-tabs-nav-list]:gap-1` |
| 首个 Tab 特殊高亮 | 通过 `first-of-type` 伪类或手动 className |

### TSX 示例

```tsx
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'

export function TabsFallback({ items, ...props }: TabsProps) {
  return (
    <Tabs
      items={items}
      {...props}
      className={[
        // Tab 标签基础样式
        '[&_.ant-tabs-tab]:rounded-[2px]',
        '[&_.ant-tabs-tab]:text-[12px]',
        '[&_.ant-tabs-tab]:text-[#79879C]',
        '[&_.ant-tabs-tab]:px-3',
        '[&_.ant-tabs-tab]:py-[4px]',
        '[&_.ant-tabs-tab]:mx-0',
        '[&_.ant-tabs-tab]:transition-colors',
        // 激活态
        '[&_.ant-tabs-tab-active]:bg-[#EBF0FB]',
        '[&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:text-[#3261CE]!',
        '[&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:font-medium',
        // 隐藏墨水条
        '[&_.ant-tabs-ink-bar]:hidden',
        // 隐藏底部边框线
        '[&_.ant-tabs-nav]:before:border-0',
        '[&_.ant-tabs-nav]:border-b-0',
        // Tab 列表间距
        '[&_.ant-tabs-nav-list]:gap-1',
        props.className ?? '',
      ].join(' ')}
    />
  )
}
```

---

