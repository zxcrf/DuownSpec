## 4. Button

**Biz Component**: `ModoButton` → **Fallback**: `antd Button`

### 补偿对比

| Biz 功能 | Tailwind 补偿 |
|---------|--------------|
| 圆角 2px | `rounded-[2px]` |
| 高度 28px | `h-[28px]` |
| 最小宽度 72px | `min-w-[72px]` |
| 无阴影 | `shadow-none` |
| 字号 12px | `text-[12px]` |
| Primary 背景 #3261CE | antd Token 已配置，无需额外处理 |

### TSX 示例

```tsx
import { Button } from 'antd'
import type { ButtonProps } from 'antd'

// 基础样式常量（可抽取为工具函数）
const MODO_BTN_BASE = 'h-[28px] rounded-[2px] min-w-[72px] shadow-none text-[12px]'

/** Primary 按钮 */
export function PrimaryButtonFallback({ children, ...props }: ButtonProps) {
  return (
    <Button
      type="primary"
      {...props}
      className={`${MODO_BTN_BASE} ${props.className ?? ''}`}
    >
      {children}
    </Button>
  )
}

/** Default 按钮（边框风格） */
export function DefaultButtonFallback({ children, ...props }: ButtonProps) {
  return (
    <Button
      {...props}
      className={`${MODO_BTN_BASE} border-[#E3E9EF] text-[#242E43] ${props.className ?? ''}`}
    >
      {children}
    </Button>
  )
}

/** Text/Link 按钮（用于表格操作列） */
export function TextButtonFallback({ children, ...props }: ButtonProps) {
  return (
    <Button
      type="link"
      {...props}
      className={`h-[28px] text-[12px] text-[#3261CE] px-0 shadow-none min-w-0 ${props.className ?? ''}`}
    >
      {children}
    </Button>
  )
}

/** Danger 按钮 */
export function DangerButtonFallback({ children, ...props }: ButtonProps) {
  return (
    <Button
      danger
      {...props}
      className={`${MODO_BTN_BASE} ${props.className ?? ''}`}
    >
      {children}
    </Button>
  )
}
```

---

