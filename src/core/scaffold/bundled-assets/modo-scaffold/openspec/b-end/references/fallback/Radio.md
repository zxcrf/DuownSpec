## 12. Radio

**Biz Component**: `ModoRadio` → **Fallback**: `antd Radio`

### 补偿对比

| Biz 功能 | Tailwind 补偿 |
|---------|--------------|
| Radio 尺寸 12px | `[&_.ant-radio-inner]:w-[12px] [&_.ant-radio-inner]:h-[12px]` |
| 内点缩放适配 | `[&_.ant-radio-inner]:after:w-[6px] [&_.ant-radio-inner]:after:h-[6px]` |
| 字号 12px | `text-[12px]` |
| 选中色 #3261CE | antd Token 已处理 |

### TSX 示例

```tsx
import { Radio } from 'antd'
import type { RadioProps, RadioGroupProps } from 'antd'

export function RadioFallback({ className, children, ...props }: RadioProps) {
  return (
    <Radio
      {...props}
      className={[
        'text-[12px]',
        'text-[#242E43]',
        // Radio 本体 12px
        '[&_.ant-radio-inner]:w-[12px]',
        '[&_.ant-radio-inner]:h-[12px]',
        '[&_.ant-radio-inner]:border-[#79879C]',
        // 选中内点缩放
        '[&_.ant-radio-inner]:after:w-[6px]',
        '[&_.ant-radio-inner]:after:h-[6px]',
        '[&_.ant-radio-inner]:after:top-[2px]',
        '[&_.ant-radio-inner]:after:left-[2px]',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </Radio>
  )
}

export function RadioGroupFallback({ className, ...props }: RadioGroupProps) {
  return (
    <Radio.Group
      {...props}
      className={[
        '[&_.ant-radio-wrapper]:text-[12px]',
        '[&_.ant-radio-inner]:w-[12px]',
        '[&_.ant-radio-inner]:h-[12px]',
        className ?? '',
      ].join(' ')}
    />
  )
}
```

---

