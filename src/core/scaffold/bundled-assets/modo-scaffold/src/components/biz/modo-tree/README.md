# ModoTree

树形控件，用于展示层级结构数据。

## 特性

- ✅ **呼吸感布局**：默认节点垂直间距优化。
- ✅ **扁平化风格**：取消传统连接线，强调背景色交互。
- ✅ **品牌对齐**：选中态背景色自动对齐 `token.colorPrimaryBg`。
- ✅ **圆角一致**：交互背景使用 2px 圆角。

## 引入

```tsx
import { ModoTree } from '@/components/ModoTree';
```

## 默认配置项

| 属性 | 默认值 | 说明 |
|------|------|------|
| `blockNode` | `true` | 节点占据全行，点击更方便 |
| `showLine` | `false` | 默认不显示连接线 |
| `switcherIcon` | `TriangleDownDuotone` / `TriangleRightDuotone` | 展开用 Down，收起用 Right |

## 样式标准 (Design Tokens)

- **节点标准**:
    - **高度**: 锁定 **28px** (Small 级别)，强制无底部间距 (`margin-bottom: 0`, `line-height: 28px`)。
    - **选中背景**: `token.colorPrimaryBg` (#E8F3FF)。
    - **悬停背景**: `token.colorFillAlter` (#F9FBFD)。

- **原子元素规格**:
    - **Switcher (展开/收起)**: **必须**使用自定义容器实现。规格：**12px x 12px**，圆角 **2px**，背景色 `#EFF4F9` (Neutral-2)，右间距 **0px**。内部图标尺寸 **8px** 并居中。
    - **Checkbox (复选框)**: 尺寸 **12px x 12px** (圆角 2px)，**左外边距 4px**，右间距 **0px**。内部对钩尺寸 **3px x 6px**，定位偏移 **Top: 45%, Left: 20%**。
    - **Icon (类型图标)**: 容器宽 **16px** 高 **28px** (垂直居中)，**右内边距 4px**，颜色 `token.colorTextSecondary` (#79879C)。支持动态切换 (Opened/Closed/Leaf)。
    - **Indent (缩进)**: 宽度 **12px**，**右外边距 4px**。

- **布局间距流**:
    > `[Indent 12px+4px]` -> `[Switcher 12px+0px]` -> `[Checkbox 4px+12px+0px]` -> `[Icon 16px+4px]` -> `[Text]`

- **连接线 (ShowLine)**:
    - 垂直线居中对齐 12px 缩进列 (Right: 6px)。
    - 父子节点间**无垂直连接线**。
    - 节点图标**无水平连接线**。
- **辅助说明文字**: `token.colorTextDescription` (#B3C0CC)

## API (Props)

继承自 Ant Design `TreeProps`，并包含以下扩展属性：

| 参数 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **`compact`** | `boolean` | `true` | 是否启用紧凑模式（强制 28px 行高、12px 多选框等）。建议保持开启以符合 MODO 规范。 |
| **`switcherIcon`** | `ReactNode` | `(props) => ...` | 默认提供带背景色圆角(2px)的自定义展开/收起图标。 |

## Supported Ant Design Props (透传属性)

本组件完整支持并透传所有标准 Ant Design Tree 属性，常用包括：
- **数据**: `treeData`, `fieldNames`
- **交互**: `onSelect`, `onCheck`, `onExpand`
- **状态**: `selectedKeys`, `checkedKeys`, `expandedKeys`
- **样式**: `showLine`, `showIcon`, `blockNode`

完整列表请查阅 [Ant Design Tree API](https://ant.design/components/tree-cn/#API)。
