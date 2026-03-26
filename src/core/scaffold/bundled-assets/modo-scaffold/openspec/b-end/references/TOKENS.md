# modo Tokens (颜色 + 字体 + 间距)

本文档合并了 modo 设计系统的颜色、字体和间距规范。

---

## 0. 设计系统工程实现 (Engineering Implementation)

MODO 设计系统通过 **Ant Design Custom Algorithm** 实现像素级颜色控制。

*   **核心算法逻辑**：位于 `src/theme/modo-algorithm.ts`。
*   **劫持机制**：该算法不仅覆盖了功能色 (`Success`, `Warning` 等)，还**全量覆盖了 Ant Design 的所有预设色板** (Presets)。
*   **生效方式**：在 `ConfigProvider` 中配置 `algorithm: modoAlgorithm`。这确保了如 `color="green"` 或 `color="orange"` 这样的属性会自动引用 MODO 定义的精确色值，而非 AntD 默认值。

---

## 1. 品牌色 (Primary)

品牌主色用于主要交互元素、按钮、链接等。

| Level | Hex (亮色) | Level | Hex (亮色) |
|-------|------------|-------|------------|
| 1 | `#E8F3FF` | 6 | `#3261CE` |
| 2 | `#BED6F5` | 7 | `#2045AE` |
| 3 | `#97B9EB` | 8 | `#112E8D` |
| 4 | `#739CE2` | 9 | `#071B6D` |
| 5 | `#517ED8` | 10 | `#000D4D` |

---

## 2. 成功色 (Success)

用于成功状态、正面提示等场景。

| Level | Hex (亮色) | Level | Hex (亮色) |
|-------|------------|-------|------------|
| 1 | `#E8FFF0` | 6 | `#55BC8A` |
| 2 | `#C6F2D7` | 7 | `#36A071` |
| 3 | `#A6E4C0` | 8 | `#1E845A` |
| 4 | `#88D7AC` | 9 | `#0C6845` |
| 5 | `#6EC99A` | 10 | `#004D32` |

---

## 3. 警告色 (Warning)

用于警告状态、需要注意的提示等场景。

| Level | Hex (亮色) | Level | Hex (亮色) |
|-------|------------|-------|------------|
| 1 | `#FFFAE8` | 6 | `#F5A623` |
| 2 | `#FDEEBF` | 7 | `#CB7F16` |
| 3 | `#FBDF97` | 8 | `#A15E0B` |
| 4 | `#F9CE70` | 9 | `#773F04` |
| 5 | `#F7BA49` | 10 | `#4D2500` |

---

## 4. 危险色 (Danger)

用于错误状态、危险操作、删除等场景。

| Level | Hex (亮色) | Level | Hex (亮色) |
|-------|------------|-------|------------|
| 1 | `#FFEDE8` | 6 | `#C3342F` |
| 2 | `#F3C6BD` | 7 | `#A51E1E` |
| 3 | `#E79F94` | 8 | `#881014` |
| 4 | `#DB7A6F` | 9 | `#6A060D` |
| 5 | `#CF564E` | 10 | `#4D0008` |

---

## 5. 链接色 (Link)

用于链接、可点击文字等场景。

| Token | 用途 | 亮色模式 | 暗色模式 |
|-------|------|----------|----------|
| `--color-link-5` | 悬停 | `#517ED8` | `#507DE3` |
| `--color-link-6` | 常规 | `#3261CE` | `#729DF4` |
| `--color-link-7` | 点击 | `#2045AE` | `#8FB5F7` |

---

## 6. 背景色 (Background)

用于页面和容器的背景。

| Token | 用途 | 亮色模式 | 暗色模式 |
|-------|------|----------|----------|
| `--color-bg-1` | 整体背景色 | `#FFFFFF` | `#171F30` |
| `--color-bg-2` | 一级容器背景 | `#FFFFFF` | `#212A3C` |
| `--color-bg-3` | 二级容器背景 | `#FFFFFF` | `#313E56` |
| `--color-bg-4` | 三级容器背景 | `#FFFFFF` | `#3D4B65` |
| `--color-bg-5` | 下拉弹出框、文字气泡背景 | `#FFFFFF` | `#576B87` |
| `--color-bg-more` | 超出层级或不清楚层级背景 | `#FFFFFF` | `#76879F` |
| `--color-mask-bg` | 蒙版、遮罩 | `rgba(36, 46, 67, 0.6)` | `rgba(36, 46, 67, 0.6)` |

---

## 7. 填充色 (Fill)

用于组件的填充，如按钮背景、卡片填充等。

| Token | 用途 | 亮色模式 | 暗色模式 |
|-------|------|----------|----------|
| `--color-fill-1` | 浅 & 禁用 | `#F9FBFD` | `#242E43` |
| `--color-fill-2` | **Neutral-2** (常用的 Input/Tree 背景) | `#EFF4F9` | `#35435E` |
| `--color-fill-3` | 深 & 灰底悬停 | `#E3E9EF` | `#4D5E7D` |
| `--color-fill-4` | 重 & 特殊场景 | `#B3C0CC` | `#5E708A` |

---

## 8. 边框色 (Border)

用于边框、分割线等。

| Token | 用途 | 亮色模式 | 暗色模式 |
|-------|------|----------|----------|
| `--color-border-1` | 浅色 | `#EFF4F9` | `#35435E` |
| `--color-border-2` | 一般 & 常规 | `#E3E9EF` | `#4D5E7D` |
| `--color-border-3` | 深 & 悬停 | `#B3C0CC` | `#5E708A` |
| `--color-border-4` | 重 & 按钮描边 | `#79879C` | `#768CA7` |

---

## 9. 文字 & 图标色 (Text)

用于文字和图标。

| Token | 用途 | 亮色模式 | 暗色模式 |
|-------|------|----------|----------|
| `--color-text-1` | 强调 & 正文标题 | `#242E43` | `#FFFFFF` |
| `--color-text-2` | 次强调 & 正文标题 | `#4D5E7D` | `rgba(255, 255, 255, 0.7)` |
| `--color-text-3` | 次要信息 | `#79879C` | `rgba(255, 255, 255, 0.5)` |
| `--color-text-4` | 置灰信息 | `#B3C0CC` | `rgba(255, 255, 255, 0.3)` |

---

## 10. 阴影系统 (Shadow System)

MODO 设计系统采用三级阴影体系，通过阴影高度（Elevation）区分元素层级。

- **基础阴影色 (`--color-shadow`)**: `#242E431A` (中性色 10 级 + 10% 透明度)

| 阴影级别 | CSS 定义 (box-shadow) | 适用场景 |
| :--- | :--- | :--- |
| **一级阴影 (Low)** | `0px 2px 5px 0px var(--color-shadow)` | 基础元素底层（如卡片默认状态、PageFilter 容器） |
| **二级阴影 (Middle)** | `0px 4px 10px 0px var(--color-shadow)` | 常规交互、强调层（如卡片 Hover 状态、下拉菜单 Select Dropdown） |
| **三级阴影 (High)** | `0px 8px 20px 0px var(--color-shadow)` | 空间最顶层元素（如对话框 Modal、通知框 Notification） |

---

## 11. 辅助色 (Auxiliary Colors)

所有辅助色均定义了 1-10 级色阶，由 `modo-algorithm.ts` 劫持并注入 Ant Design 预设系统。

### 11.1 辅助紫 (Purple)
| Level | Hex (亮色) | Level | Hex (亮色) |
|-------|------------|-------|------------|
| 1 | `#F3E8FF` | 6 | `#724BC5` |
| 2 | `#D9C4F3` | 7 | `#5130A7` |
| 3 | `#BFA2E8` | 8 | `#361A89` |
| 4 | `#A582DC` | 9 | `#1F0A6B` |
| 5 | `#8B65D1` | 10 | `#0E004D` |

### 11.2 辅助青 (Cyan)
| Level | Hex (亮色) | Level | Hex (亮色) |
|-------|------------|-------|------------|
| 1 | `#E8FFFA` | 6 | `#35C9C0` |
| 2 | `#BFF4E9` | 7 | `#22AAA5` |
| 3 | `#98E9DC` | 8 | `#128B8B` |
| 4 | `#74DFD0` | 9 | `#07686C` |
| 5 | `#53D4C7` | 10 | `#00424D` |

### 11.3 辅助蓝 (Blue)
*注：此为非品牌色的辅助蓝色。*
| Level | Hex (亮色) | Level | Hex (亮色) |
|-------|------------|-------|------------|
| 1 | `#E8FCFF` | 6 | `#329DCE` |
| 2 | `#BEEBF5` | 7 | `#207CAE` |
| 3 | `#97D9EB` | 8 | `#115E8D` |
| 4 | `#73C6E2` | 9 | `#07426D` |
| 5 | `#51B2D8` | 10 | `#002A4D` |

### 11.4 辅助金 (Gold)
| Level | Hex (亮色) | Level | Hex (亮色) |
|-------|------------|-------|------------|
| 1 | `#FFFEE8` | 6 | `#F5C723` |
| 2 | `#FDF8BF` | 7 | `#CB9E16` |
| 3 | `#FBEF97` | 8 | `#A1760B` |
| 4 | `#F9E470` | 9 | `#775204` |
| 5 | `#F7D749` | 10 | `#4D2D00` |

### 11.5 辅助黄 (Yellow)
| Level | Hex (亮色) | Level | Hex (亮色) |
|-------|------------|-------|------------|
| 1 | `#FCFFE8` | 6 | `#F0EB68` |
| 2 | `#F7FCCD` | 7 | `#C7BE41` |
| 3 | `#F4F9B3` | 8 | `#9E9222` |
| 4 | `#F3F69A` | 9 | `#75670D` |
| 5 | `#F3F380` | 10 | `#4D3800` |

### 11.6 辅助玫红 (Magenta)
| Level | Hex (亮色) | Level | Hex (亮色) |
|-------|------------|-------|------------|
| 1 | `#FFE8F4` | 6 | `#D451A8` |
| 2 | `#F6C6E0` | 7 | `#B2338C` |
| 3 | `#EEA6CF` | 8 | `#901C71` |
| 4 | `#E588C0` | 9 | `#6E0B57` |
| 5 | `#DD6CB3` | 10 | `#4D0034` |

### 11.7 辅助粉紫 (Pink Purple)
| Level | Hex (亮色) | Level | Hex (亮色) |
|-------|------------|-------|------------|
| 1 | `#FDE8FF` | 6 | `#AB3ED1` |
| 2 | `#EFC2F6` | 7 | `#8727B0` |
| 3 | `#DF9DED` | 8 | `#66158F` |
| 4 | `#CF7BE3` | 9 | `#48086E` |
| 5 | `#BD5BDA` | 10 | `#42004D` |

### 11.8 辅助橙红 (Orange Red / Volcano)
| Level | Hex (亮色) | Level | Hex (亮色) |
|-------|------------|-------|------------|
| 1 | `#FFF3E8` | 6 | `#E2682F` |
| 2 | `#F9DAC0` | 7 | `#BD4B1D` |
| 3 | `#F3BF99` | 8 | `#973210` |
| 4 | `#EEA374` | 9 | `#721D06` |
| 5 | `#E88651` | 10 | `#4D0E00` |

### 11.9 辅助绿 (Lime)
| Level | Hex (亮色) | Level | Hex (亮色) |
|-------|------------|-------|------------|
| 1 | `#F9FFE8` | 6 | `#8FBC55` |
| 2 | `#E4F2C6` | 7 | `#6FA036` |
| 3 | `#CFE4A6` | 8 | `#51841E` |
| 4 | `#BAD788` | 9 | `#37680C` |
| 5 | `#A5C96E` | 10 | `#2A4D00` |

---

## 12. 中性色 (Neutral)

基础灰度色阶，用于构建填充、边框、文字等。

| Token | 亮色模式 | 暗色模式 |
|-------|----------|----------|
| `--color-gray-1` | `#F9FBFD` | `#242E43` |
| `--color-gray-2` | `#EFF4F9` | `#35435E` |
| `--color-gray-3` | `#E3E9EF` | `#4D5E7D` |
| `--color-gray-4` | `#B3C0CC` | `#5E708A` |
| `--color-gray-5` | `#95A6BA` | 略深 |
| `--color-gray-6` | `#79879C` | 略深 |
| `--color-gray-7` | `#5E708A` | 略深 |
| `--color-gray-8` | `#4D5E7D` | 略深 |
| `--color-gray-9` | `#35435E` | 略深 |
| `--color-gray-10` | `#242E43` | 略浅 |

---

## 13. 特殊色 (Special)

| Token | 说明 | 值 |
|-------|------|-----|
| `--color-white` | 白色，用于图标、字体等 | `#FFFFFF` |

---

## 14. Ant Design 预设色映射 (Preset Mapping)

为了兼容 Ant Design 的 `color` 属性（如 `<Button color="green">`），系统在算法层建立了以下映射关系：

| AntD 预设名称 | MODO 对应色带 | 示例值 (Level 6) |
|---------------|---------------|------------------|
| `green` | `success` | `#55BC8A` |
| `orange` | `warning` | `#F5A623` |
| `red` | `error` | `#C3342F` |
| `volcano` | `orangered` | `#E2682F` |
| `gold` | `gold` | `#F5C723` |
| `geekblue` | `primary` | `#3261CE` |
| `blue` | `auxiliary blue` | `#329DCE` |

> **注意**：由于 AntD 默认将 `Warning` 视为 `Gold`，MODO 系统在工程实现中将其修正为 `Orange`，以符合 MODO 视觉规范。

---

## 15. 圆角规范 (Border Radius)

MODO 采用精确的直角偏好设计，全局圆角统一为 **2px**。

| Token 名称 | 变量值 | 适用场景 |
| :--- | :--- | :--- |
| `Border Radius Small` | **2px** | **系统标准**：按钮、输入框、卡片、下拉面板、复选框等 |
| `Border Radius None` | 0px | 严格直角场景 |
| `Border Radius Circle` | 50% | 头像、圆形搜索框 |

---

## 16. 字体规范 (Typography)

系统默认基础字体大小调整为 **12px**，以适应专业 B 端系统的高信息密度。

### 16.1 字体大小 (Font Size)

| Token | 值 | 用途 |
| :--- | :--- | :--- |
| `--font-size-xs` | **12px** | **默认基础文字**、表单 Label、辅助文字、标签 |
| `--font-size-sm` | 13px | 次要信息、列表内容 |
| `--font-size-base` | 14px | 正文内容、重要辅助信息 |
| `--font-size-lg` | 16px | 模块标题、中型卡片标题 |
| `--font-size-xl` | 20px | 页面级大标题 |

### 16.2 字重 (Font Weight)

| Token | 值 | 用途 |
| :--- | :--- | :--- |
| `Regular` | 400 | 标准正文 |
| `Medium` | 500 | 强调态、表单 Label |
| `Semi-Bold` | 600 | 标题、重要数值 |

---

## 17. 间距规范 (Spacing)

基于 4px 步进系统。

| Token | 值 | 步进 | 适用场景 |
| :--- | :--- | :--- | :--- |
| `--size-1` | 4px | 1x | **系统标准间距**：图标与文字、复选框与文字、紧凑组件间距 |
| `--size-2` | 8px | 2x | 组件内边距、小元素间距 |
| `--size-3` | 12px | 3x | 核心内边距、中等间距 |
| `--size-4` | 16px | 4x | 页面边距、大模块间距 |
| `--size-6` | 24px | 6x | 页面大板块分割 |

---

## 18. 关键组件适配 (Key Component Specs)

- **树组件 (ModoTree)**：缩进步进使用 **14px**。内部元素（图标/复选框/文字）间距严格遵守 **4px** (`--size-1`)。
- **按钮 (ModoButton)**：图标与文字间距锁定为 **4px**。
- **筛选容器 (PageFilter)**：网格间距使用 `[24, 16]` (`6x`, `4x`)。

---

## 使用指南

### CSS 变量使用示例

```css
.button-primary {
  background-color: var(--color-primary-6);
  color: var(--color-white);
}

.button-primary:hover {
  background-color: var(--color-primary-5);
}

.button-primary:active {
  background-color: var(--color-primary-7);
}

.button-primary:disabled {
  background-color: var(--color-primary-light-3);
}
```

### 主题切换

亮色/暗色模式切换通过 CSS 变量实现，在根元素上切换主题类名即可：

```css
:root {
  /* 亮色模式变量 */
  --color-primary-6: #3261CE;
  --color-bg-1: #FFFFFF;
}

[data-theme="dark"] {
  /* 暗色模式变量 */
  --color-primary-6: #729DF4;
  --color-bg-1: #171F30;
}
```
