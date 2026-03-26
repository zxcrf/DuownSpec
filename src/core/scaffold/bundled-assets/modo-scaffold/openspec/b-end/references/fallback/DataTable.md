## 2. DataTable

**Biz Component**: `ModoDataTable` → **Fallback**: `antd Table`

### 补偿对比

| Biz 功能 | Tailwind 补偿 |
|---------|--------------|
| 单屏自适应（表格占满剩余高度） | `[&_.ant-table-wrapper]:h-full` + 父容器 `flex flex-col` |
| 表头无分割线 | `[&_.ant-table-thead>tr>th]:border-b-0` |
| 默认行高 36px（紧凑） | `[&_.ant-table-tbody>tr>td]:py-[6px]` |
| 展开行高 58px | `[&_.ant-table-tbody>tr.ant-table-row-expanded>td]:py-[11px]` |
| 表头底色 #EFF4F9 | `[&_.ant-table-thead>tr>th]:bg-[#EFF4F9]` |
| 表头字色 #79879C | `[&_.ant-table-thead>tr>th]:text-[#79879C]` |
| 行 hover 背景 | `[&_.ant-table-tbody>tr:hover>td]:bg-[#F0F5FF]` |
| 无外边框 | `[&_.ant-table]:border-0` |
| 表头字号 12px | `[&_.ant-table-thead>tr>th]:text-[12px]` |
| 大尺寸 58px 行高 | `[&_.ant-table-tbody>tr>td]:py-[10px] [&_.ant-table-tbody>tr>td]:h-[58px]` |

### TSX 示例

```tsx
import { Table } from 'antd'
import type { TableProps } from 'antd'

interface Props<T> {
  columns: TableProps<T>['columns']
  dataSource: T[]
  loading?: boolean
  rowKey: string
  /** 是否开启单屏自适应，父容器需为 flex 列方向 */
  fillHeight?: boolean
  /** 尺寸，支持 default (紧凑 36px) | large (宽松 58px) */
  size?: 'default' | 'large'
}

export function DataTableFallback<T extends object>({
  columns,
  dataSource,
  loading,
  rowKey,
  fillHeight = true,
  size = 'small',
}: Props<T>) {
  // Determine row height padding based on size
  const rowPaddingClass = size === 'large' 
    ? '[&_.ant-table-tbody>tr>td]:py-[10px] [&_.ant-table-tbody>tr>td]:h-[58px]'
    : '[&_.ant-table-tbody>tr>td]:py-[6px]';

  return (
    // 外层容器：单屏自适应时需占满父容器剩余高度
    <div className={fillHeight ? 'flex-1 overflow-hidden flex flex-col' : ''}>
      <Table<T>
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowKey={rowKey}
        size="small"
        scroll={fillHeight ? { y: 'calc(100vh - 280px)' } : undefined}
        pagination={false} // 分页由 Pagination 组件单独处理
        className={[
          // 表头样式补偿
          '[&_.ant-table-thead>tr>th]:bg-[#EFF4F9]',
          '[&_.ant-table-thead>tr>th]:text-[#79879C]',
          '[&_.ant-table-thead>tr>th]:text-[12px]',
          '[&_.ant-table-thead>tr>th]:font-normal',
          '[&_.ant-table-thead>tr>th]:border-b-0',
          '[&_.ant-table-thead>tr>th]:py-[7px]',
          // 表体行高补偿
          rowPaddingClass,
          '[&_.ant-table-tbody>tr>td]:text-[12px]',
          '[&_.ant-table-tbody>tr>td]:text-[#242E43]',
          // 行 hover
          '[&_.ant-table-tbody>tr:hover>td]:bg-[#F0F5FF]',
          // 去掉外边框
          '[&_.ant-table]:border-0',
          '[&_.ant-table-container]:border-0',
          // 圆角
          '[&_.ant-table]:rounded-[2px]',
        ].join(' ')}
      />
    </div>
  )
}
```

---

