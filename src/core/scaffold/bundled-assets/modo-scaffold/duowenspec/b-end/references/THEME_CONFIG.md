# modo Theme Configuration (主题初始化)

在使用 modo 适配器时，需确保项目正确配置了 modo 主题系统。

---

## 1. 主题文件

modo 适配器提供两个核心主题文件，位于 `adapters/modo/theme/` 下：

- **`modo-algorithm.ts`** — Ant Design Custom Algorithm，全量覆盖 AntD 预设色板
- **`antd-theme-token.tsx`** — 主题 Token 配置，包含 modo 设计系统的所有定制 Token

### 复制逻辑

1. 检查项目中 `src/theme/modo-algorithm.ts` 和 `src/theme/antd-theme-token.tsx` 是否存在。
2. 若不存在，**必须**从适配器的 `theme/` 目录复制这两个文件到项目的 `src/theme/` 目录下。
3. 若已存在，检查内容是否与适配器版本一致，必要时更新。

---

## 2. ModoThemeRegistry Client Component

**必须**创建一个 Client Component 封装主题配置，以支持 Next.js App Router 的 SSR：

```tsx
'use client';

import { ConfigProvider, App } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import zhCN from 'antd/locale/zh_CN';
import { themeConfig } from '@/theme/antd-theme-token';

export function ModoThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <ConfigProvider theme={themeConfig} locale={zhCN}>
        <App>
          {children}
        </App>
      </ConfigProvider>
    </AntdRegistry>
  );
}
```

### 关键要求

1. **必须声明 `'use client'`** — ConfigProvider 的 `algorithm` 是函数，无法在 Server Component 中序列化。
2. **必须安装 `@ant-design/nextjs-registry`** — 提供 SSR 样式注入支持。
3. **必须在 `ConfigProvider` 内部包裹 `<App>`** — 使 `message`、`notification`、`modal` 等静态方法能消费主题上下文（见 PITFALLS_COMMON.md P-001）。
4. **必须配置 `locale` 为 `zh_CN`** — `import zhCN from 'antd/locale/zh_CN';`
5. **在 Root Layout 中引入** — 在 `layout.tsx` 中使用 `<ModoThemeRegistry>` 而非直接使用 `ConfigProvider`，避免 Server Component 传递函数到 Client Component 的序列化报错。

---

## 3. Root Layout 集成

```tsx
// app/layout.tsx
import { ModoThemeRegistry } from '@/components/ModoThemeRegistry';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <ModoThemeRegistry>
          {children}
        </ModoThemeRegistry>
      </body>
    </html>
  );
}
```

---

## 4. Tailwind CSS 全局样式 (Global Styles)

对于使用 Tailwind CSS 4.0 的项目，项目中的 `src/app/globals.css` **必须完全同步**自适配器的全局样式文件。

### 同步逻辑

1. **源路径**：`adapters/modo/components/globals.css`
2. **目标路径**：项目根目录下的 `src/app/globals.css`
3. **同步要求**：
   - **禁止部分复制**：必须将源文件的全部内容（含完整的 @theme Token 定义、全局滚动条样式、布局重置逻辑）完整覆盖至目标文件，以确保 Tailwind CSS 变量在整个项目范围内可用。
   - **适配器优先**：当适配器更新了 `components/globals.css` 时，项目应同步更新以保证视觉一致性。
   - **Tailwind v4 语法**：确保目标文件正确包含 `@import "tailwindcss";` 及 MODO 规范定义的 `@theme` 块。
