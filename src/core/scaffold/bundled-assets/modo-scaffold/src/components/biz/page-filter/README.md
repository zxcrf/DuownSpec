# PageFilter

页面筛选组件，用于列表页面的条件筛选。

## 特性

- ✅ 默认显示前 3 个筛选项，更多可折叠
- ✅ 已选条件以 Tag 形式展示
- ✅ 支持单个条件移除
- ✅ 平滑的展开/收起动画
- ✅ 统一的筛选卡片样式

## 引入

```tsx
import { PageFilter } from '@/components/page-filter';
```

## 属性

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `form` | `FormInstance` | ✅ | Ant Design Form 实例 |
| `onSearch` | `(values: Record<string, any>) => void` | ✅ | 搜索回调 |
| `onReset` | `() => void` | ✅ | 重置回调 |
| `searchParams` | `Record<string, any>` | ✅ | 当前筛选参数 |
| `setSearchParams` | `(params: Record<string, any>) => void` | ✅ | 更新筛选参数 |
| `labelMap` | `Record<string, string>` | ✅ | 字段名到显示标签的映射 |
| `valueMap` | `Record<string, Record<string, any>>` | - | 字段值到显示文本的映射（用于下拉选择等） |
| `children` | `ReactNode` | ✅ | 筛选表单项 |

## 交互规范

### 布局

- 筛选项按 3 列布局（每列 `span={8}`）
- 默认显示前 3 个筛选项
- 超过 3 个时显示"更多筛选"按钮

### 按钮 (Buttons)

所有操作按钮**必须**使用 `ModoButton` 组件，以确保在筛选区域内具有统一的高度、内边距和圆角样式。

| 按钮 | 组件类型 | 图标 | 功能 |
|------|----------|------|------|
| **查询** | `ModoButton` (primary) | **无** | 执行搜索（保持视觉简洁） |
| 重置 | `ModoButton` (text) | `BroomDuotone` (或 `BrushColorIcon`) | 清空所有筛选条件 |
| 更多筛选 | `ModoButton` (text) | `FilterDuotone` (或 `FilterColorIcon`) | 展开/收起更多筛选项 |
| 清空已选 | `ModoButton` (link) | 无 | 清除所有已选条件的 Tag |

### 已选条件

- 位置：筛选区域底部
- 样式：带关闭按钮的 Tag
- 交互：点击 Tag 的关闭按钮移除该条件并立即刷新搜索

## 使用示例

### 基础用法

```tsx
import { PageFilter } from '@/components/page-filter';
import { Form, Input, Select } from 'antd';

const [form] = Form.useForm();
const [searchParams, setSearchParams] = useState({});

const handleSearch = (values) => {
    console.log('搜索条件:', values);
    // 调用 API 加载数据
};

const handleReset = () => {
    // 重新加载数据
};

<PageFilter
    form={form}
    onSearch={handleSearch}
    onReset={handleReset}
    searchParams={searchParams}
    setSearchParams={setSearchParams}
    labelMap={{
        userId: '用户ID',
        userName: '用户名',
        status: '状态',
    }}
>
    <Form.Item name="userId" label="用户ID">
        <Input placeholder="输入用户ID" allowClear />
    </Form.Item>
    <Form.Item name="userName" label="用户名">
        <Input placeholder="输入用户名" allowClear />
    </Form.Item>
    <Form.Item name="status" label="状态">
        <Select placeholder="选择状态" allowClear>
            <Select.Option value="1">已生效</Select.Option>
            <Select.Option value="0">未生效</Select.Option>
        </Select>
    </Form.Item>
</PageFilter>
```

### 带 valueMap（用于下拉选择的显示文本）

```tsx
<PageFilter
    form={form}
    onSearch={handleSearch}
    onReset={handleReset}
    searchParams={searchParams}
    setSearchParams={setSearchParams}
    labelMap={{
        status: '状态',
        type: '类型',
    }}
    valueMap={{
        status: { '1': '已生效', '0': '未生效' },
        type: { 'mysql': 'MySQL', 'postgresql': 'PostgreSQL' },
    }}
>
    ...
</PageFilter>
```

### 超过 3 个筛选项

```tsx
<PageFilter ...>
    <Form.Item name="field1" label="字段1"><Input /></Form.Item>
    <Form.Item name="field2" label="字段2"><Input /></Form.Item>
    <Form.Item name="field3" label="字段3"><Input /></Form.Item>
    {/* 以下会被折叠 */}
    <Form.Item name="field4" label="字段4"><Input /></Form.Item>
    <Form.Item name="field5" label="字段5"><Input /></Form.Item>
</PageFilter>
```

## 样式

| 样式属性 | 值 | 说明 |
|----------|-----|------|
| 背景色 | `#F9FBFD` | 浅灰蓝色 |
| 阴影 | `0 2px 4px rgba(0,0,0,0.02)` | 轻微阴影 |
| 内边距 | `10px 16px 0` | 上10px，左右16px，下0 |
| 表单项间距 | `margin-bottom: 10px` | 统一间距 |

## 相关交互文档

详细交互规范请参考：`docs/interactions/page-filter.md`

## 相关组件

- [ModoTable](../modo-table/README.md) - 表格组件
- [ModoPagination](../modo-pagination/README.md) - 分页组件
