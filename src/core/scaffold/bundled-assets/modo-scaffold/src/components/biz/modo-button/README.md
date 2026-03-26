# Modo Button

基于 Ant Design `Button` 组件封装，严格遵循 MODO 设计系统规范。
**依赖**: `antd` >= 6.0.0, `tailwindcss` >= 3.4.0

## 功能特性

- **视觉一致性**：强制覆盖了 Ant Design 默认样式（`box-shadow: none`），使用 MODO Token 颜色。
- **状态完整**：包含 Hover, Active, Disabled 状态的完整定义。
- **类型支持**：支持 Primary, Default, Text, Link 四种基本类型以及 Danger 变体。

## Usage Guidelines (设计规范)

- **Primary (Save/Submit)**: Use `type="primary"` for the main action on a page. **用于多个操作的操作区域，建议只有一个主要按钮。**
- **Default (Cancel/Back)**: Use default type (Gray Solid) for secondary actions.
- **Danger (Delete)**: Use `danger` prop for destructive actions.
- **Success (Approve/Complete)**: Use `color="green" variant="solid"` (MODO Green).
- **Warning (Pause/Revoke)**: Use `color="orange" variant="solid"` (MODO Orange).

> **底层说明**：该组件直接透传 `color` 属性给 Ant Design Button。由于系统全局配置了 `modoAlgorithm`，传入 `"green"` 或 `"orange"` 会自动渲染为 MODO 规范定义的精确色阶。

## 使用方法

```tsx
import { ModoButton } from './biz_components/modo-button';

// 1. 主要按钮
<ModoButton type="primary">提交</ModoButton>

// 2. 次要按钮 (Default)
<ModoButton>取消</ModoButton>

// 3. 危险按钮
<ModoButton type="primary" danger>删除</ModoButton>

// 4. 文字按钮
<ModoButton type="text">查看详情</ModoButton>

// 5. 语义化按钮 (MODO 绿/橙)
<ModoButton color="green" variant="solid">通过</ModoButton>
<ModoButton color="orange" variant="solid">重置</ModoButton>

// 6. 特大尺寸 (36px)
<ModoButton extraLarge type="primary">开始任务</ModoButton>
```

## 尺寸规范 (Sizes)

| 规范级别 | 组件参数 | 实际高度 (Height) | 字体大小 (FontSize) |
|----------|----------|-------------------|-------------------|
| Mini | `size="small"` | **24px** | 12px |
| Small (Default) | - / `size="middle"` | **28px** | 12px |
| Medium | `size="large"` | **32px** | 14px |
| Large | `extraLarge` | **36px** | 14px |

## 规范对应

- **Primary Color**: `#3261CE` (Token: `--color-primary-6`)
- **Border Radius**: `2px` (Token: `--border-radius-medium`)
- **Minimum Width**: `72px` (Excluding icon-only, circle, text, and link buttons)
- **Padding**: Standardized by size, but `0` for `circle` and `icon-only` buttons.
- **Disabled Color**: `#97B9EB` (Token: `--color-primary-light-3`)

## API (Props)

继承自 Ant Design `ButtonProps`，并包含以下扩展属性：

| 参数 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **`extraLarge`** | `boolean` | `false` | 开启 **36px** 特大尺寸模式（常用于着陆页或重要引导）。 |
| **`color`** | `string` | - | 增强的语义色支持。传入 `"green"` 或 `"orange"` 会自动映射到 MODO 设计系统的成功/警告色阶。 |
| **`size`** | `'small' \| 'middle' \| 'large'` | `'middle'` | 尺寸映射：`small`=24px, `middle`=28px (默认), `large`=32px。 |
| **`className`** | `string` | - | 用于追加自定义样式（注：组件已内置去阴影样式）。 |

## Supported Ant Design Props (透传属性)

本组件完整支持并透传所有标准 Ant Design Button 属性，常用包括：
- **事件**: `onClick`
- **状态**: `loading`, `disabled`
- **样式**: `block`, `ghost`, `icon`, `shape`
- **原生**: `htmlType`, `href`, `target`

完整列表请查阅 [Ant Design Button API](https://ant.design/components/button-cn/#API)。

