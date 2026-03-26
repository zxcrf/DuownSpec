'use client';

import React, { useState, useMemo } from 'react';
import { Typography, Empty } from 'antd';
import { AddCircleDuotone, FolderDuotone, SearchOutlined } from 'modo-icon';
import { ModoButton } from '@/components/biz/modo-button';
import { ModoPage } from '@/components/biz/modo-page';
import { ModoVisualSearch, SearchToken } from '@/components/biz/modo-visual-search';
import { ModoResourceCard } from '@/components/biz/modo-resource-card';
import { ModoSectionHeader } from '@/components/biz/modo-section-header';

const { Text } = Typography;

interface ResourceItem {
    id: number | string;
    title: string;
    description: string;
    status: 'success' | 'default' | 'error' | 'warning';
    subText?: string;
    isPrivate?: boolean;
    tags?: string[];
}

/**
 * [Pattern: Gallery Grid] (画廊网格模板)
 * 用于资源预览、知识集管理、画廊展示等场景。
 */
export default function GalleryGridPage() {
    const [searchTokens, setSearchTokens] = useState<SearchToken[]>([]);
    const [rawSearchText, setRawSearchText] = useState('');

    // 1. 定义搜索配置
    const searchFields = [
        { key: 'title', label: '名称', type: 'input' as const },
        {
            key: 'status',
            label: '状态',
            type: 'select' as const,
            options: [
                { label: '运行中', value: 'success' },
                { label: '已停止', value: 'default' }
            ]
        }
    ];

    // 2. 模拟列表数据
    const [dataSource] = useState<ResourceItem[]>([
        {
            id: 1,
            title: '示例资源 1',
            description: '这是资源的详细描述内容，支持多行溢出隐藏。设计遵循 MODO 规范。',
            status: 'success',
            subText: '12个文件 · 更新于 04-23',
            isPrivate: true,
            tags: ['核心']
        },
        {
            id: 2,
            title: '示例资源 2',
            description: '另一个资源的描述。MODO 系统的卡片旨在简洁展示核心信息。',
            status: 'default',
            subText: '5个文件 · 更新于 04-24',
            tags: ['公共']
        },
    ]);

    // 3. 计算过滤后的数据
    const filteredData = useMemo(() => {
        return dataSource.filter(item => {
            // 文本匹配 (标题或描述)
            const textMatch = !rawSearchText ||
                item.title.toLowerCase().includes(rawSearchText.toLowerCase()) ||
                item.description.toLowerCase().includes(rawSearchText.toLowerCase());

            // Token 匹配 (示例：状态过滤)
            const statusToken = searchTokens.find(t => t.field === 'status');
            const statusMatch = !statusToken || item.status === statusToken.value;

            return textMatch && statusMatch;
        });
    }, [dataSource, rawSearchText, searchTokens]);

    // 4. 定义卡片菜单
    const cardActions = [
        { key: 'edit', label: '编辑' },
        { key: 'share', label: '分享' },
        { type: 'divider' as const },
        { key: 'delete', label: '删除', danger: true }
    ];

    return (
        <ModoPage contentClassName="flex flex-col">
            {/* 头部：包含标题区、搜索区(360px) 和 新建主按钮。 search与button间距固定 10px */}
            <div className="flex justify-between items-center px-4 py-[10px] h-[48px] bg-bg-1 flex-shrink-0">
                <ModoSectionHeader
                    title="知识集管理"
                    icon={<FolderDuotone />}
                    className="!py-0 !mb-0"
                />

                <div className="flex items-center gap-[10px]">
                    <ModoVisualSearch
                        fields={searchFields}
                        value={searchTokens}
                        onChange={(tokens, rawText) => {
                            setSearchTokens(tokens);
                            setRawSearchText(rawText);
                        }}
                        placeholder="输入搜索或选择条件..."
                        className="w-[360px]"
                    />
                    <ModoButton type="primary" icon={<AddCircleDuotone />} className="rounded-full px-5">
                        新建
                    </ModoButton>
                </div>
            </div>

            {/* 内容区：Grid 布局，适配 1/2/3/4 列 */}
            <div className="flex-1 overflow-auto p-4 pt-0">
                {filteredData.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredData.map((item) => (
                            <ModoResourceCard
                                key={item.id}
                                id={item.id}
                                title={item.title}
                                description={item.description}
                                subText={item.subText}
                                isPrivate={item.isPrivate}
                                status={item.status}
                                tags={item.tags}
                                actions={cardActions}
                                onClick={() => console.log('Click card:', item.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center h-[300px] gap-4">
                        <Empty description={<span className="text-text-4">未找到匹配资源</span>} />
                        {(searchTokens.length > 0 || rawSearchText) && (
                            <ModoButton
                                type="link"
                                onClick={() => {
                                    setSearchTokens([]);
                                    setRawSearchText('');
                                }}
                            >
                                清除搜索条件
                            </ModoButton>
                        )}
                    </div>
                )}
            </div>
        </ModoPage>
    );
}
