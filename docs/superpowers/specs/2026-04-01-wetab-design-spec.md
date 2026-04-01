# WeTab 前端页面设计规范

## 1. 概述

本文档定义了 WeTab 浏览器新标签页扩展的视觉设计规范，为前端工程师提供可执行的 UI 实现参考。

**产品定位**：简洁优雅的浏览器起始页，支持网站收藏、分类管理、任务日程等功能。

**核心风格**：深色毛玻璃（Dark Glassmorphism）风格，融合 Apple 设计语言与现代玻璃拟态效果。

---

## 2. 颜色系统

### 2.1 基础色板

| 用途 | 色值 | 说明 |
|------|------|------|
| 主背景 | `#1a1a2e` | 深蓝黑色，全局背景 |
| 侧边栏背景 | `#16213e` | 比主背景略浅，区分层次 |
| 卡片背景 | `rgba(255, 255, 255, 0.08)` | 半透明白色，毛玻璃底层 |
| 悬浮层背景 | `rgba(255, 255, 255, 0.12)` | hover 状态卡片背景 |
| 强调色 | `#7b68ee` | 紫色，用于 hover 边框、高亮 |
| 辅助强调 | `#6c5ce7` | 深紫，用于 active 状态 |
| 主文字 | `#ffffff` | 白色，标题和重要文字 |
| 次要文字 | `#9ca3af` | 浅灰色，用于说明文字 |
| 占位符文字 | `#6b7280` | 灰色，input placeholder |
| 分割线 | `rgba(255, 255, 255, 0.1)` | 半透明白色线 |

### 2.2 语义色

| 用途 | 色值 |
|------|------|
| 成功 | `#10b981` |
| 警告 | `#f59e0b` |
| 错误 | `#ef4444` |
| 信息 | `#3b82f6` |

---

## 3. 字体系统

### 3.1 字体栈

```css
font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
```

- 优先使用系统字体（苹方在 macOS/iOS，Microsoft YaHei 在 Windows）
- 无衬线字体，适用于界面文字

### 3.2 字号规范

| 用途 | 字号 | 字重 | 行高 |
|------|------|------|------|
| Logo/品牌 | 20px | 600 | 1.2 |
| 页面标题 | 18px | 600 | 1.3 |
| 分类名称 | 15px | 400 | 1.4 |
| 卡片名称 | 14px | 400 | 1.4 |
| 辅助说明 | 12px | 400 | 1.5 |
| 计数/徽标 | 12px | 500 | 1.0 |

---

## 4. 间距系统

基于 **8px 网格系统**：

| 名称 | 值 |
|------|-----|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |

### 4.1 组件间距

| 组件 | 间距规范 |
|------|----------|
| 侧边栏内边距 | 16px |
| 侧边栏项间距 | 8px |
| 卡片网格间距 | 16px |
| 卡片内边距 | 12px |
| Dock 栏内边距 | 12px |
| Dock 项间距 | 12px |

---

## 5. 布局结构

### 5.1 整体布局

```
┌─────────────────────────────────────────────────────────┐
│                      主内容区                             │
│  ┌─────────┐  ┌──────────────────────────────────────┐  │
│  │         │  │                                      │  │
│  │ 侧边栏   │  │         网站卡片网格 / 功能页面        │  │
│  │ 200px   │  │                                      │  │
│  │         │  │                                      │  │
│  │         │  │                                      │  │
│  └─────────┘  └──────────────────────────────────────┘  │
│                                                         │
│                    ┌────────────────┐                   │
│                    │    Dock 栏     │                   │
│                    └────────────────┘                   │
└─────────────────────────────────────────────────────────┘
```

- **侧边栏**：固定宽度 200px，高度 100%，层级高于主内容
- **主内容区**：flex: 1，占据剩余空间
- **Dock 栏**：固定在底部居中，高度 64px，宽度自适应

### 5.2 侧边栏结构

```
┌────────────────────┐
│      Logo          │
├────────────────────┤
│  🔍 搜索图标         │
├────────────────────┤
│  分类列表           │
│  ├─ 全部 (all)      │
│  ├─ 视频           │
│  ├─ 导航           │
│  ├─ 开发常用        │
│  └─ AI工具         │
├────────────────────┤
│  + 添加分类         │
└────────────────────┘
```

---

## 6. 组件规范

### 6.1 网站卡片

**尺寸**：80px × 80px（最小尺寸，可根据实际调整）

**样式**：
```css
{
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid transparent;
  transition: all 0.2s ease;
}
```

**Hover 状态**：
```css
{
  border-color: #7b68ee;
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
}
```

**内容布局**：
- 图标居中，尺寸 32px × 32px
- 名称在图标下方，最多显示 1 行，超出省略

### 6.2 搜索框

**样式**：
```css
{
  width: 100%;
  max-width: 400px;
  height: 40px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 20px;  /* 胶囊形状 */
  border: 1px solid transparent;
  backdrop-filter: blur(20px);
  padding: 0 16px;
  color: #ffffff;
  font-size: 14px;
}
```

**Placeholder**：搜索...

### 6.3 侧边栏分类项

**默认状态**：
```css
{
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.15s ease;
}
```

**Hover 状态**：背景 `rgba(255, 255, 255, 0.08)`

**激活状态**：
```css
{
  background: rgba(123, 104, 238, 0.2);
  color: #ffffff;
}
```

### 6.4 Dock 栏

**样式**：
```css
{
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  height: 64px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

**Dock 项**：图标 40px × 40px

### 6.5 按钮

**主要按钮**：
```css
{
  height: 36px;
  padding: 0 16px;
  background: #7b68ee;
  color: #ffffff;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
}
```

**次要按钮**：
```css
{
  height: 36px;
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 400;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
}
```

### 6.6 页面标题栏

**样式**：
```css
{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
```

**标题**：18px, 600

**右侧操作区**：添加按钮等

---

## 7. 毛玻璃效果详解

毛玻璃（Glassmorphism）是 WeTab 的核心视觉特征。

### 7.1 实现方式

```css
.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}
```

### 7.2 毛玻璃层级

| 层级 | 背景透明度 | blur 值 | 边框透明度 |
|------|-----------|---------|------------|
| 卡片 | 0.08 | 20px | 0.1 |
| 悬浮卡片 | 0.12 | 20px | 0.15 |
| Dock 栏 | 0.08 | 20px | 0.1 |
| 模态框 | 0.15 | 30px | 0.15 |

---

## 8. 动效规范

### 8.1 过渡时长

| 动效类型 | 时长 |
|----------|------|
| 微交互（hover） | 0.15s |
| 状态切换 | 0.2s |
| 页面切换 | 0.3s |
| 弹窗出现 | 0.25s |

### 8.2 缓动函数

```css
/* 标准 */
transition-timing-function: ease;

/* 弹性 */
transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
```

### 8.3 动效场景

| 场景 | 效果 |
|------|------|
| 卡片 hover | `transform: translateY(-2px)` + 边框高亮 |
| 按钮 hover | `opacity: 0.9` + `transform: scale(0.98)` |
| 侧边栏项切换 | 背景色渐变 |
| Dock 栏出现 | `opacity: 0 → 1` + `translateY(10 → 0)` |

---

## 9. 图标规范

### 9.1 图标来源

使用 **Lucide Icons**（开源、一致的线条风格）

CDN 引入：
```html
<script src="https://unpkg.com/lucide@latest"></script>
```

### 9.2 图标尺寸

| 场景 | 尺寸 |
|------|------|
| 侧边栏分类图标 | 18px |
| 网站卡片图标 | 32px |
| Dock 栏图标 | 24px |
| 操作按钮图标 | 20px |

### 9.3 图标颜色

默认：`#9ca3af`（次要文字色）
激活：`#ffffff`
强调：`#7b68ee`

---

## 10. 响应式断点

WeTab 主要针对桌面浏览器设计。

| 设备 | 断点 | 布局调整 |
|------|------|----------|
| 大屏桌面 | ≥ 1200px | 完整侧边栏 + 4+ 列卡片 |
| 中屏桌面 | 768px - 1199px | 完整侧边栏 + 3 列卡片 |
| 小屏/折叠 | < 768px | 隐藏侧边栏，顶部折叠导航 |

---

## 11. 阴影规范

| 用途 | CSS 值 |
|------|--------|
| 卡片默认 | `0 4px 16px rgba(0, 0, 0, 0.2)` |
| 卡片 hover | `0 8px 24px rgba(0, 0, 0, 0.3)` |
| Dock 栏 | `0 8px 32px rgba(0, 0, 0, 0.3)` |
| 弹窗 | `0 16px 48px rgba(0, 0, 0, 0.4)` |

---

## 12. 代码规范建议

### 12.1 CSS 变量定义

```css
:root {
  /* 颜色 */
  --color-bg-primary: #1a1a2e;
  --color-bg-secondary: #16213e;
  --color-bg-card: rgba(255, 255, 255, 0.08);
  --color-bg-hover: rgba(255, 255, 255, 0.12);
  --color-accent: #7b68ee;
  --color-accent-dark: #6c5ce7;
  --color-text-primary: #ffffff;
  --color-text-secondary: #9ca3af;
  --color-text-placeholder: #6b7280;
  --color-border: rgba(255, 255, 255, 0.1);

  /* 间距 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* 圆角 */
  --radius-sm: 8px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 18px;
  --radius-pill: 9999px;

  /* 阴影 */
  --shadow-card: 0 4px 16px rgba(0, 0, 0, 0.2);
  --shadow-hover: 0 8px 24px rgba(0, 0, 0, 0.3);

  /* 过渡 */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.2s ease;
  --transition-slow: 0.3s ease;
}
```

### 12.2 工具类建议

```css
.glass {
  background: var(--color-bg-card);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--color-border);
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

---

## 13. 无障碍建议

- 所有交互元素确保 `cursor: pointer`
- 颜色对比度符合 WCAG 2.1 AA 标准（文字与背景对比度 ≥ 4.5:1）
- focus 状态使用可见的紫色轮廓
- 图标配合 aria-label 使用
