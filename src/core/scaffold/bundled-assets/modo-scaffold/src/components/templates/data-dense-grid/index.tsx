'use client';

import React, { useState, useEffect } from 'react';
import { Form, Tag, message, Modal } from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { Apps4Duotone } from 'modo-icon';
import { ModoPage } from '@/components/biz/modo-page';
import { PageFilter } from '@/components/biz/page-filter';
import { ModoTable } from '@/components/biz/modo-table';
import { ModoPagination } from '@/components/biz/modo-pagination';
import { ModoButton } from '@/components/biz/modo-button';
import { ModoInput } from '@/components/biz/modo-input';
import { ModoSelect } from '@/components/biz/modo-select';
import { ModoActionGroup } from '@/components/biz/modo-action-group';
import { ModoTabs } from '@/components/biz/modo-tabs';

/**
 * 高密度表格模板 (High-Density Table Template)
 * 核心特性：
 * 1. 一屏适配：表单、表格、分页均在可视区域内，表格内部滚动
 * 2. 动态标签页：支持多开编辑/新建页
 * 3. 响应式布局：Flex 链条确保高度精准传递
 * 4. 规范化表单：符合 Modo 3.0 视觉规范的侧边/内嵌式表单
 */

// --- Types & Mock Data ---

interface RecordType {
    id: string;
    field1: string;
    field2: string;
    role: string;
    status: 'active' | 'inactive';
    email: string;
    createTime: string;
}

const ROLE_MAP: Record<string, string> = {
    admin: '管理员',
    editor: '编辑',
    viewer: '观察者',
};

const STATUS_MAP: Record<string, string> = {
    active: '启用',
    inactive: '禁用',
};

// --- Sub-Components ---

/**
 * List Component (Main View)
 */
const ListPart: React.FC<{
    onAdd: () => void;
    onEdit: (record: RecordType) => void;
}> = ({ onAdd, onEdit }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Placeholder data
    const data: RecordType[] = Array.from({ length: 15 }).map((_, i) => ({
        id: `ID-${1000 + i}`,
        field1: `Value ${i + 1}`,
        field2: `Name ${i + 1}`,
        role: i % 2 === 0 ? 'admin' : 'editor',
        status: 'active',
        email: `example${i + 1}@modo.com`,
        createTime: '2024-03-01 12:00:00',
    }));

    const columns = [
        { title: '关键字段', dataIndex: 'field1', key: 'field1', width: 150 },
        { title: '辅助描述', dataIndex: 'field2', key: 'field2', width: 150 },
        { title: '角色', dataIndex: 'role', key: 'role', width: 120, render: (val: string) => ROLE_MAP[val] || val },
        {
            title: '状态', dataIndex: 'status', key: 'status', width: 100,
            render: (val: string) => (
                <Tag color={val === 'active' ? 'success' : 'default'}>{STATUS_MAP[val] || val}</Tag>
            ),
        },
        { title: '邮箱', dataIndex: 'email', key: 'email' },
        { title: '日期', dataIndex: 'createTime', key: 'createTime', width: 180 },
        {
            title: '操作', key: 'action', fixed: 'right' as const, width: 120,
            render: (_: any, record: RecordType) => (
                <ModoActionGroup
                    actions={[
                        { key: 'edit', label: '编辑', onClick: () => onEdit(record) },
                        { key: 'delete', label: '删除', danger: true, onClick: () => { } },
                    ]}
                />
            ),
        },
    ];

    return (
        <div className="flex flex-col h-full">
            <div className="flex-shrink-0">
                <PageFilter form={form} onSearch={() => { }} onReset={() => { }} labelMap={{}} valueMap={{}}>
                    <Form.Item name="field1" label="搜索条件">
                        <ModoInput placeholder="请输入" />
                    </Form.Item>
                    <Form.Item name="role" label="筛选角色">
                        <ModoSelect placeholder="请选择" options={[]} />
                    </Form.Item>
                </PageFilter>
            </div>

            <div className="flex-shrink-0 flex justify-start items-center px-2 py-[10px]">
                <ModoButton type="primary" icon={<PlusOutlined />} onClick={onAdd}>
                    新建数据
                </ModoButton>
            </div>

            <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white rounded-lg">
                <ModoTable
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    loading={loading}
                    size="middle"
                    scroll={{ x: 1000, y: '100.1%' }}
                />
            </div>

            <div className="flex-shrink-0 bg-white rounded-lg">
                <ModoPagination current={1} pageSize={10} total={100} onChange={() => { }} />
            </div>
        </div>
    );
};

/**
 * Form Component (Add/Edit View)
 */
const FormPart: React.FC<{
    record?: RecordType | null;
    onSave: () => void;
    onCancel: () => void;
}> = ({ record, onSave, onCancel }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (record) form.setFieldsValue(record);
        else form.resetFields();
    }, [record, form]);

    return (
        <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="flex-1 overflow-auto bg-white flex flex-col items-center">
                <div className="w-full max-w-[720px] py-10 px-6">
                    <Form
                        form={form}
                        layout="horizontal"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 19 }}
                        onFinish={() => onSave()}
                        className="modo-form-horizontal"
                    >
                        <Form.Item name="field1" label="字段名称" rules={[{ required: true }]}>
                            <ModoInput placeholder="请输入" />
                        </Form.Item>
                        {/* More items... */}
                    </Form>
                </div>
            </div>

            <div className="flex-shrink-0 px-4 py-3 border-t border-[#eff4f9] flex justify-end gap-3 bg-white z-10">
                <ModoButton
                    onClick={onCancel}
                    className="border-none bg-[#eff4f9] text-[#242e43] hover:bg-[#e3e9ef] hover:text-[#242e43] transition-colors"
                >
                    取消
                </ModoButton>
                <ModoButton type="primary" onClick={() => form.submit()} loading={loading}>
                    保存
                </ModoButton>
            </div>
        </div>
    );
};

// --- Main Template ---

export default function HighDensityTableTemplate() {
    const [activeKey, setActiveKey] = useState('list');
    const [tabs, setTabs] = useState<any[]>([
        {
            key: 'list',
            label: '数据列表',
            icon: <Apps4Duotone style={{ fontSize: 16 }} />,
            closable: false,
        }
    ]);

    const addTab = (key: string, label: string, record?: RecordType) => {
        const exists = tabs.find(t => t.key === key);
        if (!exists) setTabs([...tabs, { key, label, record, closable: true }]);
        setActiveKey(key);
    };

    const removeTab = (targetKey: string) => {
        const newTabs = tabs.filter(t => t.key !== targetKey);
        setTabs(newTabs);
        if (activeKey === targetKey) setActiveKey('list');
    };

    const items = tabs.map(tab => ({
        key: tab.key,
        label: tab.label,
        icon: tab.icon,
        closable: tab.closable,
        children: tab.key === 'list' ? (
            <ListPart onAdd={() => addTab('add', '新建项')} onEdit={(r) => addTab(`edit-${r.id}`, `编辑: ${r.field1}`, r)} />
        ) : (
            <FormPart
                record={tab.record}
                onSave={() => removeTab(tab.key)}
                onCancel={() => removeTab(tab.key)}
            />
        ),
    }));

    return (
        <ModoPage className="flex flex-col h-full bg-[#f0f2f5] p-4">
            <ModoTabs
                activeKey={activeKey}
                onChange={setActiveKey}
                onEdit={(targetKey, action) => action === 'remove' && removeTab(targetKey as string)}
                type="editable-card"
                hideAdd
                items={items}
                className="h-full flex flex-col"
            />
        </ModoPage>
    );
}
