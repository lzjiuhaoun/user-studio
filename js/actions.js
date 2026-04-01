// js/actions.js
import * as storage from './storage.js';
import * as renderer from './renderer.js';

// 生成UUID
function generateId() {
    return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// 初始化 Lucide 图标
function initIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// 初始化所有事件绑定
export function initActions() {
    // 初始化 Lucide 图标
    initIcons();

    // 欢迎屏幕按钮
    const selectFileBtn = document.getElementById('select-file-btn');
    const createFileBtn = document.getElementById('create-file-btn');

    if (selectFileBtn) {
        selectFileBtn.addEventListener('click', async () => {
            const data = await storage.selectFile();
            if (data) {
                renderer.showMainApp();
                renderer.initPage();
            }
        });
    }

    if (createFileBtn) {
        createFileBtn.addEventListener('click', async () => {
            const data = await storage.createFile();
            if (data) {
                renderer.showMainApp();
                renderer.initPage();
            }
        });
    }

    // 全屏按钮
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        });
    }

    // 设置按钮
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            // 打开分类管理
            renderer.openCategoryModal();
        });
    }

    // 添加组件按钮
    const addComponentBtn = document.getElementById('add-component-btn');
    if (addComponentBtn) {
        addComponentBtn.addEventListener('click', () => {
            renderer.openComponentModal();
        });
    }

    // 搜索表单提交
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchInput = document.getElementById('search-input');
            const query = searchInput.value.trim();
            if (query) {
                window.open(`https://www.bing.com/search?q=${encodeURIComponent(query)}`, '_blank');
            }
        });
    }

    // 添加网站按钮（通过组件选择模态框触发）
    // addSiteBtn 已被 component-option[data-type="shortcut"] 替代

    // 添加待办按钮（天气组件区域）
    const todoWidget = document.getElementById('todo-widget');
    if (todoWidget) {
        todoWidget.addEventListener('dblclick', () => {
            renderer.openTodoModal();
        });
    }

    // 添加按钮
    const addWidgetBtn = document.getElementById('add-widget-btn');
    if (addWidgetBtn) {
        addWidgetBtn.addEventListener('click', () => {
            renderer.openComponentModal();
        });
    }

    // 网站表单提交
    const siteForm = document.getElementById('site-form');
    if (siteForm) {
        siteForm.addEventListener('submit', async (e) => {
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
                await storage.updateSite(id, siteData);
            } else {
                siteData.id = generateId();
                await storage.addSite(siteData);
            }

            renderer.closeSiteModal();
            renderer.renderShortcuts();
        });
    }

    // 取消网站表单
    const cancelSiteBtn = document.getElementById('cancel-site-btn');
    if (cancelSiteBtn) {
        cancelSiteBtn.addEventListener('click', () => {
            renderer.closeSiteModal();
        });
    }

    // 分类表单提交
    const categoryForm = document.getElementById('category-form');
    if (categoryForm) {
        categoryForm.addEventListener('submit', async (e) => {
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
                await storage.updateCategory(id, categoryData);
            } else {
                categoryData.id = generateId();
                await storage.addCategory(categoryData);
            }

            renderer.closeCategoryModal();
        });
    }

    // 取消分类表单
    const cancelCategoryBtn = document.getElementById('cancel-category-btn');
    if (cancelCategoryBtn) {
        cancelCategoryBtn.addEventListener('click', () => {
            renderer.closeCategoryModal();
        });
    }

    // 待办表单提交
    const todoForm = document.getElementById('todo-form');
    if (todoForm) {
        todoForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const todoData = {
                id: generateId(),
                text: document.getElementById('todo-text').value.trim(),
                completed: false
            };

            if (!todoData.text) {
                alert('请输入待办内容');
                return;
            }

            await storage.addTodo(todoData);
            renderer.closeTodoModal();
            renderer.renderTodos();
        });
    }

    // 取消待办表单
    const cancelTodoBtn = document.getElementById('cancel-todo-btn');
    if (cancelTodoBtn) {
        cancelTodoBtn.addEventListener('click', () => {
            renderer.closeTodoModal();
        });
    }

    // 组件选择模态框
    const componentOptions = document.querySelectorAll('.component-option');
    componentOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            renderer.closeComponentModal();

            switch (type) {
                case 'shortcut':
                    renderer.openSiteModal();
                    break;
                case 'todo':
                    renderer.openTodoModal();
                    break;
                case 'category':
                    renderer.openCategoryModal();
                    break;
                default:
                    break;
            }
        });
    });

    // 关闭组件选择模态框
    const closeComponentModalBtn = document.getElementById('close-component-modal');
    if (closeComponentModalBtn) {
        closeComponentModalBtn.addEventListener('click', () => {
            renderer.closeComponentModal();
        });
    }

    // 点击模态框外部关闭
    const siteModal = document.getElementById('site-modal');
    const siteModalOverlay = document.getElementById('site-modal-overlay');
    if (siteModalOverlay) {
        siteModalOverlay.addEventListener('click', () => {
            renderer.closeSiteModal();
        });
    }

    const categoryModal = document.getElementById('category-modal');
    const categoryModalOverlay = document.getElementById('category-modal-overlay');
    if (categoryModalOverlay) {
        categoryModalOverlay.addEventListener('click', () => {
            renderer.closeCategoryModal();
        });
    }

    const todoModal = document.getElementById('todo-modal');
    const todoModalOverlay = document.getElementById('todo-modal-overlay');
    if (todoModalOverlay) {
        todoModalOverlay.addEventListener('click', () => {
            renderer.closeTodoModal();
        });
    }

    const componentModal = document.getElementById('component-modal');
    const componentModalOverlay = document.getElementById('component-modal-overlay');
    if (componentModalOverlay) {
        componentModalOverlay.addEventListener('click', () => {
            renderer.closeComponentModal();
        });
    }
}
