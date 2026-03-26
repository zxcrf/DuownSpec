'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Layout,
    Input,
    Form,
    Space,
    Tag,
    Dropdown,
    Select,
    TreeSelect,
    InputNumber,
    Radio,
    App
} from 'antd';
import {
    AddDuotone,
    PencilDuotone,
    TrashDuotone,
    FolderDuotone,
    DocumentDuotone,
    AppstoreDuotone,
    GearDuotone,
    HumanDuotone
} from 'modo-icon';
import { ModoPage } from '@/components/biz/modo-page';
import { ModoButton } from '@/components/biz/modo-button';
import { ModoActionGroup } from '@/components/biz/modo-action-group';
import { ModoPagination } from '@/components/biz/modo-pagination';
import { ModoDrawer } from '@/components/biz/modo-drawer';
import { ModoTree } from '@/components/biz/modo-tree';
import type { DataNode } from 'antd/es/tree';
import type { ColumnsType } from 'antd/es/table';
import { PageFilter } from '@/components/biz/page-filter';
import { ModoTable } from '@/components/biz/modo-table';
import { ModoInput, ModoSearch, ModoTextArea } from '@/components/biz/modo-input';

const { Sider, Content } = Layout;

// --- Types ---

interface Menu {
    menuId: string;
    menuName: string;
    menuLabel: string;
    parentId: string | null;
    menuType: 'frame' | 'nav';
    state: '0' | '1';
    sortNum: number;
    menuIcon?: string;
    menuExtConf?: string;
    menuDescr?: string;
}

// --- Mock Data ---

const INITIAL_MOCK_DATA: Menu[] = [
    { menuId: '1', menuName: 'system', menuLabel: '系统管理', parentId: null, menuType: 'frame', state: '1', sortNum: 1, menuIcon: 'GearDuotone' },
    { menuId: '2', menuName: 'user', menuLabel: '用户管理', parentId: '1', menuType: 'frame', state: '1', sortNum: 1, menuIcon: 'HumanDuotone' },
    { menuId: '3', menuName: 'role', menuLabel: '角色管理', parentId: '1', menuType: 'frame', state: '1', sortNum: 2 },
    { menuId: '4', menuName: 'menu', menuLabel: '菜单管理', parentId: '1', menuType: 'frame', state: '1', sortNum: 3 },
    { menuId: '5', menuName: 'biz', menuLabel: '业务模块', parentId: null, menuType: 'frame', state: '1', sortNum: 2, menuIcon: 'AppstoreDuotone' },
    { menuId: '6', menuName: 'order', menuLabel: '订单中心', parentId: '5', menuType: 'frame', state: '1', sortNum: 1 },
];

// --- Page Component ---

/**
 * [Template: Master Tree-Table]
 * A complete, standalone template for menu/tree-grid management.
 * Service calls are mocked for demonstration.
 */
export default function MasterTreeTableTemplate() {
    const { message, modal } = App.useApp();
    const [loading, setLoading] = useState(false);
    const [treeLoading, setTreeLoading] = useState(false);

    // Mock Database State
    const [allMenusRaw, setAllMenusRaw] = useState<Menu[]>(INITIAL_MOCK_DATA);

    // Tree State
    const [treeData, setTreeData] = useState<DataNode[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [flatData, setFlatData] = useState<{ key: string; title: string; parentId: string | null }[]>([]);

    // Context Menu State
    const [contextMenu, setContextMenu] = useState<{ visible: boolean; x: number; y: number; nodeKey: string | null }>({
        visible: false, x: 0, y: 0, nodeKey: null
    });

    // Table State
    const [data, setData] = useState<Menu[]>([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Filter State
    const [searchForm] = Form.useForm();
    const [searchParams, setSearchParams] = useState<any>({});

    // Create/Edit Drawer State
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
    const [currentMenu, setCurrentMenu] = useState<Menu | null>(null);
    const [menuForm] = Form.useForm();
    const [formKey, setFormKey] = useState(0);

    // --- Mock Logic Functions ---

    const buildTreeData = useCallback((menus: Menu[]): DataNode[] => {
        const build = (parentId: string | null = null): DataNode[] => {
            return menus
                .filter(item => item.parentId === parentId)
                .sort((a, b) => (a.sortNum || 0) - (b.sortNum || 0))
                .map(item => {
                    const children = build(item.menuId);
                    return {
                        key: item.menuId,
                        value: item.menuId,
                        title: item.menuLabel || item.menuName,
                        icon: item.menuType === 'frame' ? <FolderDuotone /> : <DocumentDuotone />,
                        children: children.length > 0 ? children : undefined,
                        isLeaf: children.length === 0,
                    };
                });
        };
        return build(null);
    }, []);

    const fetchTreeData = useCallback(() => {
        setTreeLoading(true);
        const tree = buildTreeData(allMenusRaw);
        setTreeData(tree);

        // Auto expand first level
        if (expandedKeys.length === 0) {
            setExpandedKeys(tree.map(node => node.key));
        }

        const flat = allMenusRaw.map(m => ({
            key: m.menuId,
            title: m.menuLabel || m.menuName,
            parentId: m.parentId
        }));
        setFlatData(flat);
        setTreeLoading(false);
    }, [allMenusRaw, buildTreeData, expandedKeys.length]);

    const fetchTableData = useCallback(() => {
        setLoading(true);
        const parentId = selectedKeys.length > 0 ? (selectedKeys[0] as string) : null;

        let filtered = allMenusRaw.filter(item => {
            if (parentId && item.parentId !== parentId) return false;
            // Apply search filter
            if (searchParams.menuName && !item.menuName.includes(searchParams.menuName)) return false;
            if (searchParams.menuLabel && !item.menuLabel.includes(searchParams.menuLabel)) return false;
            return true;
        });

        setTotal(filtered.length);
        const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
        setData(paginated);
        setLoading(false);
    }, [allMenusRaw, currentPage, pageSize, searchParams, selectedKeys]);

    // Initial Load
    useEffect(() => {
        fetchTreeData();
    }, [fetchTreeData]);

    useEffect(() => {
        fetchTableData();
    }, [fetchTableData]);

    // --- Event Handlers ---

    const onExpand = (keys: React.Key[]) => {
        setExpandedKeys(keys);
        setAutoExpandParent(false);
    };

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setSearchValue(value);
        if (!value) {
            setAutoExpandParent(false);
            return;
        }

        const keys = flatData
            .filter(item => item.title.includes(value))
            .map(item => item.key);

        // Expansion logic omitted for simplicity in template
        setExpandedKeys(keys as React.Key[]);
        setAutoExpandParent(true);
    };

    const onSelect = (keys: React.Key[]) => {
        setSelectedKeys(keys);
        setCurrentPage(1);
    };

    const handleSearch = (values: any) => {
        setSearchParams(values);
        setCurrentPage(1);
    };

    const handleReset = () => {
        searchForm.resetFields();
        setSearchParams({});
        setCurrentPage(1);
    };

    const handleCreate = (parentId?: string) => {
        setDrawerMode('create');
        setCurrentMenu(null);
        setFormKey(prev => prev + 1);
        menuForm.resetFields();
        const pid = parentId || (selectedKeys.length > 0 ? selectedKeys[0] as string : undefined);
        if (pid) menuForm.setFieldsValue({ parentId: pid });
        setDrawerVisible(true);
    };

    const handleEdit = (record: Menu) => {
        setDrawerMode('edit');
        setCurrentMenu(record);
        setFormKey(prev => prev + 1);
        menuForm.resetFields();
        let extConf = {};
        try { if (record.menuExtConf) extConf = JSON.parse(record.menuExtConf); } catch (e) { }
        menuForm.setFieldsValue({ ...record, ...extConf });
        setDrawerVisible(true);
    };

    const handleDelete = (menuId: string) => {
        modal.confirm({
            title: '确定删除该菜单？',
            content: '删除后无法恢复',
            onOk: () => {
                setAllMenusRaw(prev => prev.filter(m => m.menuId !== menuId));
                message.success('删除成功');
            }
        });
    };

    const handleSave = async () => {
        try {
            const values = await menuForm.validateFields();
            const { openType, linkType, fetchMode, route, routeParam, url, ...baseValues } = values;
            const extConf = { openType, linkType, fetchMode, route, routeParam, url };

            if (drawerMode === 'create') {
                const newMenu: Menu = {
                    ...baseValues,
                    menuId: Date.now().toString(),
                    menuExtConf: JSON.stringify(extConf),
                    state: baseValues.state || '1'
                };
                setAllMenusRaw(prev => [...prev, newMenu]);
                message.success('创建成功');
            } else {
                setAllMenusRaw(prev => prev.map(m => m.menuId === currentMenu?.menuId ? {
                    ...m,
                    ...baseValues,
                    menuExtConf: JSON.stringify(extConf)
                } : m));
                message.success('更新成功');
            }
            setDrawerVisible(false);
        } catch (error) {
            console.error('Validate failed:', error);
        }
    };

    // Tree Right Click
    const handleTreeRightClick = ({ event, node }: any) => {
        event.preventDefault();
        setContextMenu({ visible: true, x: event.clientX, y: event.clientY, nodeKey: node.key });
    };

    const handleContextMenuClose = () => setContextMenu(prev => ({ ...prev, visible: false }));

    // Table Columns
    const columns: ColumnsType<Menu> = [
        { title: '模块编码', dataIndex: 'menuName', key: 'menuName', width: 160 },
        { title: '模块中文名', dataIndex: 'menuLabel', key: 'menuLabel', width: 160 },
        {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            width: 100,
            render: (state) => (
                <Tag color={state === '1' ? 'success' : 'default'}>
                    {state === '1' ? '已发布' : '未发布'}
                </Tag>
            )
        },
        { title: '排序', dataIndex: 'sortNum', key: 'sortNum', width: 80 },
        {
            title: '操作',
            key: 'action',
            width: 120,
            fixed: 'right',
            render: (_, record) => (
                <ModoActionGroup
                    actions={[
                        { key: 'edit', label: '编辑', onClick: () => handleEdit(record) },
                        { key: 'delete', label: '删除', danger: true, onClick: () => handleDelete(record.menuId) },
                    ]}
                />
            )
        }
    ];

    return (
        <ModoPage>
            <Layout className="flex-1 overflow-hidden flex flex-row bg-white rounded-sm">
                <Sider width={200} theme="light" className="border-r border-border-1 flex flex-col overflow-hidden bg-fill-1 shrink-0">
                    <div className="flex flex-col gap-[10px] h-full w-full">
                        <div className="pt-[10px] px-[16px] pb-0">
                            <ModoSearch
                                placeholder="搜索菜单..."
                                onChange={onSearchChange}
                                allowClear
                            />
                        </div>
                        <div className="flex-1 overflow-y-auto pt-0 px-[16px] pb-[10px]">
                            <ModoTree
                                treeData={treeData}
                                selectedKeys={selectedKeys}
                                onSelect={onSelect}
                                onExpand={onExpand}
                                expandedKeys={expandedKeys}
                                autoExpandParent={autoExpandParent}
                                onRightClick={handleTreeRightClick}
                            />
                        </div>
                    </div>

                    {/* Tree Context Menu */}
                    {contextMenu.visible && (
                        <Dropdown
                            open
                            onOpenChange={open => !open && handleContextMenuClose()}
                            menu={{
                                items: [
                                    { key: 'add', icon: <AddDuotone />, label: '新增子节点', onClick: () => { handleCreate(contextMenu.nodeKey!); handleContextMenuClose(); } },
                                    { key: 'edit', icon: <PencilDuotone />, label: '编辑节点', onClick: () => { handleEdit(allMenusRaw.find(m => m.menuId === contextMenu.nodeKey)!); handleContextMenuClose(); } },
                                    { key: 'delete', icon: <TrashDuotone />, label: '删除节点', danger: true, onClick: () => { handleDelete(contextMenu.nodeKey!); handleContextMenuClose(); } },
                                ],
                            }}
                        >
                            <div style={{ position: 'fixed', left: contextMenu.x, top: contextMenu.y, width: 1, height: 1 }} />
                        </Dropdown>
                    )}
                </Sider>

                <Content className="flex-1 flex flex-col overflow-hidden bg-white">
                    <PageFilter
                        form={searchForm}
                        onSearch={handleSearch}
                        onReset={handleReset}
                        searchParams={searchParams}
                        setSearchParams={setSearchParams}
                        labelMap={{ menuName: '模块编码', menuLabel: '模块中文名' }}
                    >
                        <Form.Item name="menuName" label="模块编码">
                            <ModoInput placeholder="输入模块编码" allowClear />
                        </Form.Item>
                        <Form.Item name="menuLabel" label="模块中文名">
                            <ModoInput placeholder="输入模块中文名" allowClear />
                        </Form.Item>
                    </PageFilter>

                    <div className="flex-1 flex flex-col overflow-hidden relative">
                        <div className="px-4 py-3 flex justify-between items-center bg-white z-10">
                            <ModoButton type="primary" icon={<AddDuotone />} onClick={() => handleCreate()}>
                                新建菜单
                            </ModoButton>
                        </div>

                        <div className="flex-1 overflow-hidden">
                            <ModoTable
                                columns={columns}
                                dataSource={data}
                                rowKey="menuId"
                                loading={loading}
                                scroll={{ x: 1000, y: 'calc(100% - 0px)' }}
                            />
                        </div>

                        <div>
                            <ModoPagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={total}
                                onChange={(p, s) => { setCurrentPage(p); setPageSize(s); }}
                            />
                        </div>
                    </div>
                </Content>
            </Layout>

            <ModoDrawer
                title={drawerMode === 'create' ? '新建菜单' : '编辑菜单'}
                open={drawerVisible}
                onCancel={() => setDrawerVisible(false)}
                onOk={handleSave}
                size={500}
            >
                <Form
                    key={formKey}
                    form={menuForm}
                    layout="vertical"
                    initialValues={{ state: '1', sortNum: 1, openType: '0', linkType: 'inner', fetchMode: 'route', menuType: 'frame' }}
                >
                    <div className="flex flex-col">
                        <Form.Item name="menuName" label="模块编码" rules={[{ required: true, message: '请输入模块编码' }]}>
                            <ModoInput placeholder="请输入模块编码" />
                        </Form.Item>
                        <Form.Item name="menuLabel" label="模块中文名" rules={[{ required: true, message: '请输入模块中文名' }]}>
                            <ModoInput placeholder="请输入模块中文名" />
                        </Form.Item>
                    </div>

                    <Form.Item name="parentId" label="父模块">
                        <TreeSelect
                            treeData={treeData}
                            placeholder="请选择父模块（根节点留空）"
                            allowClear
                            treeDefaultExpandAll
                        />
                    </Form.Item>

                    <div className="flex flex-col">
                        <Form.Item name="sortNum" label="排序">
                            <InputNumber style={{ width: '100%' }} min={1} />
                        </Form.Item>
                        <Form.Item name="menuIcon" label="图标">
                            <Select
                                placeholder="选择图标"
                                allowClear
                                options={[
                                    { label: '系统设置', value: 'GearDuotone' },
                                    { label: '用户管理', value: 'HumanDuotone' },
                                    { label: '应用中心', value: 'AppstoreDuotone' },
                                ]}
                            />
                        </Form.Item>
                    </div>

                    <div className="flex flex-col">
                        <Form.Item name="state" label="状态">
                            <Radio.Group optionType="button" buttonStyle="solid">
                                <Radio.Button value="1">发布</Radio.Button>
                                <Radio.Button value="0">禁用</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item name="menuType" label="菜单类型">
                            <Radio.Group optionType="button" buttonStyle="solid">
                                <Radio.Button value="frame">侧边</Radio.Button>
                                <Radio.Button value="nav">顶栏</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item name="openType" label="打开方式">
                            <Radio.Group optionType="button" buttonStyle="solid">
                                <Radio.Button value="0">内嵌</Radio.Button>
                                <Radio.Button value="1">新窗</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </div>

                    <Form.Item name="menuDescr" label="描述说明">
                        <ModoTextArea rows={3} placeholder="请输入描述信息" />
                    </Form.Item>
                </Form>
            </ModoDrawer>
        </ModoPage>
    );
}
