# Login Page Template (登录页模板)

这是 MODO 设计系统中最核心、最新版的极简登录页模板，采用了精致的双栏卡片结构和微弱的 3D 渲染装饰。

## 设计规格 (Specifications)

### 1. 核心容器 (Main Container)
- **尺寸**: 宽度 `816px`，高度 `450px`
- **圆角**: `24px` (Large Radius)
- **阴影**: `shadow-[0_20px_50px_rgba(0,0,0,0.08)]` (极轻且深邃的扩散阴影)
- **背景**: 纯白，内部溢出隐藏 (`overflow-hidden`)

### 2. 左侧装饰栏 (Decorative Pane)
- **宽度**: `50%`
- **内容**: 全长 3D 科技风格封面图，内置微弱渐变叠加层
- **动画**: Hover 时图片微弱放大动画 (`hover:scale-105`)

### 3. 右侧表单栏 (Form Pane)
- **宽度**: `50%`
- **内边距**: 顶部 `56px`，左右 `70px`，底部 `65px`
- **对齐**: 内容顶部对齐 (`justify-start`)

### 4. 文字规范 (Typography)
- **欢迎语 (Welcome Text)**: `16px` / `Font-Semibold` / `Line-height: 1`
- **应用/欢迎文案**: 
  - 应用名 `24px` / `Font-Bold` / `Color-Primary-6`
  - 欢迎次标题 `16px` / `Color-Text-3`
- **表单标签 (Labels)**: `16px` / `Font-Normal` / `Color-Text-1` / `Height: 28px`

### 5. 输入框规范 (Inputs) - **MODO 极简风格**
- **高度**: `30px`
- **字号**: `12px` (通过 `!important` 强制固定)
- **边框**: 无边框设计 (`border: none !important`)
- **圆角**: 去除圆角 (`!rounded-none`)
- **背景**: 完全透明 (`bg-transparent`)
- **边距**: 去除内测左右边距 (`!px-0`)，使文字贴合虚拟下边线

### 6. 按钮规范 (Action Button)
- **高度**: `36px`
- **圆角**: `18px` (Pill Style)
- **字号**: `12px` / `Font-Semibold`
- **样式**: `Primary-6` 背景，带有轻量投影 (`shadow-lg shadow-primary-6/20`)

## 使用示例

```tsx
import LoginPage from '@/components/templates/login/page';

export default function App() {
    return <LoginPage />;
}
```

## 相关文件
- `page.tsx`: 完整的模板实现。
