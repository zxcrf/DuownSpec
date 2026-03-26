## 16. ActionGroup

**Biz Component**: `ModoActionGroup` → **Fallback**: `antd Space` + `antd Button[type="link"]`

### 补偿对比

| Biz 功能 | Tailwind 补偿 |
|---------|--------------|
| 文字链接按钮风格 | `type="link"` + `px-0` |
| 操作间分隔符 | `antd Divider type="vertical"` |
| 超过 2 个自动折叠为下拉 | 手动使用 `Dropdown` 实现 |
| 字号 12px | `text-[12px]` |
| 主色 #3261CE | antd Token 已处理 |
| danger 色 #FF4D4F | `danger` prop |

### TSX 示例

```tsx
import { Button, Divider, Dropdown } from 'antd'
import type { MenuProps } from 'antd'

interface Action {
  key: string
  label: string
  danger?: boolean
  disabled?: boolean
  onClick?: () => void
}

interface Props {
  /** 操作列表，超过 maxVisible 时自动折叠 */
  actions: Action[]
  /** 最多展示数量，默认 2 */
  maxVisible?: number
}

export function ActionGroupFallback({ actions, maxVisible = 2 }: Props) {
  const visibleActions = actions.slice(0, maxVisible)
  const hiddenActions = actions.slice(maxVisible)

  const dropdownItems: MenuProps['items'] = hiddenActions.map((action) => ({
    key: action.key,
    label: action.label,
    danger: action.danger,
    disabled: action.disabled,
    onClick: action.onClick,
  }))

  return (
    <div className="flex items-center">
      {visibleActions.map((action, index) => (
        <span key={action.key} className="flex items-center">
          {index > 0 && (
            <Divider
              type="vertical"
              className="mx-[4px] h-[10px] bg-[#E3E9EF]"
            />
          )}
          <Button
            type="link"
            danger={action.danger}
            disabled={action.disabled}
            onClick={action.onClick}
            className={[
              'h-auto',
              'p-0',
              'text-[12px]',
              'shadow-none',
              'min-w-0',
              action.danger ? 'text-red-500' : 'text-[#3261CE]',
            ].join(' ')}
          >
            {action.label}
          </Button>
        </span>
      ))}

      {/* 超出部分折叠为「更多」下拉 */}
      {hiddenActions.length > 0 && (
        <>
          <Divider type="vertical" className="mx-[4px] h-[10px] bg-[#E3E9EF]" />
          <Dropdown menu={{ items: dropdownItems }} trigger={['click']}>
            <Button
              type="link"
              className="h-auto p-0 text-[12px] shadow-none min-w-0 text-[#3261CE]"
            >
              更多
            </Button>
          </Dropdown>
        </>
      )}
    </div>
  )
}
```

---

