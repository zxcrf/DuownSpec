# ModoDrawer

抽屉组件，基于 Ant Design Drawer 封装，提供统一的交互模式。

## 特性

- ✅ 关闭按钮固定在标题栏右侧
- ✅ 底部操作按钮（取消/确定）右对齐
- ✅ 默认宽度 500px
- **内置配置**：内置了 `destroyOnHidden`（关闭时销毁）等常用配置。
- ✅ 支持加载状态

## 引入

```tsx
import { ModoDrawer } from '@/components/modo-drawer';
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `ReactNode` | - | 抽屉标题 |
| `open` | `boolean` | - | 是否可见 |
| `onCancel` | `() => void` | - | 取消/关闭按钮回调 |
| `onOk` | `() => void` | - | 确定按钮回调 |
| `cancelText` | `string` | `'取消'` | 取消按钮文字 |
| `okText` | `string` | `'确定'` | 确定按钮文字 |
| `confirmLoading` | `boolean` | `false` | 确定按钮加载状态 |
| `size` | `'default' \| 'large'` | `'default'` | 预设宽度级别 |
| `width` | `string \| number` | `500` | 自定义宽度 |
| `showFooter` | `boolean` | `true` | 是否显示底部栏，设为 `false` 时完全隐藏底部区域 |
| `footer` | `ReactNode` | - | 自定义底部内容（覆盖默认按钮），传入 `null` 或 `false` 可隐藏 |
| `children` | `ReactNode` | - | 抽屉内容 |
| 其他 | - | - | 继承 Ant Design `DrawerProps`（除 `extra`、`footer`、`closable`） |

## 交互规范

### 关闭按钮

- 位置：标题栏最右侧
- 图标：`CloseOutlined`
- 点击时触发 `onCancel` 回调

### 底部按钮

- 位置：抽屉底部
- 对齐方式：右对齐
- 按钮顺序：取消（左）、确定（右）
- 确定按钮支持 `confirmLoading` 加载状态

## 使用示例

### 基础用法

```tsx
import { ModoDrawer } from '@/components/modo-drawer';
import { Form, Input } from 'antd';

const [visible, setVisible] = useState(false);
const [form] = Form.useForm();

const handleSave = async () => {
    const values = await form.validateFields();
    console.log(values);
    setVisible(false);
};

<ModoDrawer
    title="编辑用户"
    open={visible}
    onCancel={() => setVisible(false)}
    onOk={handleSave}
>
    <Form form={form} layout="vertical">
        <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
            <Input />
        </Form.Item>
    </Form>
</ModoDrawer>
```

### 带加载状态

```tsx
const [loading, setLoading] = useState(false);

const handleSave = async () => {
    setLoading(true);
    try {
        await saveData();
        setVisible(false);
    } finally {
        setLoading(false);
    }
};

<ModoDrawer
    title="保存数据"
    open={visible}
    onCancel={() => setVisible(false)}
    onOk={handleSave}
    confirmLoading={loading}
>
    ...
</ModoDrawer>
```

### 自定义按钮文字

```tsx
<ModoDrawer
    title="删除确认"
    open={visible}
    onCancel={() => setVisible(false)}
    onOk={handleDelete}
    cancelText="取消"
    okText="删除"
>
    确定要删除此项吗？
</ModoDrawer>
```

### 隐藏底部按钮

```tsx
<ModoDrawer
    title="查看详情"
    open={visible}
    onCancel={() => setVisible(false)}
    showFooter={false}
>
    <p>只读内容...</p>
</ModoDrawer>
```

### 自定义底部

```tsx
<ModoDrawer
    title="自定义底部"
    open={visible}
    onCancel={() => setVisible(false)}
    footer={
        <Space>
            <Button>草稿</Button>
            <Button type="primary">提交审核</Button>
        </Space>
    }
>
    ...
</ModoDrawer>
```

## 默认配置

| 配置项 | 值 | 说明 |
|--------|-----|------|
| 宽度 | `500px` | 可通过 `styles.wrapper.width` 覆盖 |
| `destroyOnClose` | `true` | 关闭时销毁子组件 |
| `autoFocus` | `false` | 不自动聚焦 |
| `closable` | `false` | 禁用默认关闭按钮（使用自定义） |

## 相关组件

- [Modal](https://ant.design/components/modal-cn) - 对话框（适用于小型确认操作）
