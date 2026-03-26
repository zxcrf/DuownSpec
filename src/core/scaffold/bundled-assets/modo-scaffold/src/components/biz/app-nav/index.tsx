'use client';
import React from 'react';
import { Menu, ConfigProvider, theme } from 'antd';
import type { MenuProps } from 'antd';
import classNames from 'classnames';
import styles from './app-nav.module.css';

const { useToken } = theme;

export interface AppNavProps {
    /** 导航菜单项 */
    items: MenuProps['items'];
    /** 当前选中的菜单 ID */
    selectedKey?: string;
    /** 点击菜单回调 */
    onClick?: MenuProps['onClick'];
    /** 额外的 CSS 类名 */
    className?: string;
}

/**
 * AppNav - 顶部水平导航组件
 * 
 * 符合 Modo UI 设计规范：
 * - 高度 44px
 * - 字体 14px，选中加粗 (Medium 500)
 * - 选中状态有 2px 底部指示线
 * - 菜单间距 40px
 */
export const AppNav: React.FC<AppNavProps> = ({
    items,
    selectedKey,
    onClick,
    className,
}) => {
    const { token } = useToken();
    const primaryColor = token.colorPrimary;

    return (
        <ConfigProvider
            theme={{
                components: {
                    Menu: {
                        horizontalItemHoverColor: primaryColor,
                        horizontalItemSelectedColor: primaryColor,
                        itemColor: '#4E5969',
                        itemHoverColor: primaryColor,
                        itemSelectedColor: primaryColor,
                        itemActiveBg: 'transparent',
                        itemHoverBg: 'transparent',
                        fontSize: 14,
                        horizontalItemHoverBg: 'transparent',
                    },
                },
            }}
        >
            <div
                className={classNames(styles['app-nav-container'], className)}
                style={{ '--primary-color': primaryColor } as React.CSSProperties}
            >
                <Menu
                    mode="horizontal"
                    selectedKeys={selectedKey ? [selectedKey] : []}
                    onClick={onClick}
                    items={items}
                    className={styles['app-nav-menu']}
                />
            </div>
        </ConfigProvider>
    );
};

export default AppNav;
