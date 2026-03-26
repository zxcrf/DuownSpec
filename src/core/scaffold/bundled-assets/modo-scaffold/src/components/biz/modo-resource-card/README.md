# ModoResourceCard (资源卡片)

用于 `Gallery Grid` (画廊网格) 布局模式的核心展示组件。深度集成 MODO 设计语言，支持状态标识、图标、标签及更多操作。

## 使用场景
- 知识集预览
- 模型/资源列表
- 工作流卡片展示

## Props API

| 属性 | 说明 | 类型 | 默认值 |
| :--- | :--- | :--- | :--- |
| **id** | 资源的唯一标识符 | `string \| number` | - |
| **title** | 卡片主标题 | `string` | - |
| **icon** | 左侧展示的图标 (推荐使用 Duotone) | `ReactNode` | `<WebSharedDuotone />` |
| **status** | 右上角状态圆点指示颜色 | `'success' \| 'default' \| 'error' \| 'warning'` | `'default'` |
| **description** | 卡片描述内容 (支持 2 行溢出省略) | `string` | - |
| **subText** | 标题下方的辅助说明文字 | `string` | - |
| **isPrivate** | 是否显示私有/锁定图标 | `boolean` | `false` |
| **tags** | 卡片底部的标签列表 (展示首个) | `string[]` | `[]` |
| **actions** | 右下角“更多”按钮触发的菜单项 | `MenuProps['items']` | - |
| **onClick** | 点击卡片整体的回调函数 | `() => void` | - |
| **className** | 额外的容器样式类 | `string` | - |

## 代码规范与最佳实践
1. **尺寸建议**：卡片在 Grid 布局中应配合 `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` 使用。
2. **图标优先级**：优先使用 `modo-icon` 的 `Duotone` 版本，设置大小为 `32px`。
3. **状态影子**：圆点状态标识自带了散发阴影，无需额外添加逻辑。

## 示例代码 (Gallery Grid 模式)
```tsx
<ModoResourceCard
    id={1}
    title="公共资料知识集"
    icon={<BookDuotone className="text-primary-6 text-[32px]" />}
    status="success"
    description="此处为知识集简介内容，通过 ModoResourceCard 自动处理溢出逻辑。"
    subText="12个文件 · 更新于 04-23"
    isPrivate={true}
    tags={['核心资料']}
    actions={[{ key: 'edit', label: '编辑' }]}
/>
```
