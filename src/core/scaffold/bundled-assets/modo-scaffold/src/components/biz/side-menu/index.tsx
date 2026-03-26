'use client';
import React from 'react';
import { Layout, Menu, ConfigProvider } from 'antd';
import type { MenuProps } from 'antd';
import { ChevronLeftDuotone, ChevronRightDuotone } from 'modo-icon';
import styles from './index.module.css';

const { Sider } = Layout;

export interface SideMenuProps {
    collapsed: boolean;
    onCollapse: (collapsed: boolean) => void;
    menuItems: MenuProps['items'];
    activeKey?: string;
    openKeys?: string[];
    onOpenChange?: MenuProps['onOpenChange'];
    onMenuClick?: MenuProps['onClick'];
    width?: number;
    collapsedWidth?: number;
    style?: React.CSSProperties;
    className?: string;
    showSubMenuIcons?: boolean; // 新增：是否显示一级以下菜单的图标
}

const menuTheme = {
    components: {
        Menu: {
            subMenuItemBg: 'transparent',
            itemHeight: 36, // 下级菜单高度 36px
            itemColor: '#4D5E7D', // 菜单文字/图标颜色
            itemSelectedBg: '#EFF4F9', // --color-fill-2
            itemHoverBg: '#EFF4F9',    // --color-fill-2
            borderRadius: 4, // 菜单项圆角
            borderRadiusLG: 4,
        },
    },
};

export const SideMenu: React.FC<SideMenuProps> = ({
    collapsed,
    onCollapse,
    menuItems,
    activeKey,
    openKeys,
    onOpenChange,
    onMenuClick,
    width = 200,
    collapsedWidth = 45,
    style,
    className,
    showSubMenuIcons = false // 默认不显示
}) => {
    // 组合 CSS Module 类名
    const wrapperClassName = [
        styles.sideMenu,
        !showSubMenuIcons ? styles.hideSubMenuIcons : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <Sider
            collapsed={collapsed}
            width={width}
            collapsedWidth={collapsedWidth}
            theme="light"
            style={{
                background: '#F9FBFD',
                borderRight: '1px solid #EFF4F9',
                ...style
            }}
            className={wrapperClassName}
        >
            <ConfigProvider theme={menuTheme}>
                <Menu
                    mode="inline"
                    selectedKeys={activeKey ? [activeKey] : []}
                    openKeys={openKeys}
                    onOpenChange={onOpenChange}
                    style={{
                        height: '100%',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        borderRight: 0,
                        paddingBlockStart: 8,
                        paddingBlockEnd: 48, // 底部留白，防止被悬浮按钮遮挡
                        background: 'transparent',
                    }}
                    items={menuItems}
                    onClick={onMenuClick}
                />
            </ConfigProvider>
            {/* 悬浮收起按钮 - 圆形无边框 */}
            <div
                onClick={() => onCollapse(!collapsed)}
                style={{
                    position: 'absolute',
                    bottom: 12,
                    right: 12,
                    width: 28,
                    height: 28,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#EFF4F9',
                    borderRadius: '50%',
                    transition: 'box-shadow 0.2s',
                    zIndex: 10,
                }}
                onMouseEnter={(e: any) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e: any) => {
                    e.currentTarget.style.boxShadow = 'none';
                }}
            >
                {collapsed ? <ChevronRightDuotone width="1em" height="1em" /> : <ChevronLeftDuotone width="1em" height="1em" />}
            </div>
        </Sider>
    );
};
