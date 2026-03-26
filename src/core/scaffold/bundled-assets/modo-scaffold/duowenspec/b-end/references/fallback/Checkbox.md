## 11. Checkbox

**Biz Component**: `ModoCheckbox` → **Fallback**: `antd Checkbox`

### 补偿对比

| Biz 功能 | Tailwind 补偿 |
|---------|--------------|
| 复选框尺寸 12px | `[&_.ant-checkbox-inner]:w-[12px] [&_.ant-checkbox-inner]:h-[12px]` |
| 圆角 2px | `[&_.ant-checkbox-inner]:rounded-[2px]` |
| 字号 12px | `text-[12px]` |
| 选中背景 #3261CE | antd Token 已处理 |
| 对勾缩放适配 | `[&_.ant-checkbox-inner]:after:w-[4px] [&_.ant-checkbox-inner]:after:h-[7px]` |

### TSX 示例

```tsx
import { Checkbox } from 'antd'
import type { CheckboxProps, CheckboxGroupProps } from 'antd'

export function CheckboxFallback({ className, children, ...props }: CheckboxProps) {
  return (
    <Checkbox
      {...props}
      className={[
        'text-[12px]',
        'text-[#242E43]',
        // 复选框本体 12px
        '[&_.ant-checkbox-inner]:w-[12px]',
        '[&_.ant-checkbox-inner]:h-[12px]',
        '[&_.ant-checkbox-inner]:rounded-[2px]',
        '[&_.ant-checkbox-inner]:border-[#79879C]',
        // 选中对勾缩放
        '[&_.ant-checkbox-inner]:after:w-[4px]',
        '[&_.ant-checkbox-inner]:after:h-[7px]',
        '[&_.ant-checkbox-inner]:after:left-[3px]',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </Checkbox>
  )
}

export function CheckboxGroupFallback({ className, ...props }: CheckboxGroupProps) {
  return (
    <Checkbox.Group
      {...props}
      className={[
        '[&_.ant-checkbox-wrapper]:text-[12px]',
        '[&_.ant-checkbox-inner]:w-[12px]',
        '[&_.ant-checkbox-inner]:h-[12px]',
        '[&_.ant-checkbox-inner]:rounded-[2px]',
        className ?? '',
      ].join(' ')}
    />
  )
}
```

---

