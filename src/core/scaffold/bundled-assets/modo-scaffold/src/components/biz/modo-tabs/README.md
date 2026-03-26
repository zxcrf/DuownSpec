# ModoTabs

标签页组件，基于 Ant Design Tabs 封装，提供统一的 Pill/Chip 样式。

## 特性

- ✅ Pill/Chip 风格标签页样式
- ✅ 一屏自适应布局支持
- ✅ 内容区域自动撑满高度
- ✅ 首个标签特殊样式（透明背景）

## 引入

```tsx
import { ModoTabs } from '@/components/modo-tabs';
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `items` | `TabItem[]` | - | 标签页配置 |
| `activeKey` | `string` | - | 当前激活的标签页 |
| `onChange` | `(key: string) => void` | - | 切换标签页回调 |
| `type` | `'line' \| 'card' \| 'editable-card'` | - | 标签页类型 |
| `className` | `string` | - | 额外类名 |
| 其他 | - | - | 继承 Ant Design `TabsProps` |

## 样式规范

### 标签页样式（Card 类型）

| 状态 | 背景色 | 文字颜色 | 说明 |
|------|--------|----------|------|
| 默认 | `#F1F5F9` (slate-100) | `#64748B` (slate-500) | 浅灰背景 |
| 悬停 | `#E2E8F0` (slate-200) | `#4D5E7D` | 深一点 |
| 激活 | `#3261CE` (Primary Blue) | `#FFFFFF` | 主题蓝色 |

### 首个标签页

首个标签页（通常是"首页"或主标签）使用特殊样式：

| 样式 | 值 |
|------|-----|
| 背景色 | 透明 |
| 文字颜色 | `#242E43` (colorTextBase) |
| 字重 | `600` |

### 尺寸

| 属性 | 值 |
|------|-----|
| 高度 | `24px` |
| 字体大小 | `12px` |
| 圆角 | `4px` |
| 内边距 | `0 12px` |

## 使用示例

### 基础用法

```tsx
import { ModoTabs } from '@/components/modo-tabs';

const items = [
    { key: 'home', label: '首页', children: <HomeContent /> },
    { key: 'detail', label: '详情', children: <DetailContent /> },
];

<ModoTabs
    type="editable-card"
    items={items}
    activeKey="home"
    onChange={(key) => setActiveKey(key)}
/>
```

### 带图标的标签

```tsx
import { DatabaseIcon } from '@/components/icons';

const items = [
    {
        key: 'home',
        label: (
            <span className="flex items-center">
                <DatabaseIcon className="mr-1.5" />
                数据源管理
            </span>
        ),
        children: <DataSourceList />,
        closable: false,
    },
    { key: 'create', label: '新建数据源', children: <CreateForm /> },
];

<ModoTabs
    type="editable-card"
    items={items}
    activeKey={activeKey}
    onChange={setActiveKey}
    onEdit={handleEdit}
    hideAdd
/>
```

### 动态添加/删除标签

```tsx
const [items, setItems] = useState([...]);
const [activeKey, setActiveKey] = useState('home');

const onEdit = (targetKey, action) => {
    if (action === 'remove') {
        // 移除标签逻辑
    }
};

<ModoTabs
    type="editable-card"
    items={items}
    activeKey={activeKey}
    onChange={setActiveKey}
    onEdit={onEdit}
    hideAdd
/>
```

## 布局要求

`ModoTabs` 设计为占满父容器高度，需要放置在具有明确高度的容器中：

```tsx
<div className="h-full flex flex-col overflow-hidden">
    <ModoTabs items={items} ... />
</div>
```

## 相关组件

- [Tabs](https://ant.design/components/tabs-cn) - Ant Design 原生 Tabs
