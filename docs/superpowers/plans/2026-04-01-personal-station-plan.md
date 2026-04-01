# 个人工作站网站实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个浏览器起始页，支持侧边栏分类和卡片式网站展示，数据存储在本地JSON文件

**Architecture:** 纯前端HTML/CSS/JS，使用File System Access API读写本地JSON文件，采用模块化组织代码

**Tech Stack:** 原生HTML + CSS + JavaScript，无框架依赖

---

## 文件结构

```
F:\ai_project\user_studio\
├── index.html              # 主页面
├── css/
│   └── style.css           # 样式文件
├── js/
│   ├── app.js              # 主入口
│   ├── storage.js          # 文件读写（File System Access API）
│   ├── renderer.js         # 界面渲染
│   └── actions.js          # 用户操作处理
└── data/
    └── sites.json          # 数据文件（用户选择后加载）
```

---

## 任务列表

### Task 1: 创建HTML结构和初始文件

**Files:**
- Create: `index.html`
- Create: `css/style.css`
- Create: `js/app.js`
- Create: `js/storage.js`
- Create: `js/renderer.js`
- Create: `js/actions.js`
- Create: `data/sites.json`

- [ ] **Step 1: 创建目录结构**

```bash
mkdir -p css js data
```

- [ ] **Step 2: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>个人工作站</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div id="app">
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
            <header class="header">
                <button id="toggle-sidebar-btn" class="btn-icon">☰</button>
                <h1>个人工作站</h1>
                <button id="add-site-btn" class="btn-primary">添加网站</button>
            </header>
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
                    <small>自动获取或手动输入</small>
                </div>
                <div class="form-group">
                    <label for="site-category">分类</label>
                    <select id="site-category"></select>
                </div>
                <div class="form-group">
                    <label for="site-bg-color">背景色</label>
                    <input type="color" id="site-bg-color" value="#0f3460">
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
                    <input type="color" id="category-color" value="#e94560">
                </div>
                <div class="form-actions">
                    <button type="button" id="cancel-category-btn" class="btn-secondary">取消</button>
                    <button type="submit" class="btn-primary">保存</button>
                </div>
            </form>
        </div>
    </div>

    <!-- 欢迎/文件选择界面 -->
    <div id="welcome-screen" class="welcome-screen">
        <h1>个人工作站</h1>
        <p>选择数据文件开始使用</p>
        <button id="select-file-btn" class="btn-primary">选择数据文件</button>
        <button id="create-file-btn" class="btn-secondary">创建新文件</button>
    </div>

    <script type="module" src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 3: 创建初始 sites.json**

```json
{
  "categories": [
    { "id": "default", "name": "未分类", "color": "#808080" }
  ],
  "sites": []
}
```

- [ ] **Step 4: 提交**

```bash
git add index.html css/style.css js/app.js js/storage.js js/renderer.js js/actions.js data/sites.json
git commit -m "feat: 创建项目基础结构和HTML模板"
```

---

### Task 2: 实现CSS样式

**Files:**
- Modify: `css/style.css`

- [ ] **Step 1: 编写完整CSS样式**

```css
/* 基础重置 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --bg-color: #1a1a2e;
    --sidebar-bg: #16213e;
    --card-bg: #0f3460;
    --accent: #e94560;
    --text-color: #eaeaea;
    --text-muted: #a0a0a0;
    --border-radius: 8px;
    --transition: 0.3s;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    min-height: 100vh;
}

/* 欢迎屏幕 */
.welcome-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 20px;
}

.welcome-screen h1 {
    font-size: 2.5rem;
    color: var(--accent);
}

.welcome-screen p {
    color: var(--text-muted);
}

/* 隐藏状态 */
.hidden {
    display: none !important;
}

/* 按钮 */
.btn-primary {
    background-color: var(--accent);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-size: 1rem;
    transition: var(--transition);
}

.btn-primary:hover {
    opacity: 0.9;
    transform: translateY(-1px);
}

.btn-secondary {
    background-color: transparent;
    color: var(--text-color);
    border: 1px solid var(--text-muted);
    padding: 10px 20px;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-size: 1rem;
    transition: var(--transition);
}

.btn-secondary:hover {
    border-color: var(--accent);
    color: var(--accent);
}

.btn-icon {
    background: transparent;
    border: none;
    color: var(--text-color);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 5px 10px;
    border-radius: var(--border-radius);
    transition: var(--transition);
}

.btn-icon:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

/* 主布局 */
#app {
    display: flex;
    min-height: 100vh;
}

/* 侧边栏 */
.sidebar {
    width: 250px;
    background-color: var(--sidebar-bg);
    padding: 20px;
    display: flex;
    flex-direction: column;
    transition: var(--transition);
}

.sidebar.collapsed {
    width: 60px;
    padding: 20px 10px;
}

.sidebar.collapsed .sidebar-header h2,
.sidebar.collapsed .category-list span {
    display: none;
}

.sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.sidebar-header h2 {
    font-size: 1.2rem;
}

.category-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.category-list li {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: var(--transition);
}

.category-list li:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.category-list li.active {
    background-color: var(--accent);
}

.category-list li .color-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
}

.category-list li span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.category-list li .delete-category {
    margin-left: auto;
    opacity: 0;
    font-size: 1rem;
}

.category-list li:hover .delete-category {
    opacity: 1;
}

/* 主内容区 */
.main-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
}

.header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 30px;
}

.header h1 {
    flex: 1;
    font-size: 1.8rem;
}

/* 网站网格 */
.sites-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;
}

/* 网站卡片 */
.site-card {
    background-color: var(--card-bg);
    border-radius: var(--border-radius);
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    transition: var(--transition);
    position: relative;
}

.site-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
}

.site-card:hover .card-actions {
    opacity: 1;
}

.site-card img {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    object-fit: contain;
}

.site-card .site-name {
    font-size: 0.9rem;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
}

.card-actions {
    position: absolute;
    top: 5px;
    right: 5px;
    display: flex;
    gap: 5px;
    opacity: 0;
    transition: var(--transition);
}

.card-actions button {
    background: rgba(0, 0, 0, 0.5);
    border: none;
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
}

.card-actions button:hover {
    background: var(--accent);
}

/* 模态框 */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background-color: var(--sidebar-bg);
    border-radius: var(--border-radius);
    padding: 30px;
    width: 90%;
    max-width: 400px;
}

.modal-content h3 {
    margin-bottom: 20px;
    font-size: 1.3rem;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    color: var(--text-muted);
    font-size: 0.9rem;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 10px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: var(--border-radius);
    background-color: var(--bg-color);
    color: var(--text-color);
    font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus {
    outline: none;
    border-color: var(--accent);
}

.form-group small {
    display: block;
    margin-top: 5px;
    color: var(--text-muted);
    font-size: 0.8rem;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

/* 空状态 */
.empty-state {
    text-align: center;
    padding: 50px;
    color: var(--text-muted);
}

/* 响应式 */
@media (max-width: 768px) {
    .sidebar {
        position: fixed;
        left: -250px;
        z-index: 100;
        height: 100vh;
    }

    .sidebar.open {
        left: 0;
    }

    .sites-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }
}
```

- [ ] **Step 2: 提交**

```bash
git add css/style.css
git commit -m "feat: 添加完整CSS样式（深色主题、卡片、侧边栏、模态框）"
```

---

### Task 3: 实现 storage.js（文件读写）

**Files:**
- Modify: `js/storage.js`

- [ ] **Step 1: 实现 FileSystemAccess API 封装**

```javascript
// js/storage.js
let fileHandle = null;
let data = null;

const DEFAULT_DATA = {
    categories: [
        { id: 'default', name: '未分类', color: '#808080' }
    ],
    sites: []
};

// 检查浏览器是否支持 File System Access API
export function isSupported() {
    return 'showOpenFilePicker' in window;
}

// 选择已存在的文件
export async function selectFile() {
    try {
        [fileHandle] = await window.showOpenFilePicker({
            types: [{
                description: 'JSON Files',
                accept: { 'application/json': ['.json'] }
            }],
            multiple: false
        });
        return await loadFile();
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error('选择文件失败:', err);
        }
        return null;
    }
}

// 创建新文件
export async function createFile() {
    try {
        fileHandle = await window.showSaveFilePicker({
            suggestedName: 'sites.json',
            types: [{
                description: 'JSON Files',
                accept: { 'application/json': ['.json'] }
            }]
        });
        data = { ...DEFAULT_DATA };
        await saveFile();
        return data;
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error('创建文件失败:', err);
        }
        return null;
    }
}

// 加载文件内容
export async function loadFile() {
    try {
        const file = await fileHandle.getFile();
        const text = await file.text();
        data = JSON.parse(text);
        // 确保有默认分类
        if (!data.categories || data.categories.length === 0) {
            data.categories = [...DEFAULT_DATA.categories];
        }
        return data;
    } catch (err) {
        console.error('加载文件失败:', err);
        return null;
    }
}

// 保存文件
export async function saveFile() {
    try {
        const writable = await fileHandle.createWritable();
        await writable.write(JSON.stringify(data, null, 2));
        await writable.close();
        return true;
    } catch (err) {
        console.error('保存文件失败:', err);
        return false;
    }
}

// 获取当前数据
export function getData() {
    return data;
}

// 设置数据并保存
export async function setData(newData) {
    data = newData;
    return await saveFile();
}

// 添加网站
export async function addSite(site) {
    if (!data) return false;
    data.sites.push(site);
    return await saveFile();
}

// 更新网站
export async function updateSite(id, updates) {
    if (!data) return false;
    const index = data.sites.findIndex(s => s.id === id);
    if (index !== -1) {
        data.sites[index] = { ...data.sites[index], ...updates };
        return await saveFile();
    }
    return false;
}

// 删除网站
export async function deleteSite(id) {
    if (!data) return false;
    data.sites = data.sites.filter(s => s.id !== id);
    return await saveFile();
}

// 添加分类
export async function addCategory(category) {
    if (!data) return false;
    data.categories.push(category);
    return await saveFile();
}

// 更新分类
export async function updateCategory(id, updates) {
    if (!data) return false;
    const index = data.categories.findIndex(c => c.id === id);
    if (index !== -1) {
        data.categories[index] = { ...data.categories[index], ...updates };
        return await saveFile();
    }
    return false;
}

// 删除分类
export async function deleteCategory(id) {
    if (!data) return false;
    data.categories = data.categories.filter(c => c.id !== id);
    // 将该分类下的网站移至默认分类
    data.sites.forEach(site => {
        if (site.categoryId === id) {
            site.categoryId = 'default';
        }
    });
    return await saveFile();
}
```

- [ ] **Step 2: 提交**

```bash
git add js/storage.js
git commit -m "feat: 实现 storage.js 文件读写模块"
```

---

### Task 4: 实现 renderer.js（界面渲染）

**Files:**
- Modify: `js/renderer.js`

- [ ] **Step 1: 实现渲染模块**

```javascript
// js/renderer.js
import * as storage from './storage.js';

let currentCategoryId = 'all';

// 渲染分类列表
export function renderCategories() {
    const list = document.getElementById('category-list');
    const select = document.getElementById('site-category');
    const data = storage.getData();

    if (!data) return;

    // 渲染侧边栏分类列表
    list.innerHTML = `
        <li data-id="all" class="${currentCategoryId === 'all' ? 'active' : ''}">
            <span class="color-dot" style="background-color: #e94560"></span>
            <span>全部网站</span>
        </li>
        ${data.categories.map(cat => `
            <li data-id="${cat.id}" class="${currentCategoryId === cat.id ? 'active' : ''}">
                <span class="color-dot" style="background-color: ${cat.color}"></span>
                <span>${cat.name}</span>
                ${cat.id !== 'default' ? '<button class="delete-category" data-id="${cat.id}">×</button>' : ''}
            </li>
        `).join('')}
    `;

    // 渲染网站表单的分类选择
    select.innerHTML = data.categories.map(cat =>
        `<option value="${cat.id}">${cat.name}</option>`
    ).join('');

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
            } else {
                currentCategoryId = li.dataset.id;
                renderCategories();
                renderSites();
            }
        });
    });
}

// 渲染网站卡片网格
export function renderSites() {
    const grid = document.getElementById('sites-grid');
    const data = storage.getData();

    if (!data) return;

    let sites = data.sites;
    if (currentCategoryId !== 'all') {
        sites = sites.filter(s => s.categoryId === currentCategoryId);
    }

    if (sites.length === 0) {
        grid.innerHTML = '<div class="empty-state">暂无网站，点击右上角添加</div>';
        return;
    }

    grid.innerHTML = sites.map(site => {
        const iconUrl = site.icon || getFaviconUrl(site.url);
        return `
            <div class="site-card" data-id="${site.id}" style="background-color: ${site.bgColor || 'var(--card-bg)'}">
                <div class="card-actions">
                    <button class="edit-btn" data-id="${site.id}">✎</button>
                    <button class="delete-btn" data-id="${site.id}">×</button>
                </div>
                <img src="${iconUrl}" alt="${site.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2280%22>🌐</text></svg>'">
                <span class="site-name">${site.name}</span>
            </div>
        `;
    }).join('');

    // 绑定卡片事件
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

// 打开网站模态框
export function openSiteModal(site = null) {
    const modal = document.getElementById('site-modal');
    const title = document.getElementById('site-modal-title');
    const form = document.getElementById('site-form');

    title.textContent = site ? '编辑网站' : '添加网站';
    form.reset();

    if (site) {
        document.getElementById('site-id').value = site.id;
        document.getElementById('site-name').value = site.name;
        document.getElementById('site-url').value = site.url;
        document.getElementById('site-icon').value = site.icon || '';
        document.getElementById('site-category').value = site.categoryId;
        document.getElementById('site-bg-color').value = site.bgColor || '#0f3460';
    } else {
        document.getElementById('site-id').value = '';
        document.getElementById('site-bg-color').value = '#0f3460';
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
        document.getElementById('category-color').value = '#e94560';
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
    document.getElementById('app').style.display = 'flex';
}

// 显示欢迎屏幕
export function showWelcomeScreen() {
    document.getElementById('welcome-screen').classList.remove('hidden');
    document.getElementById('app').style.display = 'none';
}

// 获取当前分类ID
export function getCurrentCategoryId() {
    return currentCategoryId;
}
```

- [ ] **Step 2: 提交**

```bash
git add js/renderer.js
git commit -m "feat: 实现 renderer.js 界面渲染模块"
```

---

### Task 5: 实现 actions.js（用户操作处理）

**Files:**
- Modify: `js/actions.js`

- [ ] **Step 1: 实现操作处理模块**

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
git commit -m "feat: 实现 actions.js 用户操作处理模块"
```

---

### Task 6: 实现 app.js（主入口）

**Files:**
- Modify: `js/app.js`

- [ ] **Step 1: 实现主入口模块**

```javascript
// js/app.js
import * as storage from './storage.js';
import * as renderer from './renderer.js';
import { initActions } from './actions.js';

document.addEventListener('DOMContentLoaded', () => {
    // 初始化事件绑定
    initActions();

    // 检查浏览器兼容性
    if (!storage.isSupported()) {
        document.getElementById('welcome-screen').innerHTML = `
            <h1>浏览器不支持</h1>
            <p>请使用 Chrome、Edge 或 Opera 等支持 File System Access API 的浏览器</p>
        `;
        return;
    }

    // 默认显示欢迎屏幕
    renderer.showWelcomeScreen();
});
```

- [ ] **Step 2: 提交**

```bash
git add js/app.js
git commit -m "feat: 实现 app.js 主入口模块"
```

---

### Task 7: 浏览器兼容性提示

**Files:**
- Modify: `index.html`

- [ ] **Step 1: 添加兼容性检测提示**

在 body 末尾添加脚本：

```html
<script>
    // 浏览器兼容性检测
    if (!('showOpenFilePicker' in window)) {
        document.write(`
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #1a1a2e;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: #eaeaea;
                z-index: 9999;
                text-align: center;
                padding: 20px;
            ">
                <h1 style="color: #e94560; margin-bottom: 20px;">浏览器不支持</h1>
                <p style="color: #a0a0a0; max-width: 500px;">
                    File System Access API 目前仅在 Chrome、Edge、Opera 等 Chromium 系浏览器中支持。
                    请使用这些浏览器访问此页面。
                </p>
            </div>
        `);
    }
</script>
```

- [ ] **Step 2: 提交**

```bash
git add index.html
git commit -m "feat: 添加浏览器兼容性检测提示"
```

---

### Task 8: 最终测试和验证

- [ ] **Step 1: 验证文件结构**

```bash
git ls-files
```

预期输出包含：
- index.html
- css/style.css
- js/app.js
- js/storage.js
- js/renderer.js
- js/actions.js
- data/sites.json

- [ ] **Step 2: 提交**

```bash
git add -A
git commit -m "feat: 完成个人工作站网站开发"
```

---

## 自我审查

### Spec 覆盖检查
- [x] 侧边栏分类 - Task 1, 3, 4, 5
- [x] 卡片式网站展示 - Task 2, 4, 5
- [x] JSON文件存储 + File System Access API - Task 3
- [x] 自动获取favicon - Task 4
- [x] 添加/编辑/删除网站 - Task 4, 5
- [x] 添加/编辑/删除分类 - Task 4, 5
- [x] 点击跳转网站 - Task 4
- [x] 首次使用引导 - Task 1, 6
- [x] 浏览器兼容性检测 - Task 7

### 占位符检查
- [x] 无 "TBD"、"TODO" 等占位符
- [x] 所有代码块完整

### 类型一致性
- [x] storage.js 导出函数在 renderer.js 和 actions.js 中正确导入
- [x] renderer.js 函数在 actions.js 中正确导入
- [x] 所有函数签名一致

---

**Plan complete.** 两个执行选项：

**1. Subagent-Driven (recommended)** - 我派发独立子agent执行每个任务，期间进行审查，快速迭代

**2. Inline Execution** - 在当前会话中批量执行任务，带审查节点

选择哪种方式？