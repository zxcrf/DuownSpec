# ModoModal 对话框组件

`ModoModal` 是基于 Ant Design `Modal` 封装的业务组件，严格遵循项目视觉设计规范。

## 特性

- **统一样式**：默认包含符合 Figma 设计的页头/页脚分隔线、边距、圆角以及阴影。
- **内置按钮**：底部按钮默认使用 `ModoButton` 组件，保持交互一致性。
- **内置配置**：内置了 `centered`（垂直居中）和 `destroyOnHidden`（关闭时销毁）等常用配置。

## 使用方法

```tsx
import { ModoModal } from '@/components/modo-modal';

const App = () => {
  const [visible, setVisible] = useState(false);

  return (
    <ModoModal
      title="对话框标题"
      open={visible}
      onOk={() => setVisible(false)}
      onCancel={() => setVisible(false)}
    >
      <p>这里是对话框内容...</p>
    </ModoModal>
  );
};
```

## 属性 (Props)

除了继承 Ant Design `Modal` 的所有属性外，还支持以下属性：

| 属性 | 说明 | 类型 | 默认值 |
| :--- | :--- | :--- | :--- |
| `cancelText` | 取消按钮文字 | `string` | `'取消'` |
| `okText` | 确认按钮文字 | `string` | `'确定'` |
| `confirmLoading` | 确认按钮加载状态 | `boolean` | `false` |
| `showFooter` | 是否显示底部按钮 | `boolean` | `true` |
| `onCancel` | 点击遮罩层或右上角叉或取消按钮的回调 | `function` | - |
| `onOk` | 点击确定按钮的回调 | `function` | - |

## 样式定制

组件通过 CSS Modules 进行样式隔离，如果需要修改特定组件的样式，可以通过覆盖 `src/components/modo-modal/modo-modal.module.css` 或传递 `className` 完成。
