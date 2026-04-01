# WeTab 风格重设计 - 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将「个人工作站」改造为 WeTab 风格，采用毛玻璃效果、渐变背景、大图标卡片布局

**Architecture:**
- CSS 完全重写，采用 CSS 变量 + 毛玻璃设计
- HTML 结构微调，添加时间显示元素
- JavaScript 增加搜索过滤、图标加载失败处理、实时时钟

**Tech Stack:** 原生 HTML/CSS/JS，ES Modules，File System Access API

---

## 文件清单

| 文件 | 改动内容 |
|------|---------|
| `css/style.css` | 完全重写，采用新配色和毛玻璃设计 |
| `index.html` | 调整布局结构，新增时间显示元素 |
| `js/app.js` | 添加时钟初始化和搜索事件绑定 |
| `js/renderer.js` | 适配新设计样式，添加搜索过滤方法 |
| `js/actions.js` | 添加搜索过滤逻辑、图标加载失败状态处理 |
| `js/storage.js` | 无改动（数据层不变） |

---

## Task 1: CSS 重构 - 变量与基础样式

**Files:**
- Modify: `css/style.css` (完全重写)

- [ ] **Step 1: 创建 CSS 变量定义**

替换 `css/style.css` 全部内容:

```css
/* ===== CSS 变量 ===== */
:root {
    /* 渐变背景 */
    --bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    --bg-color: #1a1a2e;

    /* 毛玻璃 */
    --glass-bg: rgba(255, 255, 255, 0.1);
    --glass-bg-hover: rgba(255, 255, 255, 0.15);
    --glass-bg-active: rgba(255, 255, 255, 0.2);
    --glass-border: rgba(255, 255, 255, 0.2);
    --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

    /* 文字 */
    --text-primary: #ffffff;
    --text-muted: rgba(255, 255, 255, 0.7);

    /* 强调色 */
    --accent: #f093fb;
    --accent-hover: #f557c4;

    /* 侧边栏 */
    --sidebar-bg: rgba(255, 255, 255, 0.05);
    --sidebar-width: 240px;
    --sidebar-collapsed-width: 60px;

    /* 圆角 */
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-xl: 24px;

    /* 过渡 */
    --transition: 0.3s ease;
}

/* ===== 基础重置 ===== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: var(--bg-gradient);
    background-attachment: fixed;
    color: var(--text-primary);
    min-height: 100vh;
    overflow-x: hidden;
}

/* ===== 隐藏状态 ===== */
.hidden {
    display: none !important;
}

/* ===== 按钮 ===== */
.btn-primary {
    background: var(--accent);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: var(--radius-xl);
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 500;
    transition: var(--transition);
}

.btn-primary:hover {
    background: var(--accent-hover);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(240, 147, 251, 0.4);
}

.btn-secondary {
    background: transparent;
    color: var(--text-primary);
    border: 1px solid var(--glass-border);
    padding: 10px 20px;
    border-radius: var(--radius-xl);
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 500;
    transition: var(--transition);
}

.btn-secondary:hover {
    background: var(--glass-bg);
    border-color: var(--accent);
}

.btn-icon {
    background: transparent;
    border: none;
    color: var(--text-primary);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 8px;
    border-radius: var(--radius-md);
    transition: var(--transition);
}

.btn-icon:hover {
    background: var(--glass-bg);
}
```

- [ ] **Step 2: 提交**

```bash
git add css/style.css
git commit -m "feat: rewrite CSS with variables and new color scheme"
```

---

## Task 2: CSS 重构 - 布局与侧边栏

**Files:**
- Modify: `css/style.css`

- [ ] **Step 1: 添加主布局和侧边栏样式**

追加到 `css/style.css`:

```css
/* ===== 主布局 ===== */
#app {
    display: flex;
    min-height: 100vh;
}

/* ===== 侧边栏 ===== */
.sidebar {
    width: var(--sidebar-width);
    background: var(--sidebar-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-right: 1px solid var(--glass-border);
    padding: 20px;
    display: flex;
    flex-direction: column;
    transition: width var(--transition), transform var(--transition);
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 100;
}

.sidebar.collapsed {
    width: var(--sidebar-collapsed-width);
}

.sidebar.collapsed .sidebar-header h2,
.sidebar.collapsed .category-list li span,
.sidebar.collapsed .category-list li .delete-category {
    display: none;
}

.sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding: 0 4px;
}

.sidebar-header h2 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-muted);
    letter-spacing: 0.5px;
}

/* ===== 分类列表 ===== */
.category-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
    overflow-y: auto;
}

.category-list li {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: var(--transition);
    position: relative;
}

.category-list li:hover {
    background: var(--glass-bg);
}

.category-list li.active {
    background: var(--glass-bg-active);
    border: 1px solid var(--glass-border);
}

.category-list li .color-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
}

.category-list li span {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.95rem;
}

.category-list li .delete-category,
.category-list li .edit-category {
    opacity: 0;
    font-size: 0.9rem;
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 4px 8px;
    border-radius: var(--radius-sm);
    transition: var(--transition);
}

.category-list li:hover .delete-category,
.category-list li:hover .edit-category {
    opacity: 1;
}

.category-list li .delete-category:hover,
.category-list li .edit-category:hover {
    color: var(--accent);
    background: var(--glass-bg);
}
```

- [ ] **Step 2: 提交**

```bash
git add css/style.css
git commit -m "feat: add sidebar and layout styles with glassmorphism"
```

---

## Task 3: CSS 重构 - 主内容区和卡片

**Files:**
- Modify: `css/style.css`

- [ ] **Step 1: 添加主内容区、搜索栏、网站卡片样式**

追加到 `css/style.css`:

```css
/* ===== 主内容区 ===== */
.main-content {
    flex: 1;
    margin-left: var(--sidebar-width);
    padding: 24px 32px;
    transition: margin-left var(--transition);
}

.sidebar.collapsed ~ .main-content {
    margin-left: var(--sidebar-collapsed-width);
}

/* ===== 顶部区域 ===== */
.top-area {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 32px;
    flex-wrap: wrap;
}

.header {
    display: flex;
    align-items: center;
    gap: 15px;
}

.header h1 {
    font-size: 1.5rem;
    font-weight: 600;
}

/* ===== 搜索栏 ===== */
.search-container {
    flex: 1;
    max-width: 500px;
    min-width: 200px;
}

.search-input {
    width: 100%;
    padding: 14px 20px;
    padding-left: 44px;
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-xl);
    background: var(--glass-bg);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    color: var(--text-primary);
    font-size: 1rem;
    transition: var(--transition);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: 14px center;
}

.search-input::placeholder {
    color: var(--text-muted);
}

.search-input:focus {
    outline: none;
    border-color: var(--accent);
    background: var(--glass-bg-hover);
    box-shadow: 0 0 0 3px rgba(240, 147, 251, 0.2);
}

/* ===== 时间显示 ===== */
.time-display {
    font-size: 2.2rem;
    font-weight: 700;
    letter-spacing: 2px;
    color: var(--text-primary);
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

/* ===== 网站网格 ===== */
.sites-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 20px;
}

/* ===== 网站卡片 ===== */
.site-card {
    background: var(--glass-bg);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    cursor: pointer;
    transition: var(--transition);
    position: relative;
    min-height: 140px;
}

.site-card:hover {
    transform: translateY(-5px);
    background: var(--glass-bg-hover);
    border-color: var(--accent);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

.site-card:hover .card-actions {
    opacity: 1;
    transform: translateY(0);
}

.site-card img {
    width: 56px;
    height: 56px;
    border-radius: var(--radius-md);
    object-fit: contain;
    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
}

.site-card .site-name {
    font-size: 0.9rem;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
    color: var(--text-primary);
}

.card-actions {
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    gap: 6px;
    opacity: 0;
    transform: translateY(-5px);
    transition: var(--transition);
}

.card-actions button {
    background: var(--glass-bg);
    backdrop-filter: blur(10px);
    border: 1px solid var(--glass-border);
    color: var(--text-primary);
    width: 28px;
    height: 28px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
}

.card-actions button:hover {
    background: var(--accent);
    border-color: var(--accent);
}

/* ===== 空状态 ===== */
.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: var(--text-muted);
    background: var(--glass-bg);
    border-radius: var(--radius-lg);
    border: 1px solid var(--glass-border);
}
```

- [ ] **Step 2: 提交**

```bash
git add css/style.css
git commit -m "feat: add main content area, search bar and site card styles"
```

---

## Task 4: CSS 重构 - 模态框和欢迎屏幕

**Files:**
- Modify: `css/style.css`

- [ ] **Step 1: 添加模态框和欢迎屏幕样式**

追加到 `css/style.css`:

```css
/* ===== 模态框 ===== */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: var(--glass-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    padding: 32px;
    width: 90%;
    max-width: 420px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-content h3 {
    margin-bottom: 24px;
    font-size: 1.3rem;
    font-weight: 600;
}

.form-group {
    margin-bottom: 18px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    color: var(--text-muted);
    font-size: 0.9rem;
    font-weight: 500;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    background: var(--glass-bg-hover);
    color: var(--text-primary);
    font-size: 1rem;
    transition: var(--transition);
}

.form-group input:focus,
.form-group select:focus {
    outline: none;
    border-color: var(--accent);
    background: var(--glass-bg-active);
}

.form-group small {
    display: block;
    margin-top: 6px;
    color: var(--text-muted);
    font-size: 0.8rem;
}

.form-group small.error {
    color: #ff6b6b;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 28px;
}

/* ===== 欢迎屏幕 ===== */
.welcome-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 24px;
    padding: 20px;
}

.welcome-card {
    background: var(--glass-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-xl);
    padding: 48px;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.welcome-card h1 {
    font-size: 2.5rem;
    margin-bottom: 12px;
    background: linear-gradient(135deg, #fff 0%, var(--accent) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.welcome-card p {
    color: var(--text-muted);
    margin-bottom: 32px;
    font-size: 1.1rem;
}

.welcome-card .btn-group {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
    .sidebar {
        transform: translateX(-100%);
    }

    .sidebar.open {
        transform: translateX(0);
    }

    .main-content {
        margin-left: 0;
        padding: 16px;
    }

    .top-area {
        flex-direction: column;
        align-items: stretch;
    }

    .search-container {
        max-width: 100%;
    }

    .time-display {
        font-size: 1.8rem;
    }

    .sites-grid {
        grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
        gap: 12px;
    }

    .site-card {
        padding: 16px 12px;
        min-height: 120px;
    }

    .site-card img {
        width: 48px;
        height: 48px;
    }
}
```

- [ ] **Step 2: 提交**

```bash
git add css/style.css
git commit -m "feat: add modal and welcome screen styles"
```

---

## Task 5: HTML 结构调整

**Files:**
- Modify: `index.html`

- [ ] **Step 1: 更新 HTML 结构**

替换 `<body>` 中的内容:

```html
<body>
    <script>
        // 浏览器兼容性检测
        if (!('showOpenFilePicker' in window)) {
            document.body.innerHTML = `
                <div class="welcome-screen">
                    <div class="welcome-card">
                        <h1>浏览器不支持</h1>
                        <p>File System Access API 目前仅在 Chrome、Edge、Opera 等 Chromium 系浏览器中支持。<br>请使用这些浏览器访问此页面。</p>
                    </div>
                </div>
            `;
        }
    </script>

    <!-- 欢迎/文件选择界面 -->
    <div id="welcome-screen" class="welcome-screen">
        <div class="welcome-card">
            <h1>个人工作站</h1>
            <p>选择数据文件开始使用</p>
            <div class="btn-group">
                <button id="select-file-btn" class="btn-primary">选择数据文件</button>
                <button id="create-file-btn" class="btn-secondary">创建新文件</button>
            </div>
        </div>
    </div>

    <!-- 主应用 -->
    <div id="app" class="hidden">
        <!-- 侧边栏 -->
        <aside id="sidebar" class="sidebar">
            <div class="sidebar-header">
                <h2>分类</h2>
                <button id="add-category-btn" class="btn-icon" title="添加分类">+</button>
            </div>
            <ul id="category-list" class="category-list"></ul>
        </aside>

        <!-- 主内容区 -->
        <main id="main-content" class="main-content">
            <div class="top-area">
                <button id="toggle-sidebar-btn" class="btn-icon">☰</button>
                <div class="search-container">
                    <input type="text" id="search-input" class="search-input" placeholder="搜索书签...">
                </div>
                <div id="time-display" class="time-display">00:00</div>
                <button id="add-site-btn" class="btn-primary">添加网站</button>
            </div>
            <div id="sites-grid" class="sites-grid"></div>
        </main>
    </div>

    <!-- 模态框：添加/编辑网站 -->
    <div id="site-modal" class="modal hidden">
        <div class="modal-content">
            <h3 id="site-modal-title">添加网站</h3>
            <form id="site-form">
                <input type="hidden" id="site-id">
                <div class="form-group">
                    <label for="site-name">名称</label>
                    <input type="text" id="site-name" required>
                </div>
                <div class="form-group">
                    <label for="site-url">网址</label>
                    <input type="url" id="site-url" required>
                </div>
                <div class="form-group">
                    <label for="site-icon">图标URL</label>
                    <input type="url" id="site-icon">
                    <small id="icon-status">自动获取或手动输入</small>
                </div>
                <div class="form-group">
                    <label for="site-category">分类</label>
                    <select id="site-category"></select>
                </div>
                <div class="form-group">
                    <label for="site-bg-color">背景色</label>
                    <input type="color" id="site-bg-color" value="#764ba2">
                </div>
                <div class="form-actions">
                    <button type="button" id="cancel-site-btn" class="btn-secondary">取消</button>
                    <button type="submit" class="btn-primary">保存</button>
                </div>
            </form>
        </div>
    </div>

    <!-- 模态框：添加/编辑分类 -->
    <div id="category-modal" class="modal hidden">
        <div class="modal-content">
            <h3 id="category-modal-title">添加分类</h3>
            <form id="category-form">
                <input type="hidden" id="category-id">
                <div class="form-group">
                    <label for="category-name">名称</label>
                    <input type="text" id="category-name" required>
                </div>
                <div class="form-group">
                    <label for="category-color">颜色</label>
                    <input type="color" id="category-color" value="#f093fb">
                </div>
                <div class="form-actions">
                    <button type="button" id="cancel-category-btn" class="btn-secondary">取消</button>
                    <button type="submit" class="btn-primary">保存</button>
                </div>
            </form>
        </div>
    </div>

    <script type="module" src="js/app.js"></script>
</body>
```

- [ ] **Step 2: 提交**

```bash
git add index.html
git commit -m "feat: restructure HTML with new layout and time display"
```

---

## Task 6: JavaScript - 时钟和搜索功能

**Files:**
- Modify: `js/app.js`

- [ ] **Step 1: 添加时钟初始化和搜索事件**

替换 `js/app.js`:

```javascript
// js/app.js
import * as renderer from './renderer.js';
import * as storage from './storage.js';
import * as actions from './actions.js';

// 时钟更新
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeDisplay = document.getElementById('time-display');
    if (timeDisplay) {
        timeDisplay.textContent = `${hours}:${minutes}`;
    }
}

// 初始化时钟
function initClock() {
    updateTime();
    setInterval(updateTime, 1000);
}

// 初始化搜索
function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            renderer.filterSites(query);
        });
    }
}

// 检查浏览器兼容性
function checkBrowserCompatibility() {
    if (!('showOpenFilePicker' in window)) {
        return false;
    }
    return true;
}

// 初始化应用
export function init() {
    if (!checkBrowserCompatibility()) {
        return;
    }

    // 初始化时钟
    initClock();

    // 初始化搜索
    initSearch();

    // 初始化所有事件绑定
    actions.initActions();
}

// 启动应用
init();
```

- [ ] **Step 2: 提交**

```bash
git add js/app.js
git commit -m "feat: add clock initialization and search event binding"
```

---

## Task 7: JavaScript - 渲染器更新

**Files:**
- Modify: `js/renderer.js`

- [ ] **Step 1: 更新渲染器以适配新设计**

替换 `js/renderer.js`:

```javascript
// js/renderer.js
import * as storage from './storage.js';

// HTML 转义函数，防止 XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 默认图标 SVG
const DEFAULT_ICON_SVG = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#4a5568"/><text x="50" y="68" font-size="50" text-anchor="middle" fill="#fff">🌐</text></svg>');

let currentCategoryId = 'all';
let allSites = []; // 存储所有站点用于搜索过滤

// 渲染分类列表
export function renderCategories() {
    const list = document.getElementById('category-list');
    const select = document.getElementById('site-category');
    const data = storage.getData();

    if (!list || !select || !data) return;

    // 渲染侧边栏分类列表
    list.innerHTML = `
        <li data-id="all" class="${currentCategoryId === 'all' ? 'active' : ''}">
            <span class="color-dot" style="background-color: #667eea"></span>
            <span>全部网站</span>
        </li>
        ${data.categories.map(cat => `
            <li data-id="${escapeHtml(cat.id)}" class="${currentCategoryId === cat.id ? 'active' : ''}">
                <span class="color-dot" style="background-color: ${cat.color}"></span>
                <span>${escapeHtml(cat.name)}</span>
                ${cat.id !== 'default' ? `
                    <button class="edit-category" data-id="${escapeHtml(cat.id)}">✎</button>
                    <button class="delete-category" data-id="${escapeHtml(cat.id)}">×</button>
                ` : ''}
            </li>
        `).join('')}
    `;

    // 渲染网站表单的分类选择
    select.innerHTML = data.categories.map(cat =>
        `<option value="${escapeHtml(cat.id)}">${escapeHtml(cat.name)}</option>`
    ).join('');

    // 保存所有站点用于搜索
    allSites = data.sites || [];

    // 绑定分类点击事件
    list.querySelectorAll('li[data-id]').forEach(li => {
        li.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-category')) {
                e.stopPropagation();
                const id = e.target.dataset.id;
                if (confirm('确定删除该分类？')) {
                    storage.deleteCategory(id).then(() => {
                        if (currentCategoryId === id) {
                            currentCategoryId = 'all';
                        }
                        renderCategories();
                        renderSites();
                    });
                }
            } else if (e.target.classList.contains('edit-category')) {
                e.stopPropagation();
                const id = e.target.dataset.id;
                const category = data.categories.find(c => c.id === id);
                if (category) {
                    openCategoryModal(category);
                }
            } else {
                currentCategoryId = li.dataset.id;
                renderCategories();
                renderSites();
            }
        });
    });
}

// 过滤显示站点（搜索用）
export function filterSites(query) {
    const grid = document.getElementById('sites-grid');
    const data = storage.getData();

    if (!data) return;

    let sites = data.sites;

    // 按分类过滤
    if (currentCategoryId !== 'all') {
        sites = sites.filter(s => s.categoryId === currentCategoryId);
    }

    // 按搜索关键词过滤
    if (query) {
        const lowerQuery = query.toLowerCase();
        sites = sites.filter(s =>
            s.name.toLowerCase().includes(lowerQuery) ||
            s.url.toLowerCase().includes(lowerQuery)
        );
    }

    // 渲染过滤后的站点
    renderSitesGrid(sites);
}

// 渲染网站卡片网格
export function renderSites() {
    const data = storage.getData();
    if (!data) return;

    let sites = data.sites;
    if (currentCategoryId !== 'all') {
        sites = sites.filter(s => s.categoryId === currentCategoryId);
    }

    allSites = data.sites;
    renderSitesGrid(sites);
}

// 渲染网站卡片网格（内部方法）
function renderSitesGrid(sites) {
    const grid = document.getElementById('sites-grid');
    if (!grid) return;

    if (sites.length === 0) {
        grid.innerHTML = '<div class="empty-state">暂无网站，点击右上角添加</div>';
        return;
    }

    grid.innerHTML = sites.map(site => {
        const iconUrl = escapeHtml(site.icon || getFaviconUrl(site.url));
        return `
            <div class="site-card" data-id="${escapeHtml(site.id)}">
                <div class="card-actions">
                    <button class="edit-btn" data-id="${escapeHtml(site.id)}">✎</button>
                    <button class="delete-btn" data-id="${escapeHtml(site.id)}">×</button>
                </div>
                <img src="${iconUrl}" alt="${escapeHtml(site.name)}" onerror="this.src='${DEFAULT_ICON_SVG}'">
                <span class="site-name">${escapeHtml(site.name)}</span>
            </div>
        `;
    }).join('');

    // 绑定卡片事件
    const data = storage.getData();
    grid.querySelectorAll('.site-card').forEach(card => {
        const id = card.dataset.id;

        // 点击卡片跳转
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-btn') || e.target.classList.contains('delete-btn')) {
                return;
            }
            const site = data.sites.find(s => s.id === id);
            if (site) {
                window.open(site.url, '_blank');
            }
        });

        // 编辑按钮
        card.querySelector('.edit-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            const site = data.sites.find(s => s.id === id);
            if (site) {
                openSiteModal(site);
            }
        });

        // 删除按钮
        card.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('确定删除该网站？')) {
                storage.deleteSite(id).then(() => {
                    renderSites();
                });
            }
        });
    });
}

// 获取favicon URL
export function getFaviconUrl(url) {
    try {
        const domain = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
        return '';
    }
}

// 检测图标是否可加载
export function checkIconLoadable(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

// 打开网站模态框
export function openSiteModal(site = null) {
    const modal = document.getElementById('site-modal');
    const title = document.getElementById('site-modal-title');
    const form = document.getElementById('site-form');
    const iconStatus = document.getElementById('icon-status');

    title.textContent = site ? '编辑网站' : '添加网站';
    form.reset();

    if (iconStatus) {
        iconStatus.textContent = '自动获取或手动输入';
        iconStatus.classList.remove('error');
    }

    if (site) {
        document.getElementById('site-id').value = site.id;
        document.getElementById('site-name').value = site.name;
        document.getElementById('site-url').value = site.url;
        document.getElementById('site-icon').value = site.icon || '';
        document.getElementById('site-category').value = site.categoryId;
        document.getElementById('site-bg-color').value = site.bgColor || '#764ba2';
    } else {
        document.getElementById('site-id').value = '';
        document.getElementById('site-bg-color').value = '#764ba2';
    }

    modal.classList.remove('hidden');
}

// 关闭网站模态框
export function closeSiteModal() {
    document.getElementById('site-modal').classList.add('hidden');
}

// 打开分类模态框
export function openCategoryModal(category = null) {
    const modal = document.getElementById('category-modal');
    const title = document.getElementById('category-modal-title');
    const form = document.getElementById('category-form');

    title.textContent = category ? '编辑分类' : '添加分类';
    form.reset();

    if (category) {
        document.getElementById('category-id').value = category.id;
        document.getElementById('category-name').value = category.name;
        document.getElementById('category-color').value = category.color;
    } else {
        document.getElementById('category-id').value = '';
        document.getElementById('category-color').value = '#f093fb';
    }

    modal.classList.remove('hidden');
}

// 关闭分类模态框
export function closeCategoryModal() {
    document.getElementById('category-modal').classList.add('hidden');
}

// 显示主界面
export function showMainApp() {
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
}

// 显示欢迎屏幕
export function showWelcomeScreen() {
    document.getElementById('welcome-screen').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
}

// 获取当前分类ID
export function getCurrentCategoryId() {
    return currentCategoryId;
}
```

- [ ] **Step 2: 提交**

```bash
git add js/renderer.js
git commit -m "feat: update renderer with glassmorphism styles and search filtering"
```

---

## Task 8: JavaScript - Actions 更新

**Files:**
- Modify: `js/actions.js`

- [ ] **Step 1: 更新 actions.js 添加图标检测**

替换 `js/actions.js`:

```javascript
// js/actions.js
import * as storage from './storage.js';
import * as renderer from './renderer.js';

// 生成UUID
function generateId() {
    return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// 初始化所有事件绑定
export function initActions() {
    // 欢迎屏幕按钮
    document.getElementById('select-file-btn').addEventListener('click', async () => {
        const data = await storage.selectFile();
        if (data) {
            renderer.showMainApp();
            renderer.renderCategories();
            renderer.renderSites();
        }
    });

    document.getElementById('create-file-btn').addEventListener('click', async () => {
        const data = await storage.createFile();
        if (data) {
            renderer.showMainApp();
            renderer.renderCategories();
            renderer.renderSites();
        }
    });

    // 侧边栏折叠
    document.getElementById('toggle-sidebar-btn').addEventListener('click', () => {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('collapsed');
    });

    // 添加网站按钮
    document.getElementById('add-site-btn').addEventListener('click', () => {
        renderer.openSiteModal();
    });

    // 添加分类按钮
    document.getElementById('add-category-btn').addEventListener('click', () => {
        renderer.openCategoryModal();
    });

    // 网站表单提交
    document.getElementById('site-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('site-id').value;
        const siteData = {
            name: document.getElementById('site-name').value.trim(),
            url: document.getElementById('site-url').value.trim(),
            icon: document.getElementById('site-icon').value.trim(),
            categoryId: document.getElementById('site-category').value,
            bgColor: document.getElementById('site-bg-color').value
        };

        if (!siteData.url) {
            alert('请输入网址');
            return;
        }

        if (!siteData.name) {
            alert('请输入网站名称');
            return;
        }

        // 自动获取favicon
        if (!siteData.icon) {
            siteData.icon = renderer.getFaviconUrl(siteData.url);
        }

        if (id) {
            // 更新
            await storage.updateSite(id, siteData);
        } else {
            // 添加
            siteData.id = generateId();
            await storage.addSite(siteData);
        }

        renderer.closeSiteModal();
        renderer.renderSites();
    });

    // 网址输入失焦时检测图标
    document.getElementById('site-url').addEventListener('blur', async (e) => {
        const url = e.target.value.trim();
        const iconInput = document.getElementById('site-icon');
        const iconStatus = document.getElementById('icon-status');

        // 如果用户已经手动输入了图标，不做处理
        if (iconInput.value.trim()) {
            return;
        }

        if (url) {
            const faviconUrl = renderer.getFaviconUrl(url);
            if (faviconUrl) {
                const isLoadable = await renderer.checkIconLoadable(faviconUrl);
                if (!isLoadable && iconStatus) {
                    iconStatus.textContent = '图标加载失败，可手动上传';
                    iconStatus.classList.add('error');
                } else if (iconStatus) {
                    iconStatus.textContent = '自动获取或手动输入';
                    iconStatus.classList.remove('error');
                }
            }
        }
    });

    // 取消网站表单
    document.getElementById('cancel-site-btn').addEventListener('click', () => {
        renderer.closeSiteModal();
    });

    // 分类表单提交
    document.getElementById('category-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('category-id').value;
        const categoryData = {
            name: document.getElementById('category-name').value.trim(),
            color: document.getElementById('category-color').value
        };

        if (!categoryData.name) {
            alert('请输入分类名称');
            return;
        }

        if (id) {
            // 更新
            await storage.updateCategory(id, categoryData);
        } else {
            // 添加
            categoryData.id = generateId();
            await storage.addCategory(categoryData);
        }

        renderer.closeCategoryModal();
        renderer.renderCategories();
    });

    // 取消分类表单
    document.getElementById('cancel-category-btn').addEventListener('click', () => {
        renderer.closeCategoryModal();
    });

    // 点击模态框外部关闭
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
}
```

- [ ] **Step 2: 提交**

```bash
git add js/actions.js
git commit -m "feat: add icon loading detection on URL blur"
```

---

## Task 9: 验证和测试

- [ ] **Step 1: 启动服务并测试**

双击 `scripts/start-service.bat` 启动服务

- [ ] **Step 2: 验证项目**

在浏览器中打开 http://localhost:18080/ 进行验证：
1. 欢迎屏幕是否正常显示
2. 渐变背景和毛玻璃效果是否正常
3. 侧边栏分类列表是否正常
4. 顶部搜索栏和时间显示是否正常
5. 添加/编辑网站功能是否正常
6. 搜索过滤功能是否正常
7. 卡片悬停效果是否正常
8. 模态框样式是否正确

- [ ] **Step 3: 最终提交**

```bash
git add -A
git commit -m "feat: complete WeTab-style redesign with glassmorphism UI"
```

---

## 自检清单

- [ ] 所有 CSS 变量已正确定义
- [ ] 毛玻璃效果（backdrop-filter）已应用
- [ ] 渐变背景正常显示
- [ ] 搜索栏可实时过滤卡片
- [ ] 时间显示正常运行
- [ ] 侧边栏可折叠
- [ ] 卡片悬停有上浮动画
- [ ] 模态框样式与整体风格一致
- [ ] 响应式布局在移动端正常
- [ ] 无 XSS 漏洞（所有用户输入已转义）
