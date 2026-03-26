# ModoVisualSearch

`ModoVisualSearch` 是一个高级的、所见即所得的 Token 化聚合搜索组件（Visual Filter）。它能够帮助用户在单行输入框内完成多维度的条件筛选与组合。

## 场景
- 需要在列表级页面提供多列数据的精准搜索。
- 希望替代传统的展开式表单搜索，将交互简化在单行输入框内。
- 允许用户灵活地通过键盘、点击等方式添加键值对 (Key-Value) 作为筛选条件。

## 规范遵循
1. **圆角与边框**：默认呈现 `rounded-full` 圆角搜素框的样式。
2. **交互状态**：
   - *Default*: 浅色填充 (`bg-fill-2`)，灰色边框 (`border-border-1`)。
   - *Hover*: 边框变为主要色阶四 (`border-primary-4`)。
   - *Focus/Active*: 当输入框处于焦点或**已存在筛选条件 (tokens.length > 0)** 时，边框激活为品牌色 (`border-primary-5`)，背景转白 (`bg-bg-1`)。
3. **标签样式 (Tag)**：
   - **高度**: 固定为 `20px` (`h-5`)。
   - **圆角**: `10px` (`rounded-[10px]`)。
   - **字号**: `12px` (`text-[12px]`)。
   - **颜色**: 浅蓝底色 (`bg-primary-light-1`)，品牌色文字 (`text-primary-6`)。
   - **删除图标**: 使用 `CloseDuotone`，尺寸 `12px`。

## Props 属性

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `fields` | 搜索维度的配置 | `SearchField[]` | `[]` |
| `value` | 外部传入的已选条件 Token 数组 | `SearchToken[]` | `[]` |
| `onChange` | 当条件发生变化时的回调，返回最新的 tokens 和由于尚未成为 token 的原生输入文字 rawText | `(tokens: SearchToken[], rawText: string) => void` | `-` |
| `placeholder` | 占位符文本 | `string` | `'搜索'` |
| `className` | 覆盖容器的基础样式 | `string` | `-` |

### `SearchField` 数据结构
```typescript
{
    key: string;      // 字段唯一标识
    label: string;    // 该字段在下拉菜单中呈现的名称
    type: 'input' | 'select'; // 用户输入该字段值的模式
    options?: { label: string; value: string }[]; // 当 type 为 'select' 时必须配置选项
}
```

### `SearchToken` 数据结构
```typescript
{
    field: string;       // 对应 SearchField 的 key
    fieldLabel: string;  // 对应 SearchField 的 label
    value: string;       // 用户输入或选择的实际值
    valueLabel: string;  // 用户输入或选择值的外显文案
}
```

## 使用示例

```tsx
<ModoVisualSearch 
    className="w-[300px]"
    fields={[
        { key: 'title', label: '命名', type: 'input' },
        { 
            key: 'status', 
            label: '状态', 
            type: 'select', 
            options: [
                { label: '运行中', value: 'running' },
                { label: '失败', value: 'failed' }
            ]
        }
    ]}
    onChange={(tokens, rawText) => {
        console.log("选中的条件:", tokens);
        console.log("原生还在输入框的文本:", rawText);
    }}
/>
```
