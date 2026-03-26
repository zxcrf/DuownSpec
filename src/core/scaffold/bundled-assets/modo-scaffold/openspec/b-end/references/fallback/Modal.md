## 14. Modal

**Biz Component**: `ModoModal` → **Fallback**: `antd Modal`

### 补偿对比

| Biz 功能 | Tailwind 补偿 |
|---------|--------------|
| 圆角 2px | `[&_.ant-modal-content]:rounded-[2px]` |
| 标题字号 14px，字色 #242E43 | `[&_.ant-modal-title]:text-[14px] [&_.ant-modal-title]:text-[#242E43]` |
| 标题区下边框 | `[&_.ant-modal-header]:border-b [&_.ant-modal-header]:border-[#E3E9EF]` |
| Footer 按钮区右对齐 | antd 默认，无需补偿 |
| Footer 按钮高度 28px | `[&_.ant-modal-footer_.ant-btn]:h-[28px]` |
| Footer 按钮圆角 2px | `[&_.ant-modal-footer_.ant-btn]:rounded-[2px]` |
| Footer 按钮无阴影 | `[&_.ant-modal-footer_.ant-btn]:shadow-none` |
| body 字号 12px | `[&_.ant-modal-body]:text-[12px]` |

### TSX 示例

```tsx
import { Modal } from 'antd'
import type { ModalProps } from 'antd'

export function ModalFallback({ className, children, ...props }: ModalProps) {
  return (
    <Modal
      {...props}
      classNames={{
        content: 'rounded-[2px] p-0',
        header: 'px-4 py-3 border-b border-[#E3E9EF] mb-0 rounded-t-[2px]',
        body: 'px-4 py-4 text-[12px] text-[#242E43]',
        footer: 'px-4 py-3 border-t border-[#E3E9EF] mt-0',
        mask: '',
        wrapper: '',
      }}
      className={[
        // 按钮样式补偿
        '[&_.ant-modal-footer_.ant-btn]:h-[28px]',
        '[&_.ant-modal-footer_.ant-btn]:rounded-[2px]',
        '[&_.ant-modal-footer_.ant-btn]:shadow-none',
        '[&_.ant-modal-footer_.ant-btn]:min-w-[72px]',
        '[&_.ant-modal-footer_.ant-btn]:text-[12px]',
        // 标题
        '[&_.ant-modal-title]:text-[14px]',
        '[&_.ant-modal-title]:text-[#242E43]',
        '[&_.ant-modal-title]:font-medium',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </Modal>
  )
}
```

---

