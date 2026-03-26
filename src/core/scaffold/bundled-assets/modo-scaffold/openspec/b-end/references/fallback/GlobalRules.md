## 1. Global Fallback Rules

所有 fallback 组件共享以下基础 Token 补偿。先将这些 Tailwind 工具类挂载在容器层，再叠加组件级覆盖。

### 1.1 Token 速查表

| Token 名称 | modo 值 | Tailwind 写法 |
|------------|---------|--------------|
| 全局圆角 | `2px` | `rounded-[2px]` |
| 控件高度（默认） | `28px` | `h-[28px]` |
| 填充背景色 | `#EFF4F9` | `bg-[#EFF4F9]` |
| 主色 | `#3261CE` | `text-[#3261CE]` / `bg-[#3261CE]` |
| 主文字色 | `#242E43` | `text-[#242E43]` |
| 次级文字色 | `#79879C` | `text-[#79879C]` |
| 边框色 | `#E3E9EF` | `border-[#E3E9EF]` |
| 布局背景色 | `#F9FBFD` | `bg-[#F9FBFD]` |
| 基础字号 | `12px` | `text-[12px]` |
| 按钮最小宽度 | `72px` | `min-w-[72px]` |
| 按钮阴影 | `none` | `shadow-none` |
| Checkbox/Radio 尺寸 | `12px` | `[&_.ant-checkbox-inner]:w-[12px] [&_.ant-checkbox-inner]:h-[12px]` |
| 所有输入框 | `variant="filled"` | `bg-[#EFF4F9]` + antd `variant="filled"` |

### 1.2 页面级容器基础类

```tsx
// 所有 modo 管理页的根容器
<div className="bg-[#F9FBFD] min-h-screen text-[12px] text-[#242E43]">
  {/* 页面内容 */}
</div>
```

### 1.3 AntD ConfigProvider 全局配置（推荐配合使用）

```tsx
import { ConfigProvider } from 'antd'

// 配合 Tailwind fallback，减少逐组件覆盖
<ConfigProvider
  theme={{
    token: {
      borderRadius: 2,
      controlHeight: 28,
      colorPrimary: '#3261CE',
      colorText: '#242E43',
      colorTextSecondary: '#79879C',
      colorBorder: '#E3E9EF',
      colorBgLayout: '#F9FBFD',
      colorFillAlter: '#EFF4F9',
      fontSize: 12,
      boxShadow: 'none',
      boxShadowSecondary: 'none',
    },
  }}
>
  {children}
</ConfigProvider>
```

---

