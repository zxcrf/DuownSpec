# ModoTable

一屏自适应表格组件，基于 Ant Design Table 封装。

## 特性

- ✅ Flex 弹性布局，自动填充可用高度
- ✅ 白色表头主题，无分隔线
- ✅ 默认滚动配置 `{ x: 1000, y: 'calc(100% - 40px)' }`
- ✅ 内置分页禁用，需配合 `ModoPagination` 使用
- ✅ 支持 `size` 尺寸变体（`default` 紧凑 36px 行高 / `large` 宽松 58px 行高）

## 引入

```tsx
import { ModoTable } from '@/components/modo-table';
```

## 属性

`ModoTableProps<T>` 继承自 `Omit<TableProps<T>, 'pagination'>`，额外提供：

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `containerClassName` | `string` | - | 容器额外类名 |

以下是常用的继承属性：

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `columns` | `ColumnsType<T>` | - | 表格列配置 |
| `dataSource` | `T[]` | - | 数据源 |
| `rowKey` | `string \| ((record: T) => string)` | - | 行唯一标识 |
| `loading` | `boolean` | `false` | 加载状态 |
| `size` | `'small' \| 'middle' \| 'large'` | - | 尺寸，`large` 使用 58px 行高，其余使用紧凑 36px 行高 |
| `scroll` | `{ x?: number, y?: string \| number }` | `{ x: 1000, y: 'calc(100% - 40px)' }` | 滚动配置，传入值会与默认值合并 |

> **注意**: `pagination` 属性已被移除，请使用 `ModoPagination` 组件实现分页。

## 使用示例

### 基础用法

```tsx
import { ModoTable } from '@/components/modo-table';
import { ModoPagination } from '@/components/modo-pagination';

const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '年龄', dataIndex: 'age', key: 'age' },
];

const data = [
    { id: '1', name: '张三', age: 28 },
    { id: '2', name: '李四', age: 32 },
];

export default function MyPage() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    return (
        <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-white">
            {/* 工具栏 */}
            <div style={{ padding: '10px 16px' }}>
                <Button type="primary">新建</Button>
            </div>

            {/* 表格 */}
            <ModoTable
                columns={columns}
                dataSource={data}
                rowKey="id"
            />

            {/* 分页 */}
            <ModoPagination
                current={page}
                pageSize={pageSize}
                total={100}
                onChange={(p, s) => {
                    setPage(p);
                    setPageSize(s);
                }}
            />
        </div>
    );
}
```

### 大尺寸行高

通过 `size="large"` 将行高切换为宽松的 58px：

```tsx
<ModoTable
    columns={columns}
    dataSource={data}
    rowKey="id"
    size="large"
/>
```

### 自定义滚动

传入的 `scroll` 会与默认值 `{ x: 1000, y: 'calc(100% - 40px)' }` 进行合并，你可以只覆盖需要的属性：

```tsx
<ModoTable
    columns={columns}
    dataSource={data}
    rowKey="id"
    scroll={{ x: 1500 }}  // 仅覆盖 x，y 保持默认
/>
```

## 布局要求

`ModoTable` 需要放置在一个 **flex 弹性容器** 中才能正确撑满高度：

```tsx
<div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-white">
    <ModoTable ... />
</div>
```

## 实现细节

- **容器定位**：外层 `.modo-table` 使用 `flex: 1` + `position: relative`，内部 Ant Design Table Wrapper 通过 `position: absolute; inset: 0` 撑满容器
- **表头固定**：表头 `flex: 0 0 auto` 不参与伸缩，表体 `flex: 1 1 auto` 自适应滚动
- **主题覆盖**：表头背景强制为 `#ffffff`，隐藏列分隔线（`::before` 伪元素）
- **尺寸变体**：通过 CSS Module 类名 `size-default` / `size-large` 控制行高

## 相关组件

- [ModoPagination](../modo-pagination/README.md) - 分页组件
- [PageFilter](../page-filter/README.md) - 筛选组件
