# SideMenu

应用侧边导航菜单组件，基于 Ant Design Sider 和 Menu 组件封装，实现了特定的样式规范、折叠交互和响应式布局。

## 特性

- ✅ 集成 Ant Design Sider 和 Menu
- ✅ 支持折叠/展开交互
- ✅ 自定义菜单项样式（高度、颜色、间距、字体粗细）
- ✅ 支持配置是否显示子菜单图标
- ✅ 响应式布局支持
- ✅ 悬浮收起按钮

## 引入

```tsx
import { SideMenu } from '@/components/side-menu';
```

## 属性

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `collapsed` | `boolean` | ✅ | - | 当前收起状态 |
| `onCollapse` | `(collapsed: boolean) => void` | ✅ | - | 收起状态切换回调 |
| `menuItems` | `MenuProps['items']` | ✅ | - | 菜单数据项，参考 Ant Design Menu items |
| `activeKey` | `string` | - | - | 当前选中的菜单 Key |
| `openKeys` | `string[]` | - | - | 当前展开的菜单 Keys |
| `onOpenChange` | `(openKeys: string[]) => void` | - | - | 菜单展开状态改变回调 |
| `onMenuClick` | `(info: MenuInfo) => void` | - | - | 菜单点击回调 |
| `width` | `number` | - | `200` | 侧边栏展开宽度 |
| `collapsedWidth` | `number` | - | `45` | 侧边栏收起宽度 |
| `style` | `React.CSSProperties` | - | - | 自定义样式对象 |
| `className` | `string` | - | - | 自定义类名 |
| `showSubMenuIcons` | `boolean` | - | `false` | 是否显示一级以下菜单的图标 |

## 使用示例

### 基础用法

```tsx
import React, { useState } from 'react';
import { SideMenu } from '@/components/side-menu';
import { HouseDuotone, GearDuotone } from 'modo-icon';
import type { MenuProps } from 'antd';

const App = () => {
    const [collapsed, setCollapsed] = useState(false);
    
    const items: MenuProps['items'] = [
        { key: '1', label: '仪表盘', icon: <HouseDuotone width="1em" height="1em" /> },
        { 
            key: '2', 
            label: '系统管理', 
            icon: <GearDuotone width="1em" height="1em" />, 
            children: [
                { key: '2-1', label: '用户管理' },
                { key: '2-2', label: '角色管理' }
            ]
        }
    ];

    return (
        <Layout>
            <SideMenu
                collapsed={collapsed}
                onCollapse={setCollapsed}
                menuItems={items}
                activeKey="1"
                showSubMenuIcons={true}
            />
            <Layout>
                {/* Content */}
            </Layout>
        </Layout>
    );
};
```

## 样式规范

组件内部封装了严格的样式规范，以符合 Modo 设计系统：

### 菜单项 (Menu Item)
- **高度**: 一级菜单 `44px`，子菜单 `36px`
- **间距**: 底部 margin `4px`，左右 margin `8px`
- **字体**: 一级菜单 `600` 加粗，子菜单 `400` 常规
- **颜色**: `#4D5E7D`

### 侧边栏 (Sider)
- **背景色**: `#F9FBFD`
- **右边框**: `1px solid #EFF4F9`
- **折叠按钮**: 底部悬浮圆形按钮，支持 hover 阴影效果

### 图标控制
- **一级菜单**: 始终显示图标
- **子菜单**: 默认隐藏图标，可通过 `showSubMenuIcons={true}` 开启显示

## 相关文件

- `src/components/side-menu/index.tsx`: 组件源码