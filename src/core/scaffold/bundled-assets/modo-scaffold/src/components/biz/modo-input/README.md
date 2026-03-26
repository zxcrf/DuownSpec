# ModoInput

输入框组件，基于 Ant Design Input 封装，提供统一的背景颜色。

## 特性

- ✅ 默认背景颜色 `#EFF4F9`，无边框
- ✅ 悬停时背景变深 `#E5ECF4`
- ✅ 聚焦时背景变白 `#FFFFFF`，并显示系统主色 `#3261CE` 边框
- ✅ 提供 TextArea、Search、Password 子组件

## 引入

```tsx
import { ModoInput, ModoTextArea, ModoSearch, ModoPassword } from '@/components/modo-input';
```

## 属性

继承 Ant Design `InputProps` 的所有属性。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `placeholder` | `string` | - | 占位提示 |
| `allowClear` | `boolean` | `false` | 是否显示清除按钮 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `value` | `string` | - | 输入值 |
| `onChange` | `(e) => void` | - | 值变化回调 |
| 其他 | - | - | 继承 Ant Design `InputProps` |

## 子组件

| 组件 | 说明 |
|------|------|
| `ModoTextArea` | 多行文本输入 |
| `ModoSearch` | 搜索框 |
| `ModoPassword` | 密码输入框 |

## 使用示例

### 基础用法

```tsx
import { ModoInput } from '@/components/modo-input';

<ModoInput placeholder="请输入内容" allowClear />
```

### 在 Form.Item 中使用

```tsx
<Form.Item name="userName" label="用户名">
    <ModoInput placeholder="输入用户名" allowClear />
</Form.Item>
```

### 多行文本

```tsx
import { ModoTextArea } from '@/components/modo-input';

<ModoTextArea rows={4} placeholder="请输入描述" />
```

### 密码输入

```tsx
import { ModoPassword } from '@/components/modo-input';

<ModoPassword placeholder="请输入密码" />
```

### 搜索框

```tsx
import { ModoSearch } from '@/components/modo-input';

<ModoSearch placeholder="搜索..." onSearch={handleSearch} />
```

## 样式规范

| 状态 | 背景颜色 | 边框 |
|------|----------|------|
| 默认 | `#EFF4F9` | 无 |
| 悬停 | `#E5ECF4` | 无 |
| 聚焦 | `#FFFFFF` | `#3261CE` |
| 禁用 | `#F5F5F5` | 无 |

## 相关组件

- [Input](https://ant.design/components/input-cn) - Ant Design 原生 Input
- [PageFilter](../page-filter/README.md) - 筛选组件
