'use client';

import React, { useState } from 'react';
import { Layout, Avatar, Dropdown, Space, ConfigProvider } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import {
    BellDuotone,
    CaretDownDuotone,
    HumanDuotone,
    LogoutRightDuotone,
    GearDuotone
} from 'modo-icon';
import { AppNav } from '../../biz_components/app-nav';
import { SideMenu } from '../../biz_components/side-menu';

const { Header, Content } = Layout;

export interface ConsoleLayoutProps {
    /** 子内容 */
    children: React.ReactNode;
    /** Logo 配置 */
    logo?: {
        src: string;
        alt: string;
        height?: number;
    };
    /** 顶部导航项 */
    navItems?: { key: string; label: string }[];
    /** 当前选中导航 */
    activeNavKey?: string;
    /** 侧边菜单项 */
    menuItems?: any[];
    /** 用户信息 */
    user?: {
        name: string;
        team: string;
    };
    /** 用户下拉菜单额外项 */
    userMenuItems?: any[];
    /** 退出登录回调 */
    onLogout?: () => void;
}

/**
 * [Pattern: Console Layout] (工作台控制台布局模板)
 * 
 * 符合 MODO 设计系统规范：
 * - 顶部 Header 高度 44px
 * - 极简品牌风格 (Neutral-1 背景)
 * - 精致的尺寸与间距 (28px Avatar, 14px Icon)
 */
export const ConsoleLayout: React.FC<ConsoleLayoutProps> = ({
    children,
    logo = { src: '/logo.png', alt: 'DataAtlas Logo', height: 32 },
    navItems = [],
    activeNavKey = 'workbench',
    menuItems = [],
    user = { name: '平台管理员', team: '平台管理团队' },
    userMenuItems = [],
    onLogout
}) => {
    const [collapsed, setCollapsed] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    // 默认用户菜单
    const defaultUserMenuItems = [
        {
            key: 'user-info',
            label: (
                <div className="flex items-center gap-3 py-0 px-0">
                    <Avatar
                        size={28}
                        className="!bg-primary-light-1 flex items-center justify-center border-none shrink-0"
                        style={{ width: 28, height: 28, minWidth: 28, fontSize: 14 }}
                    >
                        <HumanDuotone className="text-primary-6" style={{ fontSize: 14 }} />
                    </Avatar>
                    <div className="flex flex-col min-w-[100px]">
                        <span className="text-[14px] font-medium text-text-1 leading-[18px]">{user.name}</span>
                        <span className="text-[12px] text-text-3 leading-[18px]">{user.team}</span>
                    </div>
                </div>
            ),
            disabled: true,
            className: "!cursor-default !opacity-100 mb-[10px]"
        },
        ...userMenuItems,
        { type: 'divider' as const },
        {
            key: 'logout',
            label: '退出',
            icon: <LogoutRightDuotone />,
            danger: true,
            onClick: onLogout
        },
    ];

    return (
        <Layout className="h-screen overflow-hidden">
            {/* 顶部 Header */}
            <Header className="!h-[44px] !leading-[44px] !bg-neutral-1 border-b border-border-1 !px-3 flex justify-between items-center flex-shrink-0 z-20">
                <div className="flex items-center gap-3 h-full">
                    {/* Logo 区 */}
                    <div className="flex items-center cursor-pointer w-[176px]" onClick={() => router.push('/')}>
                        <img src={logo.src} alt={logo.alt} className="object-contain" style={{ height: logo.height }} />
                    </div>

                    {/* 分割线 */}
                    <div className="w-[1px] h-[14px] bg-neutral-3" />

                    {/* 顶部水平导航 */}
                    <AppNav
                        items={navItems}
                        selectedKey={activeNavKey}
                        className="h-full !ml-2"
                    />
                </div>

                <div className="flex items-center gap-3">
                    {/* 工具按钮区 */}
                    <Space size={20} className="text-text-3">
                        <div className="w-7 h-7 rounded-full bg-neutral-2 flex items-center justify-center cursor-pointer hover:bg-neutral-3 transition-colors">
                            <BellDuotone style={{ fontSize: 14 }} className="hover:text-primary-6" />
                        </div>
                    </Space>

                    {/* 用户头像区 */}
                    <Dropdown
                        menu={{ items: defaultUserMenuItems }}
                        placement="bottomRight"
                        arrow={{ pointAtCenter: true }}
                        classNames={{ root: 'min-w-[180px]' }}
                    >
                        <div className="flex items-center gap-2 cursor-pointer hover:bg-neutral-2 pr-2 !pl-0 h-9 rounded transition-colors group">
                            <Avatar
                                size={28}
                                className="!bg-primary-light-1 flex items-center justify-center border-none shrink-0"
                                style={{ width: 28, height: 28, minWidth: 28, fontSize: 14 }}
                            >
                                <HumanDuotone className="text-primary-6" style={{ fontSize: 14 }} />
                            </Avatar>
                            <div className="flex flex-col gap-0 text-left">
                                <span className="text-[14px] font-medium text-text-1 leading-[14px] mb-[2px]">{user.name}</span>
                                <span className="text-[12px] text-text-3 leading-[12px]">{user.team}</span>
                            </div>
                            <CaretDownDuotone className="text-[12px] text-text-3 group-hover:text-primary-6 transition-colors ml-1" />
                        </div>
                    </Dropdown>
                </div>
            </Header>

            {/* 下方主体 */}
            <Layout hasSider className="overflow-hidden flex-auto">
                {/* 侧边菜单 */}
                <SideMenu
                    collapsed={collapsed}
                    onCollapse={setCollapsed}
                    menuItems={menuItems}
                    activeKey={pathname}
                    onMenuClick={(info) => router.push(info.key)}
                />

                {/* 内容视口 */}
                <Content className="bg-bg-1 relative overflow-hidden flex flex-col flex-auto">
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default ConsoleLayout;
