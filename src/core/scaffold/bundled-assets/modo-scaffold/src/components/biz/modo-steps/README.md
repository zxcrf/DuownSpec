# ModoSteps

定制化的步骤条组件，基于 Ant Design 的 `Steps` 进行 MODO 设计规范样式的覆写。主要用于引导和展示多步骤的任务流程。

## 设计规范 (Design Specs)

根据 MODO 规范，此组件对默认颜色和交互状态进行了严格覆盖：

1.  **轨道连接线 (Rail)**:
    - 颜色替换为 MODO 的 border 色值（`#E3E9EF`）。
2.  **文字色 (Titles)**:
    - 统一替换为主文本黑（`#242E43`）。
3.  **图标状态定制 (Icon States)**:
    - **Wait (等待中)**: 色值定为辅助灰文字色（`#4D5E7D`）。
    - **Finish (已完成)**: 设置背景色为透明浅蓝 (`#E8F3FF`，primary-1)，字色与边框色为品牌蓝 (`#3261CE`，primary-6)。同时使用 `.ant-wave-target` 提权以防止点击波形覆盖核心蓝度。
    - **Active (进行中)**: 保持其原生主色表现（白字蓝底）。

## API 属性

同 Ant Design `Steps` 组件。包含但不限于：

-   `current`: 当前进行到的步骤 (0-indexed)
-   `items`: 步骤数据数组 `{ title, description, icon }`
-   `direction`: 排列方向 (`horizontal` | `vertical`)
-   `size`: 尺寸 (`default` | `small`)

## 代码示例

```tsx
import { ModoSteps } from '@/components/biz/modo-steps';

const STEPS = [
    { title: '基本信息配置' },
    { title: '技术信息配置' },
    { title: '业务信息配置' },
    { title: '配置完成' },
];

export default function WizardFeature() {
    return (
        <ModoSteps
            current={1}
            items={STEPS}
            size="default"
        />
    );
}
```
