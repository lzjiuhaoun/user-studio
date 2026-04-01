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
