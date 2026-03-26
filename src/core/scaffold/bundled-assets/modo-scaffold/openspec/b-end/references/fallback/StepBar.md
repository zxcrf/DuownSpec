## 17. StepBar

**Biz Component**: `ModoStepBar` → **Fallback**: `antd Steps`

### 补偿对比

| Biz 功能 | Tailwind 补偿 |
|---------|--------------|
| 步骤圆圈尺寸 20px | `[&_.ant-steps-item-icon]:w-[20px] [&_.ant-steps-item-icon]:h-[20px]` |
| 步骤字号 12px | `[&_.ant-steps-item-title]:text-[12px]` |
| 当前步骤主色 #3261CE | antd Token 已处理 |
| 已完成步骤色 #3261CE | antd Token 已处理 |
| 步骤描述文字 #79879C | `[&_.ant-steps-item-description]:text-[#79879C]` |
| 连接线颜色 #E3E9EF | `[&_.ant-steps-item-tail]:after:bg-[#E3E9EF]` |
| 水平布局 | `direction="horizontal"` |

### TSX 示例

```tsx
import { Steps } from 'antd'
import type { StepsProps } from 'antd'

export function StepBarFallback({ className, ...props }: StepsProps) {
  return (
    <Steps
      size="small"
      {...props}
      className={[
        // 图标尺寸
        '[&_.ant-steps-item-icon]:w-[20px]',
        '[&_.ant-steps-item-icon]:h-[20px]',
        '[&_.ant-steps-item-icon]:leading-[20px]',
        '[&_.ant-steps-item-icon]:text-[12px]',
        // 标题
        '[&_.ant-steps-item-title]:text-[12px]',
        '[&_.ant-steps-item-title]:text-[#242E43]',
        // 描述
        '[&_.ant-steps-item-description]:text-[12px]',
        '[&_.ant-steps-item-description]:text-[#79879C]',
        // 连接线
        '[&_.ant-steps-item-tail]:after:bg-[#E3E9EF]',
        // 等待状态图标色
        '[&_.ant-steps-item-wait_.ant-steps-item-icon]:border-[#E3E9EF]',
        '[&_.ant-steps-item-wait_.ant-steps-item-icon]:text-[#79879C]',
        className ?? '',
      ].join(' ')}
    />
  )
}
```

---

