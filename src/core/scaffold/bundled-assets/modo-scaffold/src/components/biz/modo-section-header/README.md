# ModoSectionHeader (分段标题)

用于页面标题、分块标题、抽屉或对话框内部的模块切割。自带品牌视觉装饰条（Bar）和可选业务图标（Icon）。

## 使用场景
- Page 顶部的页面标题 (带 Icon)
- 详情页表单的分段标题 (带 Bar)
- 侧边栏/抽屉内部的头部内容

## Props API

| 属性 | 说明 | 类型 | 默认值 |
| :--- | :--- | :--- | :--- |
| **title** | 标题文字 | `ReactNode` | - |
| **icon** | 标题文字左侧的可选图标 | `ReactNode` | - |
| **extra** | 右侧悬浮区域内容 | `ReactNode` | - |
| **className** | 额外的容器类名 | `string` | - |
| **showBar** | 是否显示左侧蓝色品牌装饰条 | `boolean` | `true` |

## 示例用法 (页面顶栏集成式标题)
```tsx
<ModoSectionHeader
    title="用户管理"
    icon={<UserDuotone />}
    showBar={true}
    className="bg-bg-1 px-4 py-2 rounded-t-lg !mb-0"
/>
```

## 设计规范
1. **统一高度**：在页面头部时通常设置容器为 `h-[48px]`，内部 `ModoSectionHeader` 设置 `!py-0 !mb-0` 手动平衡。
2. **文字层级**：使用标准的 `text-[14px] font-medium text-text-1`，满足中等密度的阅读体验。
3. **品牌条 Bar**：装饰条颜色为品牌蓝 (`bg-primary-6`)，宽度为 `4px`，带微圆角。
