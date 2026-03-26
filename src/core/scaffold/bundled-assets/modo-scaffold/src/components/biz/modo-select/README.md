# ModoSelect

下拉选择组件，默认使用填充 (Filled) 风格，与 MODO 的扁平化设计基调保持一致。

## 特性

- ✅ **默认 Filled 风格**：统一设置 `variant="filled"`。
- ✅ **背景色一致性**：使用 `neutral-2` (#EFF4F9) 作为默认背景。
- ✅ **圆角规范**：遵循全局 `2px` 圆角。
- ✅ **尺寸对齐**：与 `ModoButton` 的高度规格完全对齐。

## 引入

```tsx
import { ModoSelect } from '@/components/ModoSelect';
```

## 默认属性

| 属性 | 默认值 | 说明 |
|------|------|------|
| `variant` | `'filled'` | 填充模式，无外边框，背景色区分 |
| `placeholder` | `'请选择'` | 统一的默认占位符 |
| `allowClear` | `true` | 默认支持一键清除 |

## 样式规范 (Design Tokens)

- **背景色**: `token.colorFillAlter` (#EFF4F9)
- **悬浮背景色**: `token.colorFillTertiary` (#E3E9EF)
- **文字颜色**: `token.colorText` (#242E43)

## 相关交互

- 在 `PageFilter` 中使用时，高度应设为 28px (middle)。
- 搜索下拉建议开启 `showSearch` 以提升体验。

## API (Props)

继承自 Ant Design `SelectProps`，并具有以下默认预设：

| 参数 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **`variant`** | `'filled' \| 'outlined'` | `'filled'` | MODO 规范默认使用填充风格 (`filled`)，背景色 `#EFF4F9`。仅在特殊场景（如 Table 内编辑）才需改为 `'outlined'`。 |

## Supported Ant Design Props (透传属性)

本组件完整支持并透传所有标准 Ant Design Select 属性，常用包括：
- **数据**: `options`, `value`, `defaultValue`
- **交互**: `onChange`, `onSearch`, `showSearch`
- **样式**: `style` (常用于设定宽度), `size`, `status`

完整列表请查阅 [Ant Design Select API](https://ant.design/components/select-cn/#API)。
