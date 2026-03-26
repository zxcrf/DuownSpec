# modo Adapter Pitfalls (modo 专属坑点)

本文档记录仅在使用 modo Biz Components 时才会遇到的坑点。

> 标记说明：`[BIZ-ONLY]` = 仅使用 Biz 组件（Level 1）时需注意

---

## P-100: ModoTable 内容不显示（高度坍缩） `[BIZ-ONLY]`

**触发场景**: 将 `ModoTable` 包裹在额外的 `<div>` 中，而非直接作为 flex 容器的子元素。

**错误表现**:
- 分页条显示正确的数据总数（如"共 9 条"）
- 表格主体区域完全空白，看不到任何行数据

**根因**:
ModoTable 依赖自身是父 flex 容器的直接子元素来撑开高度：
```css
.modo-table { flex: 1; min-height: 0; position: relative; }
.ant-table-wrapper { position: absolute; inset: 0; } /* 绝对定位填满父容器 */
```
若在外层套了非 flex 的 `<div>`，`flex: 1` 失效，`.modo-table` 高度坍缩为 0，内容被 `overflow: hidden` 裁切不可见。

**修复**:

```tsx
// ❌ 错误 - 多余的包裹 div 导致高度坍缩
<div className="flex-1 flex flex-col">
  <div className="flex-1 min-h-0" style={{ padding: '0 16px' }}>
    <ModoTable dataSource={data} columns={columns} />
  </div>
</div>

// ✅ 正确 - ModoTable 直接作为 flex 子元素或显式设置父级容器
// 注意：容器需具备 position: relative 以供表格内部绝对定位
<div className="flex-1 min-h-0 overflow-hidden relative px-4">
  <ModoTable 
    dataSource={data} 
    columns={columns} 
    scroll={{ x: 1000, y: '100%' }} // 建议使用 100% 填满内容区
  />
</div>
```
---

## P-201: 禁止使用已弃用的 antd `List` 组件 `[ALL-LEVELS]`

**触发场景**: 使用 `<List>` / `<List.Item>` / `<List.Item.Meta>` 渲染列表。

**错误表现**:
```
Warning: [antd: List] The `List` component is deprecated.
And will be removed in next major version.
```

**修复**:
用原生 `div + Array.map()` 替代，样式等价：

```tsx
// ❌ 错误
<List
    dataSource={items}
    renderItem={(item) => (
        <List.Item extra={<Switch />}>
            <List.Item.Meta title={item.name} description={item.desc} />
        </List.Item>
    )}
/>

// ✅ 正确
{items.map(item => (
    <div key={item.id} style={{
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: '8px 0', borderBottom: '1px solid #f5f5f5', gap: 12,
    }}>
        <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 500 }}>{item.name}</div>
            <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>{item.desc}</div>
        </div>
        <Switch />
    </div>
))}
```

---

## P-300: ModoTable 禁止传入 `title`（字符串）或 `extra` prop `[BIZ-ONLY]`

**触发场景**: 将字符串赋值给 `ModoTable` 的 `title` 属性，或传入 antd Table 不支持的 `extra` 属性。

**错误表现**:
```
TypeError: title is not a function
    at ModoTable (modo-table/index.tsx:41)
```
页面白屏并显示 Next.js 红色错误覆盖层。

**根因**:
`ModoTable` 将所有 props **直接透传**给 antd 的 `<Table>`。antd Table 的 `title` 属性类型为 `(currentPageData: T[]) => ReactNode`（函数），而非字符串。传入字符串后，antd 内部调用 `title()` 时立即抛出 `TypeError: title is not a function`。`extra` 属性并不存在于 antd Table 的合法 props 中。

**修复**:

将标题文本和操作按钮（如「新建」）放在 `ModoTable` **外部**的布局层，不要通过 Table 的 props 传入：

```tsx
// ❌ 错误 - title 传字符串，extra 不是合法 Table prop
<ModoTable
    title="角色列表"
    extra={<ModoButton>新建角色</ModoButton>}
    dataSource={data}
    columns={columns}
/>

// ✅ 正确 - 标题和操作按钮在 ModoTable 外部独立布局
<div className="flex flex-col h-full gap-2">
    {/* 工具栏：标题 + 操作按钮，独立于 ModoTable */}
    <div className="flex-shrink-0 flex justify-between items-center py-2">
        <span className="text-sm font-medium text-gray-600">角色列表</span>
        <ModoButton type="primary" onClick={handleNew}>新建角色</ModoButton>
    </div>

    {/* ModoTable 仅负责数据展示，不传 title/extra */}
    <div className="flex-1 min-h-0 overflow-hidden bg-white rounded-lg">
        <ModoTable
            dataSource={data}
            columns={columns}
            rowKey="roleId"
        />
    </div>
</div>
```

**注意**: 如果确实需要表格内置标题行（antd Table 的标准能力），必须传入**函数**而非字符串：
```tsx
// 如确实需要 antd Table 原生 title，需传函数
<ModoTable
    title={() => <span>角色列表</span>}
    ...
/>
```

```

---

## P-400: ACL 权限状态码不一致 `[BACKEND-ONLY]`

**触发场景**: 在 Server Actions 或 `requireAcl` 逻辑中硬编码权限或角色的激活状态。

**错误表现**:
- 数据库中权限/角色已赋权且状态显示“正常”。
- 前端访问报错 `UNAUTHORIZED` 或 `FORBIDDEN`。
- 调试发现数据库字段值为 `'1'`，但代码检查条件为 `'A'`。

**根因**:
项目早期可能使用了 `'A'` (Active) 和 `'D'` (Disabled)，后期统一迁移到了数脂化的枚举状态（如 `'1'` 代表 ACTIVE）。硬编码状态字（Magic Strings）会导致在读取新结构数据库时验证失败。

**修复**:
**严禁**在认证授权相关代码中出现 `'A'`, `'D'`, `'1'`, `'0'` 等硬编码字符串。必须引用 `src/lib/constants.ts` 中的常量。

```typescript
// ❌ 错误 - 硬编码状态值
const perm = await db.select().from(permissions)
    .where(and(eq(permissions.state, 'A')));

// ✅ 正确 - 使用系统统一常量
import { PERM_STATE } from '@/lib/constants';
const perm = await db.select().from(permissions)
    .where(and(eq(permissions.state, PERM_STATE.ACTIVE)));
```

---

## P-500: Drawer `width` 属性已弃用警告 `[BIZ-ONLY]`

**触发场景**: 在使用 `ModoDrawer` 时传入 `width={number}` 属性。

**错误表现**:
```
Warning: [antd: Drawer] `width` is deprecated. Please use `size` instead.
```

**根因**:
Ant Design 5.x/6.x 为了统一响应式分级，建议优先使用 `size="default" | "large"`。对于自定义宽度，虽然 `width` 仍能工作，但在某些环境下会触发控制台警告。

**修复**:
1. 优先使用 `size` 预设：`default` (378px) 或 `large` (736px)。
2. 若必须使用自定义宽度，`ModoDrawer` 内部已拦截并将 `width` 转发至 `styles.wrapper.width` 以消除警告。
3. 请确保引用的是最新版本的 `ModoDrawer` 业务组件。

```tsx
// ✅ 推荐 - 使用预设尺寸
<ModoDrawer size="large" ... />

// ✅ 支持 - 使用自定义宽度（ModoDrawer 已自动处理兼容性）
<ModoDrawer width={600} ... />
```

