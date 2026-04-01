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
