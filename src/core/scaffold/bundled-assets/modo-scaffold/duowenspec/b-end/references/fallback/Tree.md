## 13. Tree

**Biz Component**: `ModoTree` → **Fallback**: `antd Tree`

### 补偿对比

| Biz 功能 | Tailwind 补偿 |
|---------|--------------|
| 紧凑 12px 字号 | `[&_.ant-tree-title]:text-[12px]` |
| 缩进 14px | `[&_.ant-tree-indent-unit]:w-[14px]` |
| 行高 24px | `[&_.ant-tree-treenode]:min-h-[24px]` |
| 选中背景 #EBF0FB | `[&_.ant-tree-node-selected]:bg-[#EBF0FB]!` |
| 选中文字 #3261CE | `[&_.ant-tree-node-selected_.ant-tree-title]:text-[#3261CE]` |
| 展开图标色 #79879C | `[&_.ant-tree-switcher]:text-[#79879C]` |
| hover 背景 #F5F8FF | `[&_.ant-tree-treenode:hover]:bg-[#F5F8FF]` |

### TSX 示例

```tsx
import { Tree } from 'antd'
import type { TreeProps } from 'antd'

export function TreeFallback({ className, ...props }: TreeProps) {
  return (
    <Tree
      blockNode
      {...props}
      className={[
        // 字号 12px，紧凑缩进
        '[&_.ant-tree-title]:text-[12px]',
        '[&_.ant-tree-title]:text-[#242E43]',
        '[&_.ant-tree-indent-unit]:w-[14px]',
        '[&_.ant-tree-treenode]:min-h-[24px]',
        '[&_.ant-tree-treenode]:py-[2px]',
        '[&_.ant-tree-treenode]:px-[4px]',
        // 展开图标
        '[&_.ant-tree-switcher]:text-[#79879C]',
        '[&_.ant-tree-switcher]:w-[14px]',
        // 选中态
        '[&_.ant-tree-node-selected]:bg-[#EBF0FB]!',
        '[&_.ant-tree-node-selected_.ant-tree-title]:text-[#3261CE]',
        '[&_.ant-tree-node-selected_.ant-tree-title]:font-medium',
        // hover 态
        '[&_.ant-tree-treenode:hover_.ant-tree-node-content-wrapper]:bg-[#F5F8FF]',
        className ?? '',
      ].join(' ')}
    />
  )
}
```

---

