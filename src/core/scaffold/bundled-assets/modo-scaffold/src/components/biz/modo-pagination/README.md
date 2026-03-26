# ModoPagination

分页组件，基于 Ant Design Pagination 封装，适用于一屏自适应布局。

## 特性

- ✅ 统一的底部栏样式（背景色 `#F9FBFD`）
- ✅ 预设默认值：`showSizeChanger`、`showQuickJumper`、`showTotal`
- ✅ 与 `ModoTable` 配合使用

## 引入

```tsx
import { ModoPagination } from '@/components/modo-pagination';
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `current` | `number` | - | 当前页码 |
| `pageSize` | `number` | - | 每页条数 |
| `total` | `number` | - | 总条数 |
| `onChange` | `(page: number, pageSize: number) => void` | - | 页码变化回调 |
| `showSizeChanger` | `boolean` | `true` | 是否显示每页条数选择器 |
| `showQuickJumper` | `boolean` | `true` | 是否显示快速跳转 |
| `showTotal` | `(total: number) => ReactNode` | `(total) => '共 ${total} 条'` | 总数显示函数 |
| `containerClassName` | `string` | - | 容器额外类名 |
| 其他 | - | - | 继承 Ant Design `PaginationProps` |

## 使用示例

### 基础用法

```tsx
import { ModoPagination } from '@/components/modo-pagination';

const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(10);

<ModoPagination
    current={page}
    pageSize={pageSize}
    total={100}
    onChange={(p, s) => {
        setPage(p);
        setPageSize(s);
    }}
/>
```

### 自定义总数显示

```tsx
<ModoPagination
    current={page}
    pageSize={pageSize}
    total={100}
    showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
    onChange={(p, s) => {
        setPage(p);
        setPageSize(s);
    }}
/>
```

### 隐藏快速跳转

```tsx
<ModoPagination
    current={page}
    pageSize={pageSize}
    total={100}
    showQuickJumper={false}
    onChange={(p, s) => {
        setPage(p);
        setPageSize(s);
    }}
/>
```

## 样式

分页组件自带以下样式：

| 样式属性 | 值 | 说明 |
|----------|-----|------|
| 背景色 | `#F9FBFD` | 浅灰蓝色背景 |
| 内边距 | `10px 16px` | 上下10px，左右16px |
| 对齐方式 | `flex-start` | 左对齐 |

## 相关组件

- [ModoTable](../modo-table/README.md) - 表格组件
