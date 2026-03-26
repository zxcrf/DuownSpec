import type { SkillTemplate } from '../types.js';

export function getBEndDeliverySkillTemplate(): SkillTemplate {
  return {
    name: 'openspec-b-end-delivery',
    description: 'MODO B 端界面交付总控。负责识别页面模式、锁定模板入口，并把 OpenSpec 产物转成稳定一致的前端交付方案。',
    instructions: `在 MODO 项目里处理 B 端页面或控制台界面时，使用这个技能作为总控入口。

## 适用前提

- 项目根目录存在 \`.b-end-adapter\`
- 其内容为 \`modo\`
- 需求来源是 OpenSpec 产物，而不是 \`.prd\`

## 核心原则

1. **OpenSpec 是唯一需求来源**
   - 优先读取当前 change 的 \`proposal.md\`、\`specs/\`、\`design.md\`、\`tasks.md\`
   - 不要把 \`.prd\` 当成需求入口，也不要要求用户先补 PRD
2. **模板优先，不自由发明布局**
   - 先选页面模式，再读对应模板
   - 能套标准模板时，不要重新设计新的页面骨架
3. **组件优先用项目内 Biz 组件**
   - 组件映射与降级规则统一以 \`openspec/b-end/MANIFEST.md\` 为准
4. **最终输出必须经过一致性复核**
   - 真正结束前，调用 \`openspec-b-end-review\`

## 固定流程

1. 读取 \`.b-end-adapter\`，确认当前适配器是 \`modo\`
2. 读取当前 OpenSpec 产物，提炼页面目标、用户动作、关键数据和约束
3. 打开 \`openspec/b-end/MANIFEST.md\`，了解可用 Biz 组件和角色映射
4. 从以下模式中选择一个最匹配的页面模式：
   - \`console-layout\`
   - \`dashboard\`
   - \`data-dense-grid\`
   - \`gallery-grid\`
   - \`master-tree-table\`
   - \`wizard\`
5. 打开对应模式文档 \`openspec/b-end/patterns/<pattern>.md\`
6. 打开对应模板目录 \`src/components/templates/<pattern>/\`
7. 输出一份交付简报，至少包含：
   - 选中的模式
   - 对应模板路径
   - 需要的核心角色 / 组件
   - 需要保持的一致性约束
   - 是否需要额外调用 \`openspec-b-end-components\`
8. 若进入实现或代码修改阶段，继续调用 \`openspec-b-end-components\`
9. 完成前必须调用 \`openspec-b-end-review\`

## 输出格式

\`\`\`
B-End Delivery Brief
- Pattern: <pattern>
- Template: <path>
- Key Roles: <roles>
- Required Biz Components: <components>
- Consistency Rules: <rules>
- Open Questions: <questions>
\`\`\`

## 禁止事项

- 不要重新引入 \`.prd\`
- 不要跳过模式选择直接写页面
- 不要凭印象发明 Biz 组件导入路径
- 不要绕开模板，直接从存量业务页复制拼装
- 不要在同一任务里混用多套视觉语言`,
    license: 'MIT',
    compatibility: '需要安装 dwsp CLI。',
    metadata: { author: 'openspec', version: '1.0' },
  };
}

export function getBEndComponentsSkillTemplate(): SkillTemplate {
  return {
    name: 'openspec-b-end-components',
    description: 'MODO B 端组件解析与降级规则。优先使用项目内 Biz 组件，必要时再按文档做降级实现。',
    instructions: `当页面需要具体组件时，使用这个技能把“页面角色”解析成真正可落地的组件与导入路径。

## 固定输入

开始前先读取：
- \`openspec/b-end/MANIFEST.md\`
- 如果需要降级，再读取 \`openspec/b-end/references/fallback/<Role>.md\`

## 解析顺序

1. 先确定当前页面需要的角色，例如：
   - \`DataTable\`
   - \`Filter\`
   - \`Pagination\`
   - \`PageWrapper\`
   - \`ActionGroup\`
2. 在 \`openspec/b-end/MANIFEST.md\` 里查对应映射
3. **优先选择 Biz Component**
   - Biz 列有值时，先去 \`src/components/biz/<dir>/\` 验证文件是否存在
   - 存在才允许导入
4. **Biz 不可用时才允许降级**
   - 如果 Manifest 给了 fallback，就读取对应 fallback 文档，再用 antd / Tailwind 组合实现
5. **仍然不可用时再手写**
   - 手写前要参考 \`openspec/b-end/references/ANTI_PATTERNS.md\`

## 强制约束

- **绝不允许幻觉导入**：导入前必须验证目标文件存在
- **绝不允许在页面里写魔法字典**：下拉选项、状态映射、Badge 文案统一落到 \`src/lib/constants.ts\`
- **图标优先 modo-icon**：没有现成图标时，再退到已验证存在的 Ant Design 官方图标
- **页面包装优先级固定**：路由级页面优先使用 \`ModoPage\`、\`ModoContainer\`、\`ModoPagination\` 等标准壳组件

## 输出格式

\`\`\`
Component Resolution
- Role: <role>
- Decision: Biz | Fallback | Scratch
- Import: <path or package>
- Files Checked: <paths>
- Extra Rules: <notes>
\`\`\`

## 禁止事项

- 不要凭经验猜组件名
- 不要直接跳过 Manifest
- 不要在表格、分页、筛选区域混入另一套页面结构
- 不要把临时演示数据和真实常量写死在 page.tsx 里`,
    license: 'MIT',
    compatibility: '需要安装 dwsp CLI。',
    metadata: { author: 'openspec', version: '1.0' },
  };
}

export function getBEndReviewSkillTemplate(): SkillTemplate {
  return {
    name: 'openspec-b-end-review',
    description: 'MODO B 端界面一致性门禁。在页面代码输出前检查布局、组件、交互和视觉规范是否统一。',
    instructions: `在输出页面代码或宣布完成前，必须执行这份复核。

## 先读取这些项目内文档

- \`openspec/b-end/references/DESIGN_SPEC.md\`
- \`openspec/b-end/references/TOKENS.md\`
- \`openspec/b-end/references/THEME_CONFIG.md\`
- \`openspec/b-end/references/PITFALLS.md\`
- \`openspec/b-end/references/PITFALLS_COMMON.md\`

## 必检清单

1. **页面模式一致**
   - 当前页面是否仍然符合选定 pattern
   - 是否基于对应模板目录展开，而不是临时换骨架
2. **主题启动链完整**
   - 是否保留 \`src/theme/modo-algorithm.ts\`
   - 是否保留 \`src/theme/antd-theme-token.tsx\`
   - 是否保留 \`src/components/ModoThemeRegistry.tsx\`
   - 是否保留 \`src/app/globals.css\`
3. **壳组件使用正确**
   - 路由级页面是否使用 \`ModoPage\`（登录页等特殊页面除外）
   - 分页是否使用 \`ModoPagination\`
4. **交互规则正确**
   - 危险操作是否用 \`Popconfirm\` 二次确认
   - Modal / message / notification 是否通过 \`App.useApp()\` 获取上下文
5. **布局规则正确**
   - 不要使用 Ant Design \`Flex\`
   - 表格区不要包多余容器破坏高度计算
6. **组件与导入正确**
   - 没有不存在的 Biz 组件导入
   - 需要降级的角色已经按 fallback 文档处理
7. **业务常量正确**
   - 状态文案、下拉选项、映射字典没有内联在页面文件里
8. **需求来源正确**
   - 页面实现是否仍与当前 OpenSpec 产物一致
   - 没有重新依赖 \`.prd\`

## 输出格式

\`\`\`
B-End Review
- Status: pass | changes-required
- Findings:
  - <finding 1>
  - <finding 2>
- Fixed Before Finish:
  - <fix 1>
- Remaining Risks:
  - <risk 1>
\`\`\`

## 结论规则

- 只要有任何会破坏统一性、交互规范或组件可用性的点，就必须给出 \`changes-required\`
- 如果结论是 \`pass\`，要明确说明你核对过哪些约束
- 如果无法确认某项规则是否满足，不能假装通过，必须写成风险`,
    license: 'MIT',
    compatibility: '需要安装 dwsp CLI。',
    metadata: { author: 'openspec', version: '1.0' },
  };
}
