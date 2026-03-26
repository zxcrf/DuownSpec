# AppNav 顶部导航组件

符合 Modo UI 设计规范的顶部水平导航组件。

## 特性

- ✅ 高度固定为 44px
- ✅ 字体大小 14px，选中项加粗 (Medium 500)
- ✅ 选中状态带有 2px 底边指示线
- ✅ 项间距 40px
- ✅ 基于 Ant Design Menu 封装，支持其标准属性

## 属性 (Props)

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| items | 导航菜单项配置 | `MenuProps['items']` | - |
| selectedKey | 当前选中的菜单项 key | `string` | - |
| onClick | 点击菜单项的回调 | `MenuProps['onClick']` | - |
| className | 额外的 CSS 类名 | `string` | - |

## 使用示例

```tsx
import { AppNav } from '@/components/app-nav';

const navItems = [
  { key: 'dashboard', label: '工作台' },
  { key: 'project', label: '项目管理' },
];

const Header = () => {
  return (
    <AppNav 
      items={navItems} 
      selectedKey="dashboard" 
      onClick={(e) => console.log(e.key)} 
    />
  );
};
```
