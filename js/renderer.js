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

// 显示主界面
export function showMainApp() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const app = document.getElementById('app');

    if (welcomeScreen) welcomeScreen.classList.add('hidden');
    if (app) app.classList.remove('hidden');

    // 初始化 Lucide 图标
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// 显示欢迎屏幕
export function showWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const app = document.getElementById('app');

    if (welcomeScreen) welcomeScreen.classList.remove('hidden');
    if (app) app.classList.add('hidden');
}

// 渲染快捷方式网格
export function renderShortcuts() {
    const container = document.getElementById('shortcuts-container');
    const data = storage.getData();

    if (!container || !data) return;

    if (data.sites.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = data.sites.map(site => {
        const iconUrl = site.icon ? encodeURI(site.icon) : getFaviconUrl(site.url);
        return `
            <a href="#" class="col-span-1 row-span-1 flex flex-col items-center justify-center group" data-id="${escapeHtml(site.id)}">
                <div class="w-16 h-16 md:w-20 md:h-20 backdrop-blur-md border border-white/20 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2 group-hover:bg-white/20 transition-all duration-300"
                     style="background-color: ${escapeHtml(site.bgColor || '#7b68ee')}">
                    <img src="${iconUrl}" alt="${escapeHtml(site.name)}" class="w-8 h-8 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                         onerror="this.style.display='none'; this.parentElement.innerHTML='<i data-lucide=\\'globe\\' class=\\'w-8 h-8 text-white\\'></i>'">
                </div>
                <span class="mt-2 text-xs md:text-sm font-medium text-white/80 group-hover:text-white transition-colors drop-shadow-md">${escapeHtml(site.name)}</span>
            </a>
        `;
    }).join('');

    // 重新初始化 Lucide 图标
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 绑定点击事件
    container.querySelectorAll('a[data-id]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = link.dataset.id;
            const site = data.sites.find(s => s.id === id);
            if (site) {
                window.open(site.url, '_blank');
            }
        });

        // 右键编辑/删除
        link.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const id = link.dataset.id;
            const site = data.sites.find(s => s.id === id);
            if (site) {
                openSiteModal(site);
            }
        });
    });
}

// 渲染待办列表
export function renderTodos() {
    const list = document.getElementById('todo-list');
    const data = storage.getData();

    if (!list || !data) return;

    if (data.todos.length === 0) {
        list.innerHTML = `
            <li class="flex items-center text-sm bg-white/5 p-2 rounded-lg cursor-pointer hover:bg-white/10 transition-all" data-action="add-todo">
                <div class="w-4 h-4 rounded-full border border-white/50 mr-3 flex-shrink-0"></div>
                <span class="text-white/50">点击添加待办事项</span>
            </li>
        `;
        return;
    }

    list.innerHTML = data.todos.map(todo => {
        const completedClass = todo.completed ? 'line-through text-white/50' : '';
        const bgClass = todo.completed ? 'bg-white/10' : 'bg-white/10';
        const borderClass = todo.completed ? 'border-white/30 bg-white/30' : 'border-white/50';

        return `
            <li class="flex items-center text-sm ${bgClass} p-2 rounded-lg ${completedClass} transition-all group cursor-pointer ${todo.completed ? '' : 'hover:bg-white/15'}"
                data-id="${escapeHtml(todo.id)}" data-action="toggle">
                <div class="w-4 h-4 rounded-full border ${borderClass} mr-3 flex-shrink-0 flex items-center justify-center ${todo.completed ? 'bg-green-400/50' : ''}">
                    ${todo.completed ? '<i data-lucide="check" class="w-3 h-3 text-green-200"></i>' : ''}
                </div>
                <span class="flex-1">${escapeHtml(todo.text)}</span>
                <button class="delete-todo-btn opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 hover:bg-white/20 rounded"
                        data-id="${escapeHtml(todo.id)}">
                    <i data-lucide="x" class="w-3 h-3"></i>
                </button>
            </li>
        `;
    }).join('');

    // 重新初始化 Lucide 图标
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 绑定待办事项事件
    list.querySelectorAll('li[data-id]').forEach(li => {
        const id = li.dataset.id;
        const action = li.dataset.action;

        if (action === 'toggle') {
            li.addEventListener('click', async (e) => {
                if (e.target.closest('.delete-todo-btn')) return;
                const todo = data.todos.find(t => t.id === id);
                if (todo) {
                    await storage.updateTodo(id, { completed: !todo.completed });
                    renderTodos();
                }
            });

            // 删除按钮
            li.querySelector('.delete-todo-btn').addEventListener('click', async (e) => {
                e.stopPropagation();
                await storage.deleteTodo(id);
                renderTodos();
            });
        }

        if (action === 'add-todo') {
            li.addEventListener('click', () => {
                openTodoModal();
            });
        }
    });
}

// 渲染天气组件
export function renderWeather() {
    const data = storage.getData();
    if (!data || !data.weather) return;

    const weather = data.weather;
    const tempEl = document.getElementById('weather-temp');
    const descEl = document.getElementById('weather-desc');
    const windEl = document.getElementById('weather-wind');
    const humidityEl = document.getElementById('weather-humidity');

    if (tempEl) tempEl.textContent = `${weather.temp}°`;
    if (descEl) descEl.textContent = weather.desc;
    if (windEl) windEl.textContent = weather.wind;
    if (humidityEl) humidityEl.textContent = weather.humidity;
}

// 渲染名言
export function renderQuote() {
    const data = storage.getData();
    const quoteEl = document.getElementById('quote-text');

    if (quoteEl && data && data.quote) {
        quoteEl.textContent = `" ${data.quote} "`;
    }
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

    title.innerHTML = `<i data-lucide="globe" class="w-5 h-5 mr-2"></i>${site ? '编辑网站' : '添加网站'}`;
    form.reset();

    if (site) {
        document.getElementById('site-id').value = site.id;
        document.getElementById('site-name').value = site.name;
        document.getElementById('site-url').value = site.url;
        document.getElementById('site-icon').value = site.icon || '';
        document.getElementById('site-category').value = site.categoryId || 'default';
        document.getElementById('site-bg-color').value = site.bgColor || '#7b68ee';
    } else {
        document.getElementById('site-id').value = '';
        document.getElementById('site-bg-color').value = '#7b68ee';
    }

    modal.classList.remove('hidden');

    // 重新初始化 Lucide 图标
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 渲染分类选择
    renderCategorySelect();
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

    title.innerHTML = `<i data-lucide="folder" class="w-5 h-5 mr-2"></i>${category ? '编辑分类' : '添加分类'}`;
    form.reset();

    if (category) {
        document.getElementById('category-id').value = category.id;
        document.getElementById('category-name').value = category.name;
        document.getElementById('category-color').value = category.color;
    } else {
        document.getElementById('category-id').value = '';
        document.getElementById('category-color').value = '#7b68ee';
    }

    modal.classList.remove('hidden');

    // 重新初始化 Lucide 图标
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// 关闭分类模态框
export function closeCategoryModal() {
    document.getElementById('category-modal').classList.add('hidden');
}

// 打开待办模态框
export function openTodoModal() {
    const modal = document.getElementById('todo-modal');
    const form = document.getElementById('todo-form');

    form.reset();
    modal.classList.remove('hidden');

    // 重新初始化 Lucide 图标
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// 关闭待办模态框
export function closeTodoModal() {
    document.getElementById('todo-modal').classList.add('hidden');
}

// 打开组件选择模态框
export function openComponentModal() {
    const modal = document.getElementById('component-modal');
    modal.classList.remove('hidden');

    // 重新初始化 Lucide 图标
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// 关闭组件选择模态框
export function closeComponentModal() {
    document.getElementById('component-modal').classList.add('hidden');
}

// 渲染网站表单的分类选择
function renderCategorySelect() {
    const select = document.getElementById('site-category');
    const data = storage.getData();

    if (!select || !data) return;

    select.innerHTML = data.categories.map(cat =>
        `<option value="${escapeHtml(cat.id)}" style="background-color: ${escapeHtml(cat.color)}">${escapeHtml(cat.name)}</option>`
    ).join('');
}

// 渲染分类列表（用于侧边栏或其他分类展示）
export function renderCategories() {
    // 新的布局中可能不需要侧边栏分类列表
    // 这个函数保留用于可能的扩展
}

// 初始化页面
export function initPage() {
    const data = storage.getData();
    if (!data) return;

    renderShortcuts();
    renderTodos();
    renderWeather();
    renderQuote();

    // 初始化 Lucide 图标
    if (window.lucide) {
        window.lucide.createIcons();
    }
}
