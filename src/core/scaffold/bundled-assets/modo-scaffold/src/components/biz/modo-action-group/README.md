# ModoActionGroup

表格操作列专用按钮组组件，实现了操作按钮的自动折叠逻辑。

## 特性

- ✅ **自动折叠**：当按钮数量超过 `maxCount` (默认为 2) 时，自动将多余按钮收纳至下拉菜单。
- ✅ **样式统一**：使用 Text Link 样式，按钮间距 **4px**，按钮内边距 **0px 4px**。
- ✅ **智能显示**：支持 `visible` 属性，自动过滤不可见操作。

## 使用方法

```tsx
import { ModoActionGroup } from '@/components/biz/modo-action-group';

const columns = [
    {
        title: '操作',
        key: 'action',
        render: (_, record) => (
            <ModoActionGroup
                maxCount={2} // 最多显示2个直接按钮（含折叠入口则为1个按钮+1个More）
                actions={[
                    { key: 'view', label: '查看', onClick: () => {} },
                    { key: 'edit', label: '编辑', onClick: () => {} },
                    { key: 'delete', label: '删除', danger: true, onClick: () => {} },
                ]}
            />
        ),
    },
];
```

## API

| 参数 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **`actions`** | `ActionItem[]` | `[]` | 操作项列表 |
| **`maxCount`** | `number` | `2` | 最大主可视按钮数。若总数超过此值，显示 `maxCount` 个按钮 + 1 个下拉入口。 |

### ActionItem Interface

```ts
interface ActionItem {
    key: string;
    label: React.ReactNode;
    icon?: React.ReactNode; 
    danger?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    visible?: boolean; // 默认为 true
}
```
