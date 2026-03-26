# ModoContainer

自由宽高弹性容器组件。

## 设计规范

用于承接各类模块化内容包裹的界面底色（#EFF4F9）。
支持自定义传入 `width` 和 `height` 属性（默认值为 `100%`）。

基于 MODO 设计系统核心规范（CORE_SPECIFICATION.md）：
1. **外层背景**：使用 `--color-gray-2` (Neutral 2, #EFF4F9)，提供 `10px 12px` 的内间距。
2. **内层卡片**：使用 `--color-white` (#FFFFFF) 的卡片主体容器，支持弹性分布（flex: 1）适应外壳宽高。
3. **圆角与阴影**：内层卡片统一应用 `6px` 的圆角以及**一级阴影** (`0 2px 5px #242E431A`)。

## 使用示例

```tsx
import { ModoContainer } from '@/components/biz/modo-container';

export default function CustomWidget() {
   return (
      <ModoContainer width="400px" height="300px">
         {/* 内容区域自动拥有阴影和白色衬底，并被弹性布局填满 */}
         <div>Hello Modo Container</div>
      </ModoContainer>
   );
}
```
