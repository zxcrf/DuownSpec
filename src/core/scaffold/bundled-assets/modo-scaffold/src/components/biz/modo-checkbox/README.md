# ModoCheckbox

基于 Ant Design `Checkbox` 的封装，实现了 MODO 规范对于复选框尺寸（12px）的强制约束。

## 特性

- ✅ **尺寸锁定**：强制 12px 宽高 (通过 CSS Module Override)。
- ✅ **对钩修正**：针对 12px 尺寸，物理修正了内部对钩的偏移 (Left 3px)。
- ✅ **无色侵入**：颜色完全继承自 Ant Design Theme Token。

## 使用方法

```tsx
import { ModoCheckbox } from '@/components/ModoCheckbox';

<ModoCheckbox>选项</ModoCheckbox>
```

## API (Props)

继承自 Ant Design `CheckboxProps`，并包含以下扩展属性：

| 参数 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **`compact`** | `boolean` | `deprecated` | 曾用于切换紧凑模式。现在组件已全局锁定为 **12px**，此属性保留兼容性但无实际效果。 |

## Supported Ant Design Props (透传属性)

本组件完整支持并透传所有标准 Ant Design Checkbox 属性，常用包括：
- **状态**: `checked`, `defaultChecked`, `disabled`, `indeterminate`
- **交互**: `onChange`
- **内容**: `children` (Label)

完整列表请查阅 [Ant Design Checkbox API](https://ant.design/components/checkbox-cn/#API)。
