# ModoRadio

基于 Ant Design `Radio` 的封装，实现了 MODO 规范对于单选框尺寸（12px）的配置。

## 特性

- ✅ **尺寸定制**：强制 12px 宽高 (通过 Token + CSS Module Override)。
- ✅ **无色侵入**：颜色完全继承自 Ant Design Theme Token。

## 使用方法

```tsx
import { ModoRadio } from '@/components/ModoRadio';

<ModoRadio>选项</ModoRadio>
```

## API (Props)

继承自 Ant Design `RadioProps`。

| 参数 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| - | - | - | 本组件主要用于样式约束，无特殊扩展属性。 |

## Supported Ant Design Props (透传属性)

本组件完整支持并透传所有标准 Ant Design Radio 属性。
