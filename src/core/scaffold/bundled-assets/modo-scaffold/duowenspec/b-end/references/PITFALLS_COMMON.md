# Common Pitfalls (通用坑点)

本文档记录 AntD + Next.js App Router 工程中的通用问题及修复方案。
**在生成代码前务必检查本文档**，避免重复踩坑。

> 标记说明：`[ALL-LEVELS]` = 所有解析层级均需注意

---

## P-001: 静态方法必须通过 `App.useApp()` 获取 `[ALL-LEVELS]`

**触发场景**: 页面中使用 `message.success()`、`notification.info()`、`Modal.confirm()` 等。

**错误表现**:
> Warning: [antd: message] Static function can not consume context like dynamic theme. Please use 'App' component instead.

**根因**: Ant Design 的静态方法 (`message`, `notification`, `modal`) 不在 React 组件树内，无法读取 `ConfigProvider` 注入的主题 Token。

**修复**:

> ⚠️ 注意: `App.useApp()` 内部使用了 React Context 钩子。而在 Next.js App Router 中，默认组件均为 React Server Components (RSC)，无法直接使用钩子。
> 因此，**调用此方法的组件文件顶部必须显式声明 `'use client'`**。

```tsx
// ❌ 错误 - 静态导入无法消费主题上下文
import { message } from 'antd';
message.success('操作成功');

// ✅ 正确 - 必须是 Client Component，通过 App.useApp() 获取实例
'use client';
import { App } from 'antd';
const { message, notification, modal } = App.useApp();
message.success('操作成功');
```

**前置条件**: 主题 Registry 必须在 `ConfigProvider` 内部包裹 `<App>` 组件：

```tsx
<ConfigProvider theme={...}>
    <App>
        {children}
    </App>
</ConfigProvider>
```

---

## P-002: Modal 内 Form 的 `useForm` 连接问题 `[ALL-LEVELS]`

**触发场景**: 在 Modal 中使用 `Form.useForm()` 绑定表单。

**错误表现**:
> Warning: Instance created by `useForm` is not connected to any Form element. Forget to pass `form` prop?

**根因**: Modal 默认启用 `destroyOnHidden`，Modal 关闭后 DOM 被销毁，`useForm()` 创建的 form 实例与 `<Form>` 断开。在 Modal 未打开时调用 `form.resetFields()` / `form.setFieldsValue()` 也会触发此警告。

**修复**: 不要在 Modal 打开前操作 Form，改用 `useEffect` 监听 `open` 状态，在 Form 挂载后再初始化值：

```tsx
// ❌ 错误 - Modal 未开启时操作 Form，Form 尚未挂载
const handleEdit = (record) => {
    form.setFieldsValue(record);  // Form 未挂载，触发警告
    setOpen(true);
};

// ✅ 正确 - 等 Modal 打开（Form 挂载）后再设置值
const handleEdit = (record) => {
    setEditingRecord(record);
    setOpen(true);
};

const handleCreate = () => {
    setEditingRecord(null);
    setOpen(true);
};

// Modal 打开后统一初始化表单
useEffect(() => {
    if (!open) return;
    if (editingRecord) {
        form.setFieldsValue(editingRecord);
    } else {
        form.resetFields();
    }
}, [open, editingRecord, form]);
```

**注意**: `forceRender` + `destroyOnHidden={false}` 同样可解决此问题，但在 Next.js App Router 中会引发 SSR 水合错误（见 P-003），因此推荐使用 `useEffect` 方案。

---

## P-003: Modal 导致的 SSR 水合错误 `[ALL-LEVELS]`

**触发场景**: 在 Next.js App Router 中使用带有 `forceRender` 的 Modal 组件。

**错误表现**:
> Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client.
>
> 堆栈指向 Modal 内部的 Portal 组件。

**根因**:
1. `forceRender={true}` 强制在服务器端渲染 Modal DOM
2. Modal 内部使用 `Portal` 挂载到 `document.body`
3. 服务器端不存在 `document.body`，导致服务器端和客户端 HTML 不匹配

**修复**:

```tsx
// ❌ 错误 - 导致 SSR 水合冲突
<Modal
    open={isModalOpen}
    forceRender
    destroyOnHidden={false}
>
    <Form form={form}>...</Form>
</Modal>

// ✅ 正确 - 仅在客户端渲染 Modal
function MyPage() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <>
            {/* 其他内容 */}
            {isMounted && (
                <Modal open={isModalOpen}>
                    <Form form={form}>...</Form>
                </Modal>
            )}
        </>
    );
}
```

**说明**:
- 移除 `forceRender` 和 `destroyOnHidden` 属性
- 使用 `isMounted` 状态确保 Modal 只在客户端渲染
- 对于简单的 Modal（无复杂 Form 状态），也可以使用默认的 `destroyOnHidden={true}`

---

## P-004: `fail()` 返回类型与具体泛型 `ApiResponse<T>` 不兼容 `[ALL-LEVELS]`

**触发场景**: 在 Server Action 中使用 `withAcl` 包装，函数标注了具体返回类型（如 `Promise<ApiResponse<User[]>>`），catch 块中调用 `fail(message)` 时报类型错误。

**错误表现**:
```
TS2322: Type 'ApiResponse<null>' is not assignable to type 'ApiResponse<User[]>'.
  Type 'null' is not assignable to type 'User[]'.
```

**根因**:
`fail()` 的实现返回类型为 `ApiResponse<null>`（`data` 字段硬编码为 `null`），而函数签名期望的是 `ApiResponse<T>`（如 `ApiResponse<User[]>`）。TypeScript 类型系统要求 `null` 可赋值给 `T`，但当 `T` 是具体类型（如 `User[]`）时，`null` 不兼容，从而报错。

**修复**:

在 catch 块（或提前返回处）对 `fail()` 的结果使用 `as any` 强转：

```typescript
// ❌ 错误 - 类型不兼容
export const getUsersAction = withAcl('user:list', async (): Promise<ApiResponse<User[]>> => {
    try {
        const users = await db.select().from(modoUser);
        return success(users);
    } catch (e: any) {
        return fail(e.message); // TS2322: ApiResponse<null> 不能赋值给 ApiResponse<User[]>
    }
});

// ✅ 正确 - 添加 as any 消除类型不兼容
export const getUsersAction = withAcl('user:list', async (): Promise<ApiResponse<User[]>> => {
    try {
        const users = await db.select().from(modoUser);
        return success(users);
    } catch (e: any) {
        return fail(e.message) as any; // ✅ 运行时 data 为 null，调用方通过 res.code !== 0 判断
    }
});
```

**说明**:
- `as any` 在此处是安全的：调用方通过 `if (res.code !== 0)` 分支处理失败情况，不会访问 `res.data`。
- 更彻底的方案是将 `fail()` 改为泛型 `fail<T = never>(message: string): ApiResponse<T>`，但这需要修改 `api-response.ts` 公共文件，影响范围较大，非必要时不推荐。

