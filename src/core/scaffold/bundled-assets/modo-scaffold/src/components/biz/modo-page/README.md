# ModoPage

一屏布局基础容器组件。

## 设计规范

本质是 `ModoContainer` 的语法糖与全屏业务包装。
用于快速搭建一屏自适应管理界面（配合全局保证根节点满屏高度的 CSS 样式高效使用）。
锁定宽高强制为 `width="100%"` 和 `height="100%"`。

内层内容天然支持基于 MODO 规范的以下表现：
1. **外层铺底**：`--color-gray-2` 灰色背景与内敛边距。
2. **白底圆角卡片**：承接内容的 `6px` 圆角内层与自动的一级阴影。

## 使用方法

通常作为各个 Next.js 的路由页面组件的最外层容器（Page wrapper）使用：

```tsx
import { ModoPage } from '@/components/biz/modo-page';

export default function MyPage() {
    return (
        <ModoPage>
            {/* 页面内容区会自动满铺拥有白底、6px圆角以及一级阴影 */}
            <div className="flex-1 p-4">我是满屏的页面主体内容</div>
        </ModoPage>
    );
}
```
