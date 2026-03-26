# Console Layout Template (工作台概览布局)

这是一个高度抽象且符合 MODO 设计系统的控制台布局模板。

## 设计标准
- **Header 高度**: 严格 44px
- **Logo 区域**: 宽度 176px，支持 32px 高度的图片 Logo
- **品牌色系**: 使用 MODO 品牌蓝 (Primary Blue)
- **精致间距**: 
  - 头像尺寸 28px，内部图标 14px
  - 按钮容器 28px 圆形，背景 color-fill-2
  - 用户名/团队名行高分别为 14px/12px，间距 2px

## 核心组件依赖
- `AppNav`: 顶部水平导航
- `SideMenu`: 侧边垂直菜单

## 使用示例

```tsx
import { ConsoleLayout } from '@/components/templates/console-layout/Layout';

const App = ({ children }) => {
    const navItems = [{ key: 'wb', label: '工作台' }];
    const menuItems = [
        { key: '/users', label: '用户管理', icon: <HumanDuotone /> }
    ];

    return (
        <ConsoleLayout
            logo={{ src: '/logo.png', alt: 'DataAtlas' }}
            navItems={navItems}
            menuItems={menuItems}
            user={{ name: '张三', team: '开发团队' }}
        >
            {children}
        </ConsoleLayout>
    );
};
```

## 导出
该模板应放置在项目的 `src/components/layouts` 目录下使用。
