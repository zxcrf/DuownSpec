## 3. Filter

**Biz Component**: `ModoFilter` → **Fallback**: `antd Form`

### 补偿对比

| Biz 功能 | Tailwind 补偿 |
|---------|--------------|
| 行内布局 3 列 Grid | `grid grid-cols-3 gap-x-4 gap-y-2` |
| 标签文字色 #79879C | `[&_.ant-form-item-label>label]:text-[#79879C]` |
| 标签字号 12px | `[&_.ant-form-item-label>label]:text-[12px]` |
| 操作按钮右对齐 | `col-span-3 flex justify-end gap-2` |
| 选中条件 Tag 展示区 | 手动渲染 `antd Tag` 列表 |
| 容器背景白色+下边框 | `bg-white border-b border-[#E3E9EF] px-4 py-3` |

### TSX 示例

```tsx
import { Form, Input, Select, Button, Tag, Space } from 'antd'

interface FilterValue {
  [key: string]: unknown
}

interface Props {
  onSearch: (values: FilterValue) => void
  onReset: () => void
  /** 已激活的筛选条件，用于 Tag 展示 */
  activeFilters?: { label: string; key: string }[]
  onRemoveFilter?: (key: string) => void
}

export function FilterFallback({ onSearch, onReset, activeFilters = [], onRemoveFilter }: Props) {
  const [form] = Form.useForm<FilterValue>()

  return (
    <div className="bg-white border-b border-[#E3E9EF] px-4 py-3">
      <Form
        form={form}
        onFinish={onSearch}
        layout="inline"
        className={[
          // 3 列 Grid 布局
          '[&_.ant-form]:grid [&_.ant-form]:grid-cols-3 [&_.ant-form]:gap-x-4 [&_.ant-form]:gap-y-2',
          // 标签样式
          '[&_.ant-form-item-label>label]:text-[12px]',
          '[&_.ant-form-item-label>label]:text-[#79879C]',
          // 控件高度统一
          '[&_.ant-input]:h-[28px]',
          '[&_.ant-select-selector]:h-[28px]!',
        ].join(' ')}
      >
        {/* 示例筛选项，按需替换 */}
        <Form.Item label="关键词" name="keyword">
          <Input
            variant="filled"
            placeholder="请输入"
            className="h-[28px] text-[12px] bg-[#EFF4F9] rounded-[2px]"
          />
        </Form.Item>

        <Form.Item label="状态" name="status">
          <Select
            variant="filled"
            placeholder="请选择"
            className="[&_.ant-select-selector]:bg-[#EFF4F9]! [&_.ant-select-selector]:rounded-[2px]!"
            options={[
              { label: '启用', value: 'active' },
              { label: '禁用', value: 'inactive' },
            ]}
          />
        </Form.Item>

        {/* 操作按钮行：占满第 3 列并右对齐 */}
        <Form.Item className="col-span-1 flex justify-end mb-0">
          <Space size={8}>
            <Button
              onClick={onReset}
              className="h-[28px] rounded-[2px] min-w-[72px] shadow-none text-[12px]"
            >
              重置
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="h-[28px] rounded-[2px] min-w-[72px] shadow-none text-[12px]"
            >
              查询
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {/* 已选筛选条件 Tag 展示区 */}
      {activeFilters.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {activeFilters.map((f) => (
            <Tag
              key={f.key}
              closable
              onClose={() => onRemoveFilter?.(f.key)}
              className="rounded-[2px] text-[12px] text-[#3261CE] bg-[#EBF0FB] border-[#C5D3F5]"
            >
              {f.label}
            </Tag>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

