// js/renderer.js
import * as storage from './storage.js';

// HTML 转义函数，防止 XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

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
        const iconUrl = escapeHtml(site.icon || getFaviconUrl(site.url));
        return `
            <div class="site-card" data-id="${escapeHtml(site.id)}" style="background-color: ${site.bgColor || 'var(--card-bg)'}">
                <div class="card-actions">
                    <button class="edit-btn" data-id="${escapeHtml(site.id)}">✎</button>
                    <button class="delete-btn" data-id="${escapeHtml(site.id)}">×</button>
                </div>
                <img src="${iconUrl}" alt="${escapeHtml(site.name)}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2280%22>🌐</text></svg>'">
                <span class="site-name">${escapeHtml(site.name)}</span>
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
